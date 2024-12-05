import { v } from "convex/values";
import { Auth } from "convex/server";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    storyPoints: v.optional(v.string()),
    sprintId: v.optional(v.id("sprints")),
    assigneeId: v.optional(v.string()),
    issueType: v.union(v.literal("story"), v.literal("bug"), v.literal("task")),
    projectId: v.id("projects"),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
  },
  handler: async (ctx, args) => {
    try {
      await getClerkId(ctx.auth);

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
        status: "not_started",
        priority: args.priority,
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

export const getBySprintId = query({
  args: {
    sprintId: v.id("sprints"),
  },
  handler: async (ctx, args) => {
    try {
      const clerkId = await getClerkId(ctx.auth);

      const issues = await ctx.db
        .query("issues")
        .withIndex("by_sprint_id", (q) => q.eq("sprintId", args.sprintId))
        .collect();

      const issuesWithAssignee: (Doc<"issues"> & {
        assignee:
          | (Doc<"members"> & {
              user: {
                name: string;
                imageUrl: string;
              };
            })
          | null;
      })[] = [];

      // Get assignee for each issue
      for (const issue of issues) {
        const assignee = await ctx.db
          .query("members")
          .withIndex("by_clerk_id", (q) =>
            q.eq("clerkId", issue.assigneeId as string),
          )
          .unique();

        if (assignee) {
          const assigneeUser = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", assignee.clerkId))
            .unique();

          issuesWithAssignee.push({
            ...issue,
            assignee: {
              ...assignee,
              user: {
                name: assigneeUser?.name as string,
                imageUrl: assigneeUser?.imageUrl as string,
              },
            },
          });
        } else {
          issuesWithAssignee.push({
            ...issue,
            assignee: null,
          });
        }
      }

      return issuesWithAssignee;
    } catch (error) {
      console.error(error);
      return [];
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
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
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
        priority: args.priority,
        status: "not_started",
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

export const moveToBacklog = mutation({
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

      await ctx.db.patch(args.issueId, {
        sprintId: undefined,
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

export const updateStatus = mutation({
  args: {
    issue: v.object({
      id: v.id("issues"),
      status: v.union(
        v.literal("not_started"),
        v.literal("in_progress"),
        v.literal("completed"),
      ),
    }),
  },
  handler: async (ctx, args) => {
    try {
      await getClerkId(ctx.auth);

      const issue = await ctx.db.get(args.issue.id);
      if (!issue) {
        throw new Error("Issue not found");
      }
      await ctx.db.patch(issue._id, {
        status: args.issue.status,
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
});

export const updateAssignee = mutation({
  args: {
    issue: v.object({
      id: v.id("issues"),
      assigneeId: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    try {
      await getClerkId(ctx.auth);

      const issue = await ctx.db.get(args.issue.id);
      if (!issue) {
        throw new Error("Issue not found");
      }

      const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.issue.assigneeId))
        .unique();

      await ctx.db.patch(issue._id, {
        assigneeId: args.issue.assigneeId,
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
