"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useApiMutation } from "@/hooks/use-api-mutation";

export const EmptyMaps = () => {
  const router = useRouter();
  const { organization } = useOrganization();
  const { mutate, pending } = useApiMutation(api.map.create);

  const onClick = () => {
    if (!organization) return;

    mutate({
      orgId: organization.id,
      title: "Untitled"
    })
      .then((id) => {
        toast.success("Map created");
        router.push(`/map/${id}`);
      })
      .catch(() => toast.error("Failed to create map"));
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      {/* <Image
        src="/note.svg"
        height={110}
        width={110}
        alt="Empty"
      /> */}
      <h2 className="text-2xl font-semibold mt-6">
        Create your first map
      </h2>
      <p className="text-muted-foreground textg-sm mt-2">
        Start by creating a map for your campaign
      </p>
      <div className="mt-6">
        <Button disabled={pending} onClick={onClick} size="lg">
          Create map
        </Button>
      </div>
    </div>
  );
};
