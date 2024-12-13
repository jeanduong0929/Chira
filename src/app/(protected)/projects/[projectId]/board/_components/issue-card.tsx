import { useState } from "react";
import { useDrag } from "react-dnd";
import { AssigneeAvatar } from "./assignee-avatar";
import { IssueType } from "./issue-type";
import { IssueCardDropdown } from "./issue-card-dropdown";
import { IssueWithAssignee } from "../types/issue-with-assignee";
import { SprintEditIssueDialog } from "../../backlog/_components/sprint-edit-issue-dialog";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IssueDetails } from "@/features/issues/components/issue-details";

export const IssueCard = ({ issue }: { issue: IssueWithAssignee }) => {
  const [open, setOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: "ISSUE",
    item: {
      issue,
      type: "ISSUE",
      sourceAssigneeId: issue.assigneeId,
      sourceStatus: issue.status,
      isUnassigned: !issue.assigneeId,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <>
      <Card
        ref={(node) => {
          drag(node);
        }}
        className={cn("cursor-pointer rounded-sm", isDragging && "opacity-50")}
        onClick={() => setSheetOpen(true)}
      >
        <CardHeader className="pt-3">
          <CardTitle className="flex items-center justify-between">
            <span
              className={cn(
                "cursor-pointer text-sm font-medium hover:text-[#0B66E4]",
                issue.status === "completed" && "line-through",
              )}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
              }}
            >
              {issue.title}
            </span>
            <IssueCardDropdown issueId={issue._id} />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between pb-4">
          <IssueType issueType={issue.issueType} />
          <div className="flex items-center gap-x-2">
            <div className="flex size-[21px] items-center justify-center rounded-full bg-[#DCE6F4] dark:bg-gray-800">
              <span className="text-xs font-medium">{issue.storyPoints}</span>
            </div>
            <AssigneeAvatar assignee={issue.assignee} />
          </div>
        </CardContent>
      </Card>

      <SprintEditIssueDialog
        issueId={issue._id}
        open={open}
        setOpen={setOpen}
      />
      <IssueDetails open={sheetOpen} setOpen={setSheetOpen} issue={issue} />
    </>
  );
};
