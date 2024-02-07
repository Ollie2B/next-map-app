"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import { MapCard } from "./map-card";
import { EmptySearch } from "./empty-search";
import { EmptyMaps } from "./empty-maps";
import { EmptyFavorites } from "./empty-favorites";
import { NewMapButton } from "./new-map-button";

interface MapListProps {
  orgId: string;
  query: {
    search?: string;
    favorites?: string;
  };
};

export const MapList = ({
  orgId,
  query,
}: MapListProps) => {
  const data = useQuery(api.maps.get, { 
    orgId,
    ...query,
  });

  if (data === undefined) {
    return (
      <div>
        <h2 className="text-3xl">
          {query.favorites ? "Favorite maps" : "Team maps"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
          <NewMapButton orgId={orgId} disabled />
          <MapCard.Skeleton />
          <MapCard.Skeleton />
          <MapCard.Skeleton />
          <MapCard.Skeleton />
        </div>
      </div>
    )
  }

  if (!data?.length && query.search) {
    return <EmptySearch />;
  }

  if (!data?.length && query.favorites) {
    return <EmptyFavorites />
  }

  if (!data?.length) {
    return <EmptyMaps />
  }

  return (
    <div>
      <h2 className="text-3xl">
        {query.favorites ? "Favorite maps" : "Team maps"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
        <NewMapButton orgId={orgId} />
        {data?.map((map) => (
          <MapCard
            key={map._id}
            id={map._id}
            title={map.title}
            imageUrl={map.imageUrl}
            authorId={map.authorId}
            authorName={map.authorName}
            createdAt={map._creationTime}
            orgId={map.orgId}
            isFavorite={map.isFavorite}
          />
        ))}
      </div>
    </div>
  );
};
