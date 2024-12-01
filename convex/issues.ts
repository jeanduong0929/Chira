import { v } from "convex/values";
import { Auth } from "convex/server";
import { mutation } from "./_generated/server";

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
      return await ctx.db.insert("issues", {
        title: args.title,
        description: args.description,
        storyPoints: args.storyPoints,
        sprintId: args.sprintId,
        assigneeId: args.assigneeId,
        projectId: args.projectId,
      });
    } catch (error) {
      console.error(error);
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
