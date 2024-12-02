"use client";

import React from "react";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";

import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { boardColumns } from "./_constants/board-columns";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";

const BoardPage = () => {
  const { projectId } = useParams();

  const { data: sprint, isLoading: isLoadingSprint } = useQuery(
    convexQuery(api.sprints.getActiveSprintByProjectId, {
      projectId: projectId as Id<"projects">,
    }),
  );

  const { data: issues, isLoading: isLoadingIssues } = useQuery(
    convexQuery(api.issues.getBySprintId, {
      sprintId: sprint?._id as Id<"sprints">,
    }),
  );

  if (isLoadingSprint || isLoadingIssues)
    return (
      <div className="flex gap-x-5">
        {Object.entries(boardColumns).map(([key, _value]) => (
          <div key={key} className="w-[270px]">
            <Skeleton className="h-[56px] rounded-md bg-[#F7F8F9] p-4 text-muted-foreground" />
          </div>
        ))}
      </div>
    );

  return (
    <div className="flex gap-x-5">
      {Object.entries(boardColumns).map(([key, value]) => (
        <div key={key} className="w-[270px]">
          <h3 className="rounded-md bg-[#F7F8F9] p-4 text-muted-foreground">
            {value}
          </h3>
        </div>
      ))}
    </div>
  );
};

export default BoardPage;
