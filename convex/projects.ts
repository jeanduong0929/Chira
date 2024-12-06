import { v } from "convex/values";
import { Auth } from "convex/server";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

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

      const projectsWithUser: (Doc<"projects"> & {
        user: Doc<"users">;
      })[] = [];
      for (const p of projects) {
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", p.clerkId))
          .unique();

        if (!user) {
          throw new Error("User not found");
        }

        projectsWithUser.push({ ...p, user });
      }

      return projectsWithUser;
    } catch (e) {
      console.error(e);
    }
  },
});

export const getAllUserProjects = query({
  handler: async (ctx) => {
    try {
      // get clerk id
      const clerkId = await getClerkId(ctx.auth);

      // get all members
      const members = await ctx.db
        .query("members")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
        .collect();

      // link members to projects
      const projectsWithMembers: (Doc<"projects"> & {
        user: Doc<"users">;
      })[] = [];
      for (const m of members) {
        const project = await ctx.db.get(m.projectId);
        if (!project) {
          throw new Error("Project not found");
        }
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", project.clerkId))
          .unique();
        if (!user) {
          throw new Error("User not found");
        }

        projectsWithMembers.push({ ...project, user });
      }

      return projectsWithMembers;
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
      const project = await ctx.db.get(args.projectId);
      if (!project) {
        throw new Error("Project not found");
      }

      const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", project.clerkId))
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

      // create new project
      const projectId = await ctx.db.insert("projects", {
        name: args.name,
        clerkId,
      });

      // create new member
      await ctx.db.insert("members", {
        clerkId: clerkId,
        projectId,
        role: "admin",
      });

      return projectId;
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

      // delete all members
      const members = await ctx.db
        .query("members")
        .withIndex("by_project_id", (q) => q.eq("projectId", project._id))
        .collect();
      for (const member of members) {
        await ctx.db.delete(member._id);
      }

      // delete project
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
