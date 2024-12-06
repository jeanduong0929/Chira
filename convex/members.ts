import { v } from "convex/values";
import { Auth } from "convex/server";
import { mutation, query } from "./_generated/server";
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

export const getAccess = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    try {
      // get clerk id
      const clerkId = await getClerkId(ctx.auth);

      // get project
      const project = await ctx.db.get(args.projectId);
      if (!project) {
        throw new Error("Project not found");
      }

      // check if user is in project
      const member = await ctx.db
        .query("members")
        .withIndex("by_project_id_clerk_id", (q) =>
          q.eq("projectId", project._id).eq("clerkId", clerkId),
        )
        .unique();
      if (!member) {
        throw new Error("Member not found");
      }

      return member;
    } catch (e) {
      console.error(e);
    }
  },
});

export const getProjectsAccess = query({
  args: {
    projectIds: v.array(v.id("projects")),
  },
  handler: async (ctx, args) => {
    try {
      const results = [];
      for (const projectId of args.projectIds) {
        const member = await getAccess(ctx, { projectId });
        results.push(member);
      }
      return results;
    } catch (e) {
      console.error(e);
    }
  },
});

export const create = mutation({
  args: {
    projectId: v.id("projects"),
    clerkId: v.string(),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    try {
      await getClerkId(ctx.auth);

      const existingMember = await ctx.db
        .query("members")
        .withIndex("by_project_id_clerk_id", (q) =>
          q.eq("projectId", args.projectId).eq("clerkId", args.clerkId),
        )
        .unique();
      if (existingMember) {
        throw new Error("Member already exists");
      }

      return await ctx.db.insert("members", {
        projectId: args.projectId,
        clerkId: args.clerkId,
        role: args.role,
      });
    } catch (e) {
      console.error(e);
      throw e;
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
