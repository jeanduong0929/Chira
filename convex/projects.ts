import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { getClerkId } from "./users";

/**
 * Retrieves all projects associated with the authenticated user, along with the corresponding user information.
 *
 * This query fetches projects from the database based on the clerk ID of the authenticated user.
 * It returns an array of project documents, each augmented with the corresponding user document.
 * If no projects are found, an empty array is returned.
 *
 * @returns {Promise<(Doc<"projects"> & { user: Doc<"users"> })[]>} - A promise that resolves to an array of project documents,
 * each containing the associated user document. If no projects are found, an empty array is returned.
 *
 * @throws {Error} - Throws an error if a user associated with a project cannot be found.
 */
export const getAllWithUser = query({
  handler: async (
    ctx,
  ): Promise<(Doc<"projects"> & { user: Doc<"users"> })[]> => {
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
      return [];
    }
  },
});

/**
 * Retrieves all projects associated with the authenticated user, along with their corresponding member and user information.
 *
 * This query fetches the clerk ID of the authenticated user, retrieves all members associated with that clerk ID,
 * and then links each member to their respective project and user. If a project or user cannot be found,
 * an error is thrown.
 *
 * @param {Object} ctx - The context object containing authentication and database access.
 *
 * @returns {Promise<(Doc<"projects"> & { member: Doc<"members">; user: Doc<"users"> })[]>} - A promise that resolves to an array of project documents,
 * each augmented with the corresponding member and user documents. If no projects are found, an empty array is returned.
 *
 * @throws {Error} - Throws an error if a project or user associated with a member cannot be found.
 */
export const getAllUserProjects = query({
  handler: async (
    ctx,
  ): Promise<
    | (Doc<"projects"> & { member: Doc<"members">; user: Doc<"users"> })[]
    | undefined
  > => {
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
        member: Doc<"members">;
        user: Doc<"users">;
      })[] = [];
      for (const m of members) {
        const project = await ctx.db.get(m.projectId);

        if (!project) {
          throw new Error("Project not found");
        }
        if (project.softDeleted) {
          continue;
        }
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", project.clerkId))
          .unique();
        if (!user) {
          throw new Error("User not found");
        }

        projectsWithMembers.push({ ...project, member: m, user });
      }

      return projectsWithMembers;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  },
});

/**
 * Retrieves a project by its ID along with the associated user information.
 *
 * This query fetches a project document from the database using the provided project ID.
 * It also retrieves the user associated with the project based on the clerk ID stored in the project document.
 *
 * @param {Object} args - The arguments for the query.
 * @param {Id<"projects">} args.projectId - The ID of the project to retrieve.
 *
 * @returns {Promise<Doc<"projects"> & { user: Doc<"users"> }>} - A promise that resolves to the project document,
 * augmented with the corresponding user document. If the project or user is not found, an error is thrown.
 *
 * @throws {Error} - Throws an error if the project or user associated with the project cannot be found.
 */
export const getByIdWithUser = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (
    ctx,
    args,
  ): Promise<(Doc<"projects"> & { user: Doc<"users"> }) | null | undefined> => {
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

/**
 * Creates a new project and assigns the authenticated user as an admin member of that project.
 *
 * This mutation inserts a new project document into the database with the specified name,
 * sets the `softDeleted` field to false, and associates the project with the authenticated user's
 * clerk ID. It also creates a new member entry in the `members` table, assigning the user the role of "admin".
 *
 * @param {Object} args - The arguments for the mutation.
 * @param {string} args.name - The name of the project to be created.
 *
 * @returns {Promise<Id<"projects">>} - A promise that resolves to the ID of the newly created project.
 *
 * @throws {Error} - Throws an error if the user is not authenticated or if any other error occurs
 *                   during the project creation process.
 */
export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args): Promise<Id<"projects"> | undefined> => {
    try {
      const clerkId = await getClerkId(ctx.auth);

      if(args.name.length < 3){
        throw new Error("Project name must be at least 3 characters long.");
      }
      // create new project
      const projectId = await ctx.db.insert("projects", {
        name: args.name,
        softDeleted: false,
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

/**
 * Updates the name of a specified project.
 *
 * This mutation modifies the name of an existing project in the database.
 * It first checks if the user is authenticated by retrieving their clerk ID.
 * If the project is found, it updates the project's name with the provided value.
 * If the project is not found or if any other error occurs, it returns false.
 *
 * @param {Object} args - The arguments for the mutation.
 * @param {Id<"projects">} args.projectId - The ID of the project to be updated.
 * @param {string} args.name - The new name for the project.
 *
 * @returns {Promise<boolean>} - Returns true if the project name was successfully updated,
 *                               or false if an error occurred.
 *
 * @throws {Error} - Throws an error if the user is not authenticated or if the project
 *                   cannot be found.
 */
export const update = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.string(),
  },
  handler: async (ctx, args): Promise<boolean> => {
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

/**
 * Soft deletes a specified project by marking it as deleted in the database.
 *
 * This mutation updates the `softDeleted` field of the project to `true`,
 * indicating that the project is no longer active. It first checks if the
 * user is authenticated and retrieves the project by its ID. If the project
 * is found, it updates the project; otherwise, it throws an error.
 *
 * @param {Object} args - The arguments for the mutation.
 * @param {Id<"projects">} args.projectId - The ID of the project to be soft deleted.
 *
 * @returns {Promise<boolean>} - Returns true if the project was successfully soft deleted,
 *                               or false if an error occurred.
 *
 * @throws {Error} - Throws an error if the project is not found or if any other error
 *                   occurs during the process.
 */
export const softDelete = mutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args): Promise<boolean> => {
    try {
      await getClerkId(ctx.auth);
      const project = await ctx.db.get(args.projectId);
      if (!project) {
        throw new Error("Project not found");
      }

      await ctx.db.patch(project._id, { softDeleted: true });

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
});

/**
 * Removes a specified project and its associated members from the database.
 *
 * This mutation first checks if the user is authenticated and retrieves the project
 * by its ID. If the project is found, it deletes all members associated with the project
 * before deleting the project itself. If the project is not found, an error is thrown.
 *
 * @param {Object} args - The arguments for the mutation.
 * @param {Id<"projects">} args.projectId - The ID of the project to be removed.
 *
 * @returns {Promise<boolean>} - Returns true if the project and its members were successfully removed,
 *                               or false if an error occurred.
 *
 * @throws {Error} - Throws an error if the project is not found or if any other error
 *                   occurs during the process.
 */
export const remove = mutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args): Promise<boolean> => {
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
