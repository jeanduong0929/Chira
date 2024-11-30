import { Auth } from "convex/server";
import { mutation } from "./_generated/server";

export const create = mutation({
  handler: async (ctx) => {
    try {
      const clerkId = await getClerkId(ctx.auth);

      const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
        .unique();

      if (!user) {
        return await ctx.db.insert("users", {
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
