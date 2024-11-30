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

export const getByIdWithUser = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    try {
      const clekrId = await getClerkId(ctx.auth);

      const project = await ctx.db.get(args.projectId);
      if (!project) {
        throw new Error("Project not found");
      }

      const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", clekrId))
        .unique();

      if (!user) {
        throw new Error("User not found");
      }

      return { ...project, user };
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

export const update = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      await getClerkId(ctx.auth);
      await ctx.db.patch(args.projectId, { name: args.name });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
});

export const remove = mutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    try {
      await getClerkId(ctx.auth);

      const project = await ctx.db.get(args.projectId);
      if (!project) {
        throw new Error("Project not found");
      }

      await ctx.db.delete(args.projectId);
      return true;
    } catch (e) {
      console.error(e);
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
