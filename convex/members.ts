import { v } from "convex/values";
import { query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

export const getMembers = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    try {
      const members = await ctx.db
        .query("members")
        .withIndex("by_project_id", (q) => q.eq("projectId", args.projectId))
        .collect();
      if (!members) {
        return [];
      }

      const result: (Doc<"members"> & { user: Doc<"users"> })[] = [];
      for (const m of members) {
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", m.clerkId))
          .unique();
        if (!user) {
          throw new Error("User not found");
        }
        result.push({
          ...m,
          user,
        });
      }
      return result;
    } catch (e) {
      console.error(e);
    }
  },
});
