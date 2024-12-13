import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { getClerkId } from "./users";

import OpenAI from "openai";

const openai = new OpenAI();

/**
 * Creates a new issue in the database.
 *
 * @param {Object} args - The arguments for creating an issue.
 * @param {string} args.title - The title of the issue.
 * @param {string} [args.description] - An optional description of the issue.
 * @param {string} [args.storyPoints] - An optional string representing story points.
 * @param {string} [args.sprintId] - An optional ID of the sprint associated with the issue.
 * @param {string} [args.assigneeId] - An optional ID of the user assigned to the issue.
 * @param {"story" | "bug" | "task"} args.issueType - The type of the issue (story, bug, or task).
 * @param {string} args.projectId - The ID of the project to which the issue belongs.
 * @param {"low" | "medium" | "high"} args.priority - The priority of the issue (low, medium, or high).
 *
 * @returns {Promise<Object>} The created issue object.
 *
 * @throws {Error} Throws an error if the issue creation fails.
 */
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    storyPoints: v.optional(v.string()),
    sprintId: v.optional(v.id("sprints")),
    assigneeId: v.optional(v.string()),
    issueType: v.union(v.literal("story"), v.literal("bug"), v.literal("task")),
    projectId: v.id("projects"),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
  },
  handler: async (ctx, args) => {
    try {
      const clerkId = await getClerkId(ctx.auth);

      const issues = await ctx.db
        .query("issues")
        .withIndex("by_project_id_sequence", (q) =>
          q.eq("projectId", args.projectId),
        )
        .collect();

      return await ctx.db.insert("issues", {
        title: args.title,
        description: args.description,
        storyPoints: args.storyPoints,
        sprintId: args.sprintId,
        assigneeId: args.assigneeId,
        projectId: args.projectId,
        issueType: args.issueType,
        sequence: issues.length,
        status: "not_started",
        priority: args.priority,
        reporterId: clerkId,
      });
    } catch (error) {
      console.error(error);
    }
  },
});

/**
 * Retrieves all issues associated with a specific project.
 *
 * @param {Object} args - The arguments for the query.
 * @param {string} args.projectId - The ID of the project for which to retrieve issues.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of issue objects.
 *
 * @throws {Error} Throws an error if the retrieval fails.
 */
export const getAll = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    try {
      return await ctx.db
        .query("issues")
        .withIndex("by_project_id_sequence", (q) =>
          q.eq("projectId", args.projectId).gte("sequence", 0),
        )
        .order("asc")
        .collect();
    } catch (error) {
      console.error(error);
    }
  },
});

/**
 * Retrieves an issue by its ID.
 *
 * @param {Object} args - The arguments for the query.
 * @param {string} args.issueId - The ID of the issue to retrieve.
 *
 * @returns {Promise<Object>} A promise that resolves to the issue object, including the assignee information.
 *
 * @throws {Error} Throws an error if the issue is not found or if the retrieval fails.
 */
export const getById = query({
  args: {
    issueId: v.id("issues"),
  },
  handler: async (ctx, args) => {
    try {
      const issue = await ctx.db.get(args.issueId);
      if (!issue) {
        throw new Error("Issue not found");
      }

      const assignee = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) =>
          q.eq("clerkId", issue.assigneeId as string),
        )
        .unique();

      return { ...issue, assignee };
    } catch (error) {
      console.error(error);
    }
  },
});

/**
 * Retrieves issues associated with a specific sprint by its ID.
 *
 * @param {Object} args - The arguments for the query.
 * @param {string} args.sprintId - The ID of the sprint for which to retrieve issues.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of issue objects, each including the assignee and reporter information.
 *
 * Each issue object contains:
 * - assignee: An object representing the member assigned to the issue, or null if unassigned. The assignee object includes:
 *   - user: An object containing the name and image URL of the assignee.
 * - reporter: An object representing the reporter of the issue, including:
 *   - name: The name of the reporter.
 *   - imageUrl: The image URL of the reporter.
 *
 * @throws {Error} Throws an error if the user is not authenticated or if there is an issue retrieving the data.
 */
