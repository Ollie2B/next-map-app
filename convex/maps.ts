import { v } from "convex/values";
import { getAllOrThrow } from "convex-helpers/server/relationships";

import { query } from "./_generated/server";

export const get = query({
  args: {
    orgId: v.string(),
    search: v.optional(v.string()),
    favorites: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    if (args.favorites) {
      const favoritedMaps = await ctx.db
        .query("userFavorites")
        .withIndex("by_user_org", (q) => 
          q
            .eq("userId", identity.subject)
            .eq("orgId", args.orgId)
        )
        .order("desc")
        .collect();

      const ids = favoritedMaps.map((b) => b.mapId);

      const maps = await getAllOrThrow(ctx.db, ids);

      return maps.map((map: any) => ({
        ...map,
        isFavorite: true,
      }));
    }

    const title = args.search as string;
    let maps = [];

    if (title) {
      maps = await ctx.db
        .query("maps")
        .withSearchIndex("search_title", (q) => 
          q
            .search("title", title)
            .eq("orgId", args.orgId)
        )
        .collect();
    } else {
      maps = await ctx.db
        .query("maps")
        .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
        .order("desc")
        .collect();
    }

    const mapsWithFavoriteRelation = maps.map((map) => {
      return ctx.db
        .query("userFavorites")
        .withIndex("by_user_map", (q) => 
          q
            .eq("userId", identity.subject)
            .eq("mapId", map._id)
        )
        .unique()
        .then((favorite) => {
          return {
            ...map,
            isFavorite: !!favorite,
          };
        });
    });

    const mapsWithFavoriteBoolean = Promise.all(mapsWithFavoriteRelation);

    return mapsWithFavoriteBoolean;
  },
});