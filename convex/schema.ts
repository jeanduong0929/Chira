import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    clerkId: v.string(),
  })
    .index("by_clerk_id", ["clerkId"])
    .searchIndex("search_users", { searchField: "email" }),
  projects: defineTable({
    name: v.string(),
    clerkId: v.string(),
  }).index("by_clerk_id", ["clerkId"]),
  members: defineTable({
    role: v.union(v.literal("admin"), v.literal("member")),
    projectId: v.id("projects"),
    clerkId: v.string(),
  })
    .index("by_project_id", ["projectId"])
    .index("by_clerk_id", ["clerkId"])
    .index("by_project_id_clerk_id", ["projectId", "clerkId"]),
  sprints: defineTable({
    name: v.string(),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    status: v.union(
      v.literal("not_started"),
      v.literal("active"),
      v.literal("completed"),
    ),
    projectId: v.id("projects"),
  })
    .index("by_project_id", ["projectId"])
    .index("by_project_id_status", ["projectId", "status"]),
  issues: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    storyPoints: v.optional(v.string()),
    issueType: v.union(v.literal("story"), v.literal("bug"), v.literal("task")),
    sequence: v.number(),
    sprintId: v.optional(v.id("sprints")),
    status: v.union(
      v.literal("not_started"),
      v.literal("in_progress"),
      v.literal("completed"),
    ),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    assigneeId: v.optional(v.string()),
    projectId: v.id("projects"),
  })
    .index("by_project_id_sequence", ["projectId", "sequence"])
    .index("by_sprint_id", ["sprintId"])
    .index("by_assignee_id", ["assigneeId"]),
  notifications: defineTable({
    type: v.literal("project_invite"),
    recipientId: v.string(),
    senderId: v.string(),
    projectId: v.id("projects"),
    role: v.union(v.literal("admin"), v.literal("member")),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("declined"),
    ),
  })
    .index("by_recipient_id", ["recipientId"])
    .index("by_sender_id", ["senderId"])
    .index("by_project_id", ["projectId"]),
});
