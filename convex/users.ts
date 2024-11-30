import { Auth } from "convex/server";
import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const create = mutation({
  args: {
    name: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      const clerkId = await getClerkId(ctx.auth);

      const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
        .unique();

      if (!user) {
        return await ctx.db.insert("users", {
          name: args.name,
          imageUrl: args.imageUrl,
          clerkId: clerkId,
        });
      }

      return user._id;
    } catch (e) {
      console.error(e);
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