import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    imageUrl: v.optional(v.string()),
    clerkId: v.string(),
  }).index("by_clerk_id", ["clerkId"]),
  projects: defineTable({
    name: v.string(),
    clerkId: v.string(),
  }).index("by_clerk_id", ["clerkId"]),
  members: defineTable({
    projectId: v.id("projects"),
    clerkId: v.string(),
  })
    .index("by_project_id", ["projectId"])
    .index("by_clerk_id", ["clerkId"]),
  boards: defineTable({
    name: v.string(),
    projectId: v.id("projects"),
  }).index("by_project_id", ["projectId"]),
  sprints: defineTable({
    name: v.string(),
    projectId: v.id("projects"),
  }).index("by_project_id", ["projectId"]),
  issues: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    storyPoints: v.optional(v.number()),
    sprintId: v.optional(v.id("sprints")),
    projectId: v.id("projects"),
  }).index("by_project_id", ["projectId"]),
});
