import React, { Dispatch, SetStateAction } from "react";
import { ChevronDown } from "lucide-react";
import { Column } from "./board-column";
import { IssueCard } from "./issue-card";
import { boardColumns } from "../_constants/board-columns";
import { IssueWithAssignee } from "../types/issue-with-assignee";
import { Doc } from "../../../../../../../convex/_generated/dataModel";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const AssignedIssues = ({
  members,
  issues,
  setAssignedIssues,
  setUnassignedIssues,
  open,
  setOpen,
}: {
  members: (Doc<"members"> & { user: Doc<"users"> })[];
  issues: IssueWithAssignee[];
  setAssignedIssues: Dispatch<SetStateAction<IssueWithAssignee[]>>;
  setUnassignedIssues: Dispatch<SetStateAction<IssueWithAssignee[]>>;
  open: Record<string, boolean>;
  setOpen: Dispatch<SetStateAction<Record<string, boolean>>>;
}) => {
  return members.map((member) => (
    <div key={member._id} className="flex flex-col gap-y-3">
      <div className="flex items-center gap-x-2">
        <Button
          variant="ghost"
          size="iconXs"
          onClick={() => {
            setOpen((prev) => ({
              ...prev,
              [member._id]: !prev[member._id],
            }));
          }}
        >
          <ChevronDown
            className={cn(
              "size-4 transition-transform duration-300 ease-in-out",
              open[member._id] ? "rotate-0" : "-rotate-90",
            )}
          />
        </Button>
        <h3 className="text-sm">{member.user.name}</h3>
      </div>

      {open[member._id] && (
        <div className="flex gap-x-5">
          {boardColumns.map(({ value }) => (
            <Column
              key={value}
              member={member}
              newStatus={value as "not_started" | "in_progress" | "completed"}
              setAssignedIssues={setAssignedIssues}
              setUnassignedIssues={setUnassignedIssues}
            >
              <div className="flex flex-col gap-y-1 p-2">
                {issues
                  ?.filter((i) => i.assigneeId === member.clerkId)
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
