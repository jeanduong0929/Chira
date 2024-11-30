import { v } from "convex/values";
import { Auth } from "convex/server";
import { mutation, query } from "./_generated/server";

export const getAllWithUser = query({
  handler: async (ctx) => {
    try {
      const clerkId = await getClerkId(ctx.auth);

      const projects = await ctx.db
        .query("projects")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
        .collect();

      if (projects.length === 0) {
        return [];
      }

      const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
        .unique();

      if (!user) {
        throw new Error("User not found");
      }

      return projects.map((project) => ({
        ...project,
        user,
      }));
    } catch (e) {
      console.error(e);
    }
  },
});

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
