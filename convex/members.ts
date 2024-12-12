import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { getClerkId } from "./users";

/**
 * Retrieves the members of a specified project along with their associated user information.
 *
 * @param {Object} args - The arguments for the query.
 * @param {Id<"projects">} args.projectId - The ID of the project for which to retrieve members.
 *
 * @returns {Promise<(Doc<"members"> & { user: Doc<"users"> })[]>} - A promise that resolves to an array of member documents, each augmented with the corresponding user document.
 * If no members are found, an empty array is returned.
 *
 * @throws {Error} - Throws an error if a user associated with a member cannot be found.
 */
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

/**
 * Retrieves the access information for a user in a specified project.
 *
 * This query checks if the authenticated user is a member of the specified project.
 * It retrieves the user's clerk ID from the authentication context, fetches the project
 * by its ID, and then checks if the user is listed as a member of that project.
 *
 * @param {Object} args - The arguments for the query.
 * @param {Id<"projects">} args.projectId - The ID of the project for which to check access.
 *
 * @returns {Promise<Doc<"members">>} - A promise that resolves to the member document
 * associated with the user in the specified project.
 *
 * @throws {Error} - Throws an error if the project is not found or if the user is not a member of the project.
 */
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

/**
 * Retrieves the access information for multiple projects for the authenticated user.
 *
 * This query checks if the authenticated user is a member of each specified project.
 * It takes an array of project IDs as input and returns an array of member documents
 * associated with the user for each project.
 *
 * @param {Object} args - The arguments for the query.
 * @param {Id<"projects">[]} args.projectIds - An array of project IDs for which to check access.
 *
 * @returns {Promise<Doc<"members">[]>} - A promise that resolves to an array of member documents,
 * each representing the user's access information for the corresponding project.
 *
 * @throws {Error} - Throws an error if any of the projects are not found or if the user is not a member
 * of any of the specified projects.
 */
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

/**
 * Creates a new member for a specified project.
 *
 * This mutation allows the addition of a user as a member of a project.
 * It checks if the user is already a member of the project before creating
 * a new member entry. If the user already exists, an error is thrown.
 *
 * @param {Object} args - The arguments for the mutation.
 * @param {Id<"projects">} args.projectId - The ID of the project to which the member is being added.
 * @param {string} args.clerkId - The Clerk ID of the user being added as a member.
 * @param {"admin" | "member"} args.role - The role assigned to the new member, either "admin" or "member".
 *
 * @returns {Promise<Id<"members">>} - Returns the ID of the newly created member or throws an error if the member already exists.
 *
 * @throws {Error} - Throws an error if the member already exists in the project.
 */
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

/**
 * Updates the role of a specified member in a project.
 *
 * This mutation allows changing the role of an existing member to either "admin" or "member".
 * It first checks if the member exists in the database. If the member is found, their role is updated.
 * If the member does not exist, an error is thrown.
 *
 * @param {Object} args - The arguments for the mutation.
 * @param {Id<"members">} args.memberId - The ID of the member whose role is to be updated.
 * @param {"admin" | "member"} args.role - The new role to assign to the member, either "admin" or "member".
 *
 * @returns {Promise<boolean>} - Returns true if the role was successfully updated, or false if an error occurred.
 *
 * @throws {Error} - Throws an error if the member is not found or if any other error occurs during the process.
 */
export const updateRole = mutation({
  args: {
    memberId: v.id("members"),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    try {
      await getClerkId(ctx.auth);

      const member = await ctx.db.get(args.memberId);
      if (!member) {
        throw new Error("Member not found");
      }

      await ctx.db.patch(args.memberId, {
        role: args.role,
      });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
});

/**
 * Removes a specified member from a project.
 *
 * This mutation deletes a member from the database based on their member ID.
 * It first checks if the member exists in the database. If the member is found,
 * they are deleted. If the member does not exist, an error is thrown.
 *
 * @param {Object} args - The arguments for the mutation.
 * @param {Id<"members">} args.memberId - The ID of the member to be removed.
 *
 * @returns {Promise<boolean>} - Returns true if the member was successfully removed,
 *                               or false if an error occurred.
 *
 * @throws {Error} - Throws an error if the member is not found or if any other error
 *                   occurs during the process.
 */
export const remove = mutation({
  args: {
    memberId: v.id("members"),
  },
  handler: async (ctx, args) => {
    try {
      await getClerkId(ctx.auth);

      const member = await ctx.db.get(args.memberId);
      if (!member) {
        throw new Error("Member not found");
      }

      await ctx.db.delete(args.memberId);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
});

/**
 * Removes members that are not associated with any project.
 *
 * This mutation queries all members in the database and checks if each member
 * has an associated project. If a member does not have a corresponding project,
 * it is deleted from the database.
 *
 * @param {Object} ctx - The context object containing authentication and database access.
 * @param {Object} args - The arguments for the mutation (currently unused).
 * @returns {Promise<boolean>} - A promise that resolves to true if the operation was successful,
 *                               or false if an error occurred during the process.
 *
 * @throws {Error} - Throws an error if there is an issue querying or deleting members.
 */
export const removeMemberWithNoProject = mutation({
  handler: async (ctx, args): Promise<boolean> => {
    try {
      const members = await ctx.db.query("members").collect();
      for (const m of members) {
        const project = await ctx.db.get(m.projectId);
        if (!project) {
          await ctx.db.delete(m._id);
        }
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
});
