import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";
import { getClerkId } from "./users";

export const create = mutation({
  args: {
    recipientId: v.string(),
    projectId: v.id("projects"),
  },
  handler: async (ctx, args): Promise<Id<"notifications"> | undefined> => {
    try {
      const clerkId = await getClerkId(ctx.auth);

      const notification = await ctx.db
        .query("notifications")
        .withIndex("by_project_id", (q) => q.eq("projectId", args.projectId))
        .unique();

      if (notification) {
        throw new Error("Notification already exists");
      }

      return await ctx.db.insert("notifications", {
        type: "project_invite",
        recipientId: args.recipientId,
        senderId: clerkId,
        projectId: args.projectId,
        status: "pending",
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
});
