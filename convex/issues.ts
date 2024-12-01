import { v } from "convex/values";
import { Auth } from "convex/server";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    storyPoints: v.optional(v.number()),
    sprintId: v.optional(v.id("sprints")),
    assigneeId: v.optional(v.string()),
    projectId: v.id("projects"),
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
