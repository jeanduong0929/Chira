import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { getClerkId } from "./users";

export const getAll = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    try {
      const sprints = await ctx.db
        .query("sprints")
        .withIndex("by_project_id", (q) => q.eq("projectId", args.projectId))
        .collect();

      const sprintsWithIssues: (Doc<"sprints"> & {
        issues: Doc<"issues">[];
      })[] = [];

      for (const s of sprints) {
        const issues = await ctx.db
          .query("issues")
          .withIndex("by_sprint_id", (q) => q.eq("sprintId", s._id))
          .collect();

        sprintsWithIssues.push({ ...s, issues });
      }

      return sprintsWithIssues;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
});

export const getById = query({
  args: {
    sprintId: v.id("sprints"),
  },
  handler: async (ctx, args) => {
    try {
      const sprint = await ctx.db.get(args.sprintId);
      if (!sprint) throw new Error("Sprint not found");

      const issues = await ctx.db
        .query("issues")
        .withIndex("by_sprint_id", (q) => q.eq("sprintId", args.sprintId))
        .collect();

      return { ...sprint, issues };
    } catch (error) {
      console.error(error);
    }
  },
});

export const getActiveSprintByProjectId = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    try {
      return ctx.db
        .query("sprints")
        .withIndex("by_project_id_status", (q) =>
          q.eq("projectId", args.projectId).eq("status", "active"),
        )
        .unique();
    } catch (error) {
      console.error(error);
    }
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    projectId: v.id("projects"),
    index: v.number(),
  },
  handler: async (ctx, args) => {
    try {
      await getClerkId(ctx.auth);

      return await ctx.db.insert("sprints", {
        name: `SCRUM Sprint ${args.name}`,
        projectId: args.projectId,
        status: "not_started",
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  },
});

export const update = mutation({
  args: {
    sprintId: v.id("sprints"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      await getClerkId(ctx.auth);
      const sprint = await ctx.db.get(args.sprintId);
      if (!sprint) throw new Error("Sprint not found");

      await ctx.db.patch(args.sprintId, {
        name: args.name,
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
});

export const startSprint = mutation({
  args: {
    sprintId: v.id("sprints"),
    start: v.string(),
    end: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      await getClerkId(ctx.auth);

      const sprint = await ctx.db.get(args.sprintId);
      if (!sprint) throw new Error("Sprint not found");

      await ctx.db.patch(args.sprintId, {
        startDate: args.start,
        endDate: args.end,
        status: "active",
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
});

export const completeSprint = mutation({
  args: {
    name: v.optional(v.string()),
    sprintId: v.id("sprints"),
    issuesIds: v.array(v.id("issues")),
    openIssues: v.union(v.literal("backlog"), v.literal("new_sprint")),
  },
  handler: async (ctx, args) => {
    try {
      await getClerkId(ctx.auth);
      const sprint = await ctx.db.get(args.sprintId);
      if (!sprint) throw new Error("Sprint not found");

      // Complete sprint
      await ctx.db.patch(args.sprintId, {
        status: "completed",
      });

      // Move open issues to backlog or new sprint
      if (args.openIssues === "backlog") {
        for (const issueId of args.issuesIds) {
          await ctx.db.patch(issueId, {
            sprintId: undefined,
          });
        }
      } else if (args.openIssues === "new_sprint") {
        const sprints = await ctx.db
          .query("sprints")
          .withIndex("by_project_id", (q) =>
            q.eq("projectId", sprint.projectId),
          )
          .collect();

        // Create new sprint
        const newSprintId = await ctx.db.insert("sprints", {
          name: `SCRUM Sprint ${args.name ?? sprints.length + 1}`,
          projectId: sprint.projectId,
          status: "not_started",
        });

        for (const issueId of args.issuesIds) {
          await ctx.db.patch(issueId, {
            sprintId: newSprintId,
          });
        }
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
});

export const notStarted = mutation({
  args: {
    sprintId: v.id("sprints"),
  },
  handler: async (ctx, args) => {
    try {
      await getClerkId(ctx.auth);

      const sprint = await ctx.db.get(args.sprintId);
      if (!sprint) throw new Error("Sprint not found");

      // Change status to not started and clear start and end dates
      await ctx.db.patch(args.sprintId, {
        status: "not_started",
        startDate: undefined,
        endDate: undefined,
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
});

export const remove = mutation({
  args: {
    sprintId: v.id("sprints"),
  },
  handler: async (ctx, args) => {
    try {
      await getClerkId(ctx.auth);
      const sprint = await ctx.db.get(args.sprintId);

      if (!sprint) throw new Error("Sprint not found");
      await ctx.db.delete(args.sprintId);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
});

/**
 * Removes sprints that are not associated with any project.
 *
 * This mutation queries all sprints in the database and checks if each sprint
 * has an associated project. If a sprint does not have a corresponding project,
 * it is deleted from the database.
 *
 * @param {Object} ctx - The context object containing authentication and database access.
 * @param {Object} args - The arguments for the mutation (currently unused).
 * @returns {Promise<boolean>} - A promise that resolves to true if the operation was successful,
 * or false if an error occurred during the process.
 *
 * @throws {Error} - Throws an error if there is an issue querying or deleting sprints.
 */
export const removeSprintWithNoProject = mutation({
  handler: async (ctx, args): Promise<boolean> => {
    try {
      const sprints = await ctx.db.query("sprints").collect();
      for (const s of sprints) {
        const project = await ctx.db.get(s.projectId);
        if (!project) {
          await ctx.db.delete(s._id);
        }
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
});
