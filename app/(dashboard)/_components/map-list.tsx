"use client";

import { EmptyFavorites } from "./empty-favorites";
import { EmptySearch } from "./empty-search";

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
  const data = [];
  

  if(!data?.length && query.search) {
    return <EmptySearch />;
  }

  if (!data?.length && query.favorites) {
    return <EmptyFavorites />;
  }

  if (!data?.length) {
    return (
      <div>
        No boards
      </div>
    );
  }

  return (
    <p>
      List
    </p>
  );
};
