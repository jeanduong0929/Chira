import { v } from "convex/values";
import { Auth } from "convex/server";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    storyPoints: v.optional(v.string()),
    sprintId: v.optional(v.id("sprints")),
    assigneeId: v.optional(v.string()),
    issueType: v.union(v.literal("story"), v.literal("bug"), v.literal("task")),
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    try {
      await getClerkId(ctx.auth);

      console.log(args.storyPoints);

      const issues = await ctx.db
        .query("issues")
        .withIndex("by_project_id_sequence", (q) =>
          q.eq("projectId", args.projectId),
        )
        .collect();

      return await ctx.db.insert("issues", {
        title: args.title,
        description: args.description,
        storyPoints: args.storyPoints,
        sprintId: args.sprintId,
        assigneeId: args.assigneeId,
        projectId: args.projectId,
        issueType: args.issueType,
        sequence: issues.length,
      });
    } catch (error) {
      console.error(error);
    }
  },
});

export const getAll = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    try {
      return await ctx.db
        .query("issues")
        .withIndex("by_project_id_sequence", (q) =>
          q.eq("projectId", args.projectId).gte("sequence", 0),
        )
        .order("asc")
        .collect();
    } catch (error) {
      console.error(error);
    }
  },
});

export const getById = query({
  args: {
    issueId: v.id("issues"),
  },
  handler: async (ctx, args) => {
    try {
      const issue = await ctx.db.get(args.issueId);
      if (!issue) {
        throw new Error("Issue not found");
      }

      const assignee = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) =>
          q.eq("clerkId", issue.assigneeId as string),
        )
        .unique();

      return { ...issue, assignee };
    } catch (error) {
      console.error(error);
    }
  },
});

export const update = mutation({
  args: {
    issueId: v.id("issues"),
    title: v.string(),
    description: v.optional(v.string()),
    storyPoints: v.optional(v.string()),
    sprintId: v.optional(v.id("sprints")),
    assigneeId: v.optional(v.string()),
    issueType: v.union(v.literal("story"), v.literal("bug"), v.literal("task")),
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    try {
      await getClerkId(ctx.auth);

      const issue = await ctx.db.get(args.issueId);
      if (!issue) {
        throw new Error("Issue not found");
      }

      await ctx.db.patch(args.issueId, {
        title: args.title,
        description: args.description,
        storyPoints: args.storyPoints,
        sprintId: args.sprintId,
        assigneeId: args.assigneeId,
        projectId: args.projectId,
        issueType: args.issueType,
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
});

export const moveToTop = mutation({
  args: {
    issueId: v.id("issues"),
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    try {
      await getClerkId(ctx.auth);

      const issues = await ctx.db
        .query("issues")
        .withIndex("by_project_id_sequence", (q) =>
          q.eq("projectId", args.projectId).gte("sequence", 0),
        )
        .collect();

      // If issue is already at top, do nothing
      if (issues[0]._id === args.issueId) {
        return true;
      }

      // Shift all issues down
      for (let i = 0; i < issues.length; i++) {
        await ctx.db.patch(issues[i]._id, {
          sequence: i + 1,
        });
      }

      // Move issue to top
      await ctx.db.patch(args.issueId, {
        sequence: 0,
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
});

export const moveToSprint = mutation({
  args: {
    issueId: v.id("issues"),
    sprintId: v.id("sprints"),
  },
  handler: async (ctx, args) => {
    try {
      await getClerkId(ctx.auth);

      const issue = await ctx.db.get(args.issueId);
      if (!issue) {
        throw new Error("Issue not found");
      }

      await ctx.db.patch(args.issueId, {
        sprintId: args.sprintId,
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
});

export const updateSequence = mutation({
  args: {
    issues: v.array(
      v.object({
        issueId: v.id("issues"),
        sequence: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    try {
      await getClerkId(ctx.auth);

      for (const i of args.issues) {
        const issue = await ctx.db.get(i.issueId);
        if (!issue) {
          throw new Error("Issue not found");
        }
        await ctx.db.patch(issue._id, {
          sequence: i.sequence,
        });
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
});

export const remove = mutation({
  args: {
    issueId: v.id("issues"),
  },
  handler: async (ctx, args) => {
    try {
      await getClerkId(ctx.auth);
      const issue = await ctx.db.get(args.issueId);
      if (!issue) {
        throw new Error("Issue not found");
      }
      await ctx.db.delete(args.issueId);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
});

const getClerkId = async (auth: Auth) => {
  const identity = await auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized");
  }
  return identity.subject;
};
