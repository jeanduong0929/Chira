import { v } from "convex/values";
import { Auth } from "convex/server";
import { mutation } from "./_generated/server";

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const clerkId = await getClerkId(ctx.auth);

      return await ctx.db.insert("projects", {
        name: args.name,
        clerkId,
      });
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