export const getBySprintId = query({
  args: {
    sprintId: v.id("sprints"),
  },
  handler: async (
    ctx,
    args,
  ): Promise<
    (Doc<"issues"> & {
      assignee:
        | (Doc<"members"> & {
            user: {
              name: string;
              imageUrl: string;
            };
          })
        | null;
      reporter: {
        name: string;
        imageUrl: string;
      };
    })[]
  > => {
    try {
      await getClerkId(ctx.auth);

      const issues = await ctx.db
        .query("issues")
        .withIndex("by_sprint_id", (q) => q.eq("sprintId", args.sprintId))
        .collect();

      const issuesWithAssignee: (Doc<"issues"> & {
        assignee:
          | (Doc<"members"> & {
              user: {
                name: string;
                imageUrl: string;
              };
            })
          | null;
        reporter: {
          name: string;
          imageUrl: string;
        };
      })[] = [];

      for (const issue of issues) {
        // find the reporter of the issue
        const reporter = await ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", issue.reporterId))
          .unique();

        // if issue is not assigned, push it to the list
        if (!issue.assigneeId) {
          issuesWithAssignee.push({
            ...issue,
            assignee: null,
            reporter: {
              name: reporter?.name || "",
              imageUrl: reporter?.imageUrl || "",
            },
          });
          continue;
        }

        // get assignee
        const assignee = await ctx.db
          .query("members")
          .withIndex("by_project_id_clerk_id", (q) =>
            q
              .eq("projectId", issue.projectId)
              .eq("clerkId", issue.assigneeId as string),
          )
          .unique();

        // if assignee is not found, push it to the list
        if (!assignee) {
          issuesWithAssignee.push({
            ...issue,
            assignee: null,
            reporter: {
              name: reporter?.name || "",
              imageUrl: reporter?.imageUrl || "",
            },
          });
          continue;
        }

        // Get assignee user
        const assigneeUser = await ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", assignee.clerkId))
          .unique();

        // if assignee user is not found, push it to the list
        if (!assigneeUser) {
          issuesWithAssignee.push({
            ...issue,
            assignee: null,
            reporter: {
              name: reporter?.name || "",
              imageUrl: reporter?.imageUrl || "",
            },
          });
          continue;
        }

        // push issue with assignee to the list
        issuesWithAssignee.push({
          ...issue,
          assignee: {
            ...assignee,
            user: {
              name: assigneeUser.name,
              imageUrl: assigneeUser.imageUrl || "",
            },
          },
          reporter: {
            name: reporter?.name || "",
            imageUrl: reporter?.imageUrl || "",
          },
        });
      }

      return issuesWithAssignee;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
});

/**
 * Updates an existing issue in the database.
 *
 * @param {Object} args - The arguments for the mutation.
 * @param {string} args.issueId - The ID of the issue to update.
 * @param {string} args.title - The new title of the issue.
 * @param {string} [args.description] - The new description of the issue (optional).
 * @param {string} [args.storyPoints] - The new story points for the issue (optional).
 * @param {string} [args.sprintId] - The ID of the sprint to associate with the issue (optional).
 * @param {string} [args.assigneeId] - The ID of the user assigned to the issue (optional).
 * @param {"story" | "bug" | "task"} args.issueType - The type of the issue.
 * @param {"low" | "medium" | "high"} args.priority - The priority of the issue.
 * @param {string} args.projectId - The ID of the project the issue belongs to.
 *
 * @returns {Promise<boolean>} - Returns true if the update was successful, otherwise false.
 *
 * @throws {Error} - Throws an error if the issue is not found or if there is an issue with the database operation.
 */
export const update = mutation({
  args: {
    issueId: v.id("issues"),
    title: v.string(),
    description: v.optional(v.string()),
    storyPoints: v.optional(v.string()),
    sprintId: v.optional(v.id("sprints")),
    assigneeId: v.optional(v.string()),
    issueType: v.union(v.literal("story"), v.literal("bug"), v.literal("task")),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    projectId: v.id("projects"),
    status: v.union(
      v.literal("not_started"),
      v.literal("in_progress"),
      v.literal("completed"),
    ),
  },
  handler: async (ctx, args) => {
    try {
      await getClerkId(ctx.auth);

      const issue = await ctx.db.get(args.issueId);
      if (!issue) {
        throw new Error("Issue not found");
      }

      await ctx.db.patch(args.issueId, {
        title: args.title,
        description: args.description,
        storyPoints: args.storyPoints,
        sprintId: args.sprintId,
        assigneeId: args.assigneeId,
        projectId: args.projectId,
        issueType: args.issueType,
        priority: args.priority,
        status: args.status,
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
});

/**
 * Moves an issue to the top of the list for a specific project.
 *
 * @param {Object} args - The arguments for moving the issue.
 * @param {string} args.issueId - The ID of the issue to move.
 * @param {string} args.projectId - The ID of the project associated with the issue.
 *
 * @returns {Promise<boolean>} - Returns true if the move was successful, otherwise false.
 *
 * @throws {Error} - Throws an error if the authentication fails or if there is an issue with the database operation.
 */
export const moveToTop = mutation({
  args: {
    issueId: v.id("issues"),
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    try {
      await getClerkId(ctx.auth);

      const issues = await ctx.db
        .query("issues")
        .withIndex("by_project_id_sequence", (q) =>
          q.eq("projectId", args.projectId).gte("sequence", 0),
        )
        .collect();

      // If issue is already at top, do nothing
      if (issues[0]._id === args.issueId) {
        return true;
      }

      // Shift all issues down
      for (let i = 0; i < issues.length; i++) {
        await ctx.db.patch(issues[i]._id, {
          sequence: i + 1,
        });
      }

      // Move issue to top
      await ctx.db.patch(args.issueId, {
        sequence: 0,
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
});

/**
 * Moves an issue to a specified sprint.
 *
 * @param {Object} args - The arguments for moving the issue.
 * @param {string} args.issueId - The ID of the issue to move.
 * @param {string} args.sprintId - The ID of the sprint to which the issue will be moved.
 *
 * @returns {Promise<boolean>} - Returns true if the move was successful, otherwise false.
 *
 * @throws {Error} - Throws an error if the authentication fails or if the issue is not found.
 */
export const moveToSprint = mutation({
  args: {
    issueId: v.id("issues"),
    sprintId: v.id("sprints"),
  },
  handler: async (ctx, args) => {
    try {
      await getClerkId(ctx.auth);

      const issue = await ctx.db.get(args.issueId);
      if (!issue) {
        throw new Error("Issue not found");
      }

      await ctx.db.patch(args.issueId, {
        sprintId: args.sprintId,
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
});

/**
 * Moves an issue back to the backlog by removing its associated sprint ID.
 *
 * @param {Object} args - The arguments for moving the issue to the backlog.
 * @param {string} args.issueId - The ID of the issue to move back to the backlog.
 *
 * @returns {Promise<boolean>} Returns true if the move was successful, otherwise false.
 *
 * @throws {Error} Throws an error if the authentication fails or if the issue is not found.
 */
export const moveToBacklog = mutation({
  args: {
    issueId: v.id("issues"),
  },
  handler: async (ctx, args) => {
    try {
      await getClerkId(ctx.auth);

      const issue = await ctx.db.get(args.issueId);
      if (!issue) {
        throw new Error("Issue not found");
      }

      await ctx.db.patch(args.issueId, {
        sprintId: undefined,
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
});

/**
 * Updates the sequence of multiple issues in the database.
 *
 * @param {Object} args - The arguments for updating the sequence.
 * @param {Array<Object>} args.issues - An array of objects representing the issues to update.
 * @param {string} args.issues[].issueId - The ID of the issue to update.
 * @param {number} args.issues[].sequence - The new sequence number for the issue.
 *
 * @returns {Promise<boolean>} Returns true if all issues were updated successfully, otherwise false.
 *
 * @throws {Error} Throws an error if the authentication fails or if any issue is not found.
 */
export const updateSequence = mutation({
  args: {
    issues: v.array(
      v.object({
        issueId: v.id("issues"),
        sequence: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    try {
      await getClerkId(ctx.auth);

      for (const i of args.issues) {
        const issue = await ctx.db.get(i.issueId);
        if (!issue) {
          throw new Error("Issue not found");
        }
        await ctx.db.patch(issue._id, {
          sequence: i.sequence,
        });
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
});

/**
 * Updates the status of a specific issue in the database.
 *
 * @param {Object} args - The arguments for updating the issue status.
 * @param {Object} args.issue - The issue object containing the ID and new status.
 * @param {string} args.issue.id - The ID of the issue to update.
 * @param {"not_started" | "in_progress" | "completed"} args.issue.status - The new status of the issue.
 *
 * @returns {Promise<boolean>} Returns true if the status was updated successfully, otherwise false.
 *
 * @throws {Error} Throws an error if the authentication fails or if the issue is not found.
 */
export const updateStatus = mutation({
  args: {
    issue: v.object({
      id: v.id("issues"),
      status: v.union(
        v.literal("not_started"),
        v.literal("in_progress"),
        v.literal("completed"),
      ),
    }),
  },
  handler: async (ctx, args) => {
    try {
      await getClerkId(ctx.auth);

      const issue = await ctx.db.get(args.issue.id);
      if (!issue) {
        throw new Error("Issue not found");
      }
      await ctx.db.patch(issue._id, {
        status: args.issue.status,
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
});

/**
 * Updates the assignee of a specific issue in the database.
 *
 * @param {Object} args - The arguments for updating the issue assignee.
 * @param {Object} args.issue - The issue object containing the ID and new assignee ID.
 * @param {string} args.issue.id - The ID of the issue to update.
 * @param {string} args.issue.assigneeId - The ID of the user to assign to the issue.
 *
 * @returns {Promise<boolean>} Returns true if the assignee was updated successfully, otherwise false.
 *
 * @throws {Error} Throws an error if the authentication fails or if the issue is not found.
 */
export const updateAssignee = mutation({
  args: {
    issue: v.object({
      id: v.id("issues"),
      assigneeId: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    try {
      await getClerkId(ctx.auth);

      const issue = await ctx.db.get(args.issue.id);
      if (!issue) {
        throw new Error("Issue not found");
      }

      const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.issue.assigneeId))
        .unique();

      await ctx.db.patch(issue._id, {
        assigneeId: args.issue.assigneeId,
        status: "not_started",
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
});

/**
 * Clones an existing issue in the database.
 *
 * This mutation creates a new issue based on the provided issue ID.
 * The new issue will have the same properties as the original issue,
 * except for the assignee ID, which will be set to undefined.
 *
 * @param {Object} args - The arguments for cloning the issue.
 * @param {string} args.issueId - The ID of the issue to clone.
 *
 * @returns {Promise<boolean>} Returns true if the issue was cloned successfully, otherwise false.
 *
 * @throws {Error} Throws an error if the authentication fails or if the issue is not found.
 */
export const clone = mutation({
  args: {
    issueId: v.id("issues"),
  },
  handler: async (ctx, args): Promise<boolean> => {
    try {
      await getClerkId(ctx.auth);

      const issue = await ctx.db.get(args.issueId);
      if (!issue) {
        throw new Error("Issue not found");
      }

      await ctx.db.insert("issues", {
        title: issue.title,
        description: issue.description,
        storyPoints: issue.storyPoints,
        issueType: issue.issueType,
        sequence: issue.sequence,
        priority: issue.priority,
        status: "not_started",
        assigneeId: undefined,
        projectId: issue.projectId,
        reporterId: issue.reporterId,
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
});

/**
 * Removes a specific issue from the database.
 *
 * @param {Object} args - The arguments for removing the issue.
 * @param {string} args.issueId - The ID of the issue to remove.
 *
 * @returns {Promise<boolean>} Returns true if the issue was removed successfully, otherwise false.
 *
 * @throws {Error} Throws an error if the authentication fails or if the issue is not found.
 */
export const remove = mutation({
  args: {
    issueId: v.id("issues"),
  },
  handler: async (ctx, args) => {
    try {
      await getClerkId(ctx.auth);
      const issue = await ctx.db.get(args.issueId);
      if (!issue) {
        throw new Error("Issue not found");
      }
      await ctx.db.delete(args.issueId);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
});

/**
 * Generates a task description using OpenAI's chat completion model.
 *
 * @param {Object} args - The arguments for generating the description.
 * @param {string} args.content - The content for which to generate a task description.
 *
 * @returns {Promise<string | null | undefined>} A promise that resolves to the generated task description,
 * or undefined if an error occurs.
 *
 * @throws {Error} Throws an error if the authentication fails or if the OpenAI API call fails.
 */
export const generateDescription = action({
  args: {
    content: v.string(),
  },
  handler: async (ctx, args): Promise<string | null | undefined> => {
    try {
      await getClerkId(ctx.auth);
      return await openAIGenerateDescription(args.content);
    } catch (e) {
      console.error(e);
      return undefined;
    }
  },
});

/**
 * Generates a task description using OpenAI's chat completion model.
 *
 * @param {string} content - The content for which to generate a task description.
 * @returns {Promise<string | undefined>} A promise that resolves to the generated task description or undefined if an error occurs.
 *
 * @throws {Error} Throws an error if the OpenAI API call fails.
 */
const openAIGenerateDescription = async (
  content: string,
): Promise<string | undefined> => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that generates task descriptions for a project management tool.",
      },
      {
        role: "user",
        content: `Generate a task description for the following content with only description and acceptance criteria.
        
        Content: ${content}

        Example input:
        <p>Integrate OpenAI to TipTap editor</p><p></p><p><strong>Acceptance Criteria:</strong></p><p>OpenAI correctly optimize description.</p>

        Example output:
        <p>Add OpenAI text optimization capabilities to TipTap editor.</p>
        <p><strong>Acceptance Criteria:</strong></p>
        <ul>
        <li>Connect OpenAI API to TipTap</li>
        <li>Add UI control for text optimization</li>
        <li>Handle API responses and errors</li>
        <li>Preserve text formatting</li>
        <li>Show loading states</li>
        <li>Allow undo/redo of AI changes</li>
        </ul>
        <p><strong>Technical Notes:</strong></p>
        <ul>
        <li>API auth handling</li>
        <li>Error handling</li>
        <li>Character limits</li>
        </ul>
        `,
      },
    ],
  });

  return completion.choices[0].message.content ?? undefined;
};
