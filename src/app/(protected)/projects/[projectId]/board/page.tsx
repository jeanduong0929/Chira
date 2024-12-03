"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { boardColumns } from "./_constants/board-columns";
import { UnassignedIssues } from "./_components/unassigned-issues";
import { IssueWithAssignee } from "./types/issue-with-assignee";
import { api } from "../../../../../../convex/_generated/api";
import { Doc, Id } from "../../../../../../convex/_generated/dataModel";

import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Column } from "./_components/board-column";
import { IssueCard } from "./_components/issue-card";

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

  useEffect(() => {
    if (issuez) {
      setUnassignedIssues(issuez.filter((i) => !i.assigneeId));
      setAssignedIssues(issuez.filter((i) => i.assigneeId));

      setShowAssignedColumns(() => {
        const obj: Record<string, boolean> = {};
        issuez.forEach((i) => {
          if (i.assigneeId) {
            obj[i.assigneeId] = true;
          }
        });
        return obj;
      });
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

      <AssignedIssues
        issues={assignedIssues}
        setIssues={setAssignedIssues}
        open={showAssignedColumns}
        setOpen={setShowAssignedColumns}
      />

      <UnassignedIssues
        sprint={sprint ?? null}
        issues={unassignedIssues}
        setIssues={setUnassignedIssues}
      />
    </div>
  );
};

const AssignedIssues = ({
  issues,
  setIssues,
  open,
  setOpen,
}: {
  issues: IssueWithAssignee[];
  setIssues: Dispatch<SetStateAction<IssueWithAssignee[]>>;
  open: Record<string, boolean>;
  setOpen: Dispatch<SetStateAction<Record<string, boolean>>>;
}) => {
  return issues.map((issue) => (
    <div key={issue._id} className="flex flex-col gap-y-3">
      <div className="flex items-center gap-x-2">
        <Button
          variant="ghost"
          size="iconXs"
          onClick={() => {
            setOpen((prev) => ({
              ...prev,
              [issue.assigneeId as string]: !prev[issue.assigneeId as string],
            }));
          }}
        >
          <ChevronDown
            className={cn(
              "size-4 transition-transform duration-300 ease-in-out",
              open[issue.assigneeId as string] ? "rotate-0" : "-rotate-90",
            )}
          />
        </Button>
        <h3 className="text-sm">{issue?.assignee?.user.name}</h3>
      </div>

      {open[issue.assigneeId as string] && (
        <div className="flex gap-x-5">
          {boardColumns.map(({ value }) => (
            <Column
              key={value}
              value={value as "not_started" | "in_progress" | "completed"}
              setIssues={setIssues}
            >
              <div className="flex flex-col gap-y-1 p-2">
                {issues
                  ?.filter((i) => i.assigneeId === issue.assigneeId)
                  .map(
                    (issue) =>
                      issue.status === value && (
                        <IssueCard key={issue._id} issue={issue} />
                      ),
                  )}
              </div>
            </Column>
          ))}
        </div>
      )}
    </div>
  ));
};

export default BoardPage;
