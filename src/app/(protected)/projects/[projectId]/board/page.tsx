"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { boardColumns } from "./_constants/board-columns";
import { UnassignedIssues } from "./_components/unassigned-issues";
import { AssignedIssues } from "./_components/assigned-issues";
import { IssueWithAssignee } from "./types/issue-with-assignee";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";

import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const BoardPage = () => {
  const [assignedIssues, setAssignedIssues] = useState<IssueWithAssignee[]>([]);
  const [unassignedIssues, setUnassignedIssues] = useState<IssueWithAssignee[]>(
    [],
  );
  const [showAssignedColumns, setShowAssignedColumns] = useState<
    Record<string, boolean>
  >({});

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
  const { data: members } = useQuery(
    convexQuery(api.members.getMembers, {
      projectId: projectId as Id<"projects">,
    }),
  );

  useEffect(() => {
    if (issuez) {
      setUnassignedIssues(issuez.filter((i) => !i.assigneeId));
      setAssignedIssues(issuez.filter((i) => i.assigneeId));
    }
  }, [issuez]);

  useEffect(() => {
    if (members) {
      setShowAssignedColumns((prev) => {
        const obj: Record<string, boolean> = { ...prev };
        members.forEach((member) => {
          if (!(member._id in obj)) {
            obj[member._id] = true;
          }
        });
        return obj;
      });
    }
  }, [members]);

  useEffect(() => {}, [unassignedIssues, assignedIssues]);

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
    <div className="flex flex-col gap-y-5 pb-10">
      <div className="flex gap-x-5">
        {boardColumns.map(({ label, value }) => (
          <div key={value} className="w-[270px]">
            <h3 className="rounded-md bg-[#F7F8F9] p-4 text-muted-foreground dark:bg-[#202024]">
              {label}
            </h3>
          </div>
        ))}
      </div>

      <AssignedIssues
        members={members ?? []}
        issues={assignedIssues}
        setAssignedIssues={setAssignedIssues}
        setUnassignedIssues={setUnassignedIssues}
        open={showAssignedColumns}
        setOpen={setShowAssignedColumns}
      />

      <UnassignedIssues
        sprint={sprint ?? null}
        issues={unassignedIssues}
        setUnassignedIssues={setUnassignedIssues}
        setAssignedIssues={setAssignedIssues}
      />
    </div>
  );
};

export default BoardPage;
