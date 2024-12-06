"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { SprintsList } from "./_components/sprints-list";
import { BacklogHeader } from "./_components/backlog-header";
import { BacklogCard } from "./_components/backlog-card";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { api } from "../../../../../../convex/_generated/api";

import { convexQuery } from "@convex-dev/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation } from "@tanstack/react-query";

const BacklogPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openSprints, setOpenSprints] = useState<
    Record<Id<"sprints">, boolean>
  >({});
  const { projectId } = useParams();

  const { data: sprints, isLoading } = useQuery(
    convexQuery(api.sprints.getAll, {
      projectId: projectId as Id<"projects">,
    }),
  );

  useEffect(() => {
    if (sprints?.length) {
      setOpenSprints(
        sprints.reduce(
          (acc, sprint) => ({
            ...acc,
            [sprint._id]: true,
          }),
          {},
        ),
      );
    }
  }, [sprints]);

  const toggleSprint = (sprintId: Id<"sprints">) => {
    setOpenSprints((prev) => ({
      ...prev,
      [sprintId]: !prev[sprintId],
    }));
  };

  return (
    <div className="flex flex-col gap-y-10">
      <BacklogHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="flex flex-col gap-y-5">
        {isLoading ? (
          <Skeleton className="h-[252px] w-full rounded-xl" />
        ) : (
          <>
            <SprintsList
              sprints={sprints ?? []}
              openSprints={openSprints}
              onToggleSprint={toggleSprint}
            />
            <BacklogCard
              searchQuery={searchQuery}
              projectId={projectId as Id<"projects">}
              sprints={sprints ?? []}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default BacklogPage;
