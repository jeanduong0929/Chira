"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { boardColumns } from "./_constants/board-columns";
import { UnassignedIssues } from "./_components/unassigned-issues";
import { IssueWithAssignee } from "./types/issue-with-assignee";
import { api } from "../../../../../../convex/_generated/api";
import { Doc, Id } from "../../../../../../convex/_generated/dataModel";

import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const BoardPage = () => {
  const [unassignedIssues, setUnassignedIssues] = useState<IssueWithAssignee[]>(
    [],
  );

  const { projectId } = useParams();
  const { data: sprint, isLoading: isLoadingSprint } = useQuery(
    convexQuery(api.sprints.getActiveSprintByProjectId, {
      projectId: projectId as Id<"projects">,
    }),
  );
  const { data: issuez } = useQuery(
    convexQuery(api.issues.getBySprintId, {
      sprintId: sprint?._id as Id<"sprints">,
    }),
  );

  useEffect(() => {
    if (issuez) {
      setUnassignedIssues(issuez.filter((i) => !i.assigneeId));
    }
  }, [issuez]);

  if (isLoadingSprint)
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
    <div className="flex flex-col gap-y-5">
      <div className="flex gap-x-5">
        {boardColumns.map(({ label, value }, index) => (
          <div key={value} className="w-[270px]">
            <h3 className="rounded-md bg-[#F7F8F9] p-4 text-muted-foreground">
              {label}
            </h3>
          </div>
        ))}
      </div>

      <UnassignedIssues
        sprint={sprint ?? null}
        issues={unassignedIssues}
        setIssues={setUnassignedIssues}
      />
    </div>
  );
};

export default BoardPage;
