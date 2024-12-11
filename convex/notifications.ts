import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { getClerkId } from "./users";

type NotificationWithProject = Doc<"notifications"> & {
  project: Doc<"projects">;
};

/**
 * Creates a new notification for a project invite.
 *
 * @param {Object} args - The arguments for the mutation.
 * @param {string} args.recipientId - The ID of the user who will receive the notification.
 * @param {Id<"projects">} args.projectId - The ID of the project for which the notification is being created.
 *
 * @returns {Promise<Id<"notifications"> | undefined>} - Returns the ID of the newly created notification or undefined if an error occurs.
 *
 * @throws {Error} - Throws an error if a notification for the specified project already exists.
 */
export const create = mutation({
  args: {
    recipientId: v.string(),
    projectId: v.id("projects"),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args): Promise<Id<"notifications"> | undefined> => {
    try {
      const clerkId = await getClerkId(ctx.auth);

      // If the user is already a member of the project, don't create a notification
      const member = await ctx.db
        .query("members")
        .withIndex("by_project_id_clerk_id", (q) =>
          q.eq("projectId", args.projectId).eq("clerkId", args.recipientId),
        )
        .unique();
      if (member) {
        throw new Error("Member already exists");
      }

      const notification = await ctx.db
        .query("notifications")
        .withIndex("by_project_id", (q) => q.eq("projectId", args.projectId))
        .unique();

      if (notification?.status === "pending") {
        throw new Error("Notification already exists");
      }

      return await ctx.db.insert("notifications", {
        type: "project_invite",
        recipientId: args.recipientId,
        senderId: clerkId,
        projectId: args.projectId,
        role: args.role,
        status: "pending",
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
});

/**
 * Accepts a project invitation notification and adds the recipient as a member of the project.
 *
 * This mutation updates the status of the specified notification to "accepted" and checks if the recipient
 * is already a member of the project. If not, it adds the recipient as a member with the role specified in the notification.
 *
 * @param {Object} args - The arguments for the mutation.
 * @param {Id<"notifications">} args.notificationId - The ID of the notification to accept.
 *
 * @returns {Promise<boolean>} - Returns true if the notification was successfully accepted and the member was added,
 *                               or false if an error occurred.
 *
 * @throws {Error} - Throws an error if the notification is not found, if the member already exists, or if any other error occurs during the process.
 */
export const accept = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args): Promise<boolean> => {
    try {
      const clerkId = await getClerkId(ctx.auth);

      const notification = await ctx.db.get(args.notificationId);
      if (!notification) {
        throw new Error("Notification not found");
      }
      if (notification.status !== "pending") {
        throw new Error("Notification is not pending");
      }
      if (notification.recipientId !== clerkId) {
        throw new Error("You are not the recipient of this notification");
      }

      const member = await ctx.db
        .query("members")
        .withIndex("by_project_id_clerk_id", (q) =>
          q
            .eq("projectId", notification.projectId)
            .eq("clerkId", notification.recipientId),
        )
        .unique();
      if (member) {
        console.warn("Member already exists");
        return false;
      }

      await ctx.db.patch(args.notificationId, {
        status: "accepted",
      });

      await ctx.db.insert("members", {
        clerkId: notification.recipientId,
        role: notification.role,
        projectId: notification.projectId,
      });

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
});

/**
 * Declines a notification for the authenticated user.
 *
 * This mutation allows a user to decline a notification they have received.
 * It checks if the notification is pending and if the user is the intended recipient.
 * If the conditions are met, the notification's status is updated to "declined".
 *
 * @param {Object} args - The arguments for the mutation.
 * @param {Id<"notifications">} args.notificationId - The ID of the notification to decline.
 *
 * @returns {Promise<boolean>} - A promise that resolves to true if the notification was successfully declined,
 * or false if the operation failed due to an error (e.g., notification not found, not pending, or not the recipient).
 *
 * @throws {Error} - Throws an error if the notification is not found,
 * if it is not in a pending state, or if the user is not the recipient of the notification.
 */
export const decline = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args): Promise<boolean> => {
    try {
      const clerkId = await getClerkId(ctx.auth);

      const notification = await ctx.db.get(args.notificationId);
      if (!notification) {
        throw new Error("Notification not found");
      }
      if (notification.status !== "pending") {
        throw new Error("Notification is not pending");
      }
      if (notification.recipientId !== clerkId) {
        throw new Error("You are not the recipient of this notification");
      }

      await ctx.db.patch(args.notificationId, {
        status: "declined",
      });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
});

/**
 * Retrieves notifications for the authenticated user along with their associated projects.
 *
 * This query fetches all notifications for the user identified by their Clerk ID,
 * and enriches each notification with the corresponding project details.
 *
 * @param {Object} ctx - The context object containing authentication and database access.
 * @returns {Promise<NotificationWithProject[] | undefined>} - A promise that resolves to an array of notifications with project details,
 * or undefined if an error occurs. The notifications returned will only include those with a status of "pending".
 *
 * @throws {Error} - Throws an error if a project associated with a notification cannot be found.
 */
export const getWithProject = query({
  handler: async (ctx): Promise<NotificationWithProject[] | undefined> => {
    try {
      const clerkId = await getClerkId(ctx.auth);

      const notifications = await ctx.db
        .query("notifications")
        .withIndex("by_recipient_id", (q) => q.eq("recipientId", clerkId))
        .collect();

      const notificationsWithProject: NotificationWithProject[] = [];
      for (const n of notifications) {
        const project = await ctx.db.get(n.projectId);
        if (n.status === "pending") {
          if (!project) {
            throw new Error("Project not found");
          }

          notificationsWithProject.push({
            ...n,
            project,
          });
        }
      }

      return notificationsWithProject.filter((n) => n.status === "pending");
    } catch (e) {
      console.error(e);
    }
  },
});
