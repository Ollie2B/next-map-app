import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

const images = [
  "/placeholders/1.svg",
];

export const create = mutation({
  args: {
    orgId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const randomImage = images[Math.floor(Math.random() * images.length)];

    console.log(randomImage, "TEST")

    const map = await ctx.db.insert("maps", {
      title: args.title,
      orgId: args.orgId,
      authorId: identity.subject,
      authorName: identity.name!,
      imageUrl: randomImage,
    });

    return map;
  },
});

export const remove = mutation({
  args: { id: v.id("maps") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = identity.subject;

    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_map", (q) => 
        q
          .eq("userId", userId)
          .eq("mapId", args.id)
      )
      .unique();

    if (existingFavorite) {
      await ctx.db.delete(existingFavorite._id);
    }

    await ctx.db.delete(args.id);
  },
});

export const update = mutation({
  args: { id: v.id("maps"), title: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const title = args.title.trim();

    if (!title) {
      throw new Error("Title is required");
    }

    if (title.length > 60) {
      throw new Error("Title cannot be longer than 60 characters")
    }

    const map = await ctx.db.patch(args.id, {
      title: args.title,
    });

    return map;
  },
});

export const favorite = mutation({
  args: { id: v.id("maps"), orgId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const map = await ctx.db.get(args.id);

    if (!map) {
      throw new Error("Map not found");
    }

    const userId = identity.subject;

    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_map", (q) => 
        q
          .eq("userId", userId)
          .eq("mapId", map._id)
      )
      .unique();

    if (existingFavorite) {
      throw new Error("Map already favorited");
    }

    await ctx.db.insert("userFavorites", {
      userId,
      mapId: map._id,
      orgId: args.orgId,
    });

    return map;
  },
});


export const unfavorite = mutation({
  args: { id: v.id("maps") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const map = await ctx.db.get(args.id);

    if (!map) {
      throw new Error("Map not found");
    }

    const userId = identity.subject;

    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_map", (q) => 
        q
          .eq("userId", userId)
          .eq("mapId", map._id)
      )
      .unique();

    if (!existingFavorite) {
      throw new Error("Favorited map not found");
    }

    await ctx.db.delete(existingFavorite._id);

    return map;
  },
});

export const get = query({
  args: { id: v.id("maps") },
  handler: async (ctx, args) => {
    const map = ctx.db.get(args.id);

    return map;
  },
});