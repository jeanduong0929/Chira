"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { SprintsList } from "./_components/sprints-list";
import { BacklogHeader } from "./_components/backlog-header";
import { BacklogCard } from "./_components/backlog-card";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { api } from "../../../../../../convex/_generated/api";

import { convexQuery } from "@convex-dev/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

const BacklogPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openSprints, setOpenSprints] = useState<
    Record<Id<"sprints">, boolean>
  >({});
  const { projectId } = useParams();

  const initialized = useRef(false);

  const { data: sprints, isLoading } = useQuery(
    convexQuery(api.sprints.getAll, {
      projectId: projectId as Id<"projects">,
    }),
  );

  useEffect(() => {
    if (sprints?.length && !initialized.current) {
      initialized.current = true;
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

  // Also add a log in your toggle function
  const toggleSprint = (sprintId: Id<"sprints">) => {
    console.log("Toggling sprint:", sprintId);
    setOpenSprints((prev) => {
      const newState = {
        ...prev,
        [sprintId]: !prev[sprintId],
      };
      console.log("New toggle state:", newState);
      return newState;
    });
  };

  return (
    <div className="flex flex-col gap-y-10 pb-10">
      <BacklogHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="flex flex-col gap-y-20">
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
