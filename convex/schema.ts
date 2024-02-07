import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
  maps: defineTable({
    title: v.string(),
    orgId: v.string(),
    authorId: v.string(),
    authorName: v.string(),
    imageUrl: v.string(),
  })
    .index("by_org", ["orgId"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["orgId"]
    }),
  userFavorites: defineTable({
    orgId: v.string(),
    userId: v.string(),
    mapId: v.id("maps")
  })
    .index("by_map", ["mapId"])
    .index("by_user_org", ["userId", "orgId"])
    .index("by_user_board", ["userId", "mapId"])
    .index("by_user_board_org", ["userId", "mapId", "orgId"])
});