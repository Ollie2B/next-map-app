"use client";

import { useOrganization } from "@clerk/nextjs";

import { EmptyCampaign } from "./_components/empty-campaign";
import { MapList } from "./_components/map-list";

interface DashboardPageProps {
  searchParams: {
    search?: string;
    favorites?: string;
  };
};

const DashboardPage = ({
  searchParams,
}: DashboardPageProps) => {
  const { organization } = useOrganization();

  return ( 
    <div className="flex-1 h-[calc(100%-80px)] p-6">
      {!organization ? (
        <EmptyCampaign />
      ) : (
        <MapList
          orgId={organization.id}
          query={searchParams}
         />
       )}
    </div>
   );
};
 
export default DashboardPage;
