import React, { useState } from "react";
import { BacklogDropdown } from "./backlog-dropdown";
import { SprintEditIssueDialog } from "./sprint-edit-issue-dialog";
import { MoveToDropdown } from "./move-to-dropdown";
import { Doc, Id } from "../../../../../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useDrag } from "react-dnd";

interface IssueProps extends React.HTMLAttributes<HTMLDivElement> {
  issue: Doc<"issues">;
  projectId: Id<"projects">;
  inSprint: boolean;
  sprintId: Id<"sprints"> | null;
  isOver?: boolean;
}

export const Issue = React.forwardRef<HTMLDivElement, IssueProps>(
  (
    {
      className,
      issue,
      projectId,
      inSprint,
      children,
      isOver,
      sprintId,
      ...props
    },
    ref,
  ) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [{ isDragging }, dragRef] = useDrag({
      type: "ISSUE",
      item: { issue },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    return (
      <>
        <div
          ref={(node) => {
            dragRef(node);
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          className={cn(
            "relative flex items-center justify-between border bg-white px-10 py-2",
            isDragging && "opacity-50",
            isOver && "border-blue-500",
            className,
          )}
          {...props}
        >
          <Button
            variant="ghost"
            className="p-0 text-sm font-medium hover:bg-transparent hover:text-[#0B66E4]"
            onClick={() => setIsDialogOpen(true)}
          >
            {issue.title}
          </Button>

          <div className="flex items-center gap-x-2">
            <MoveToDropdown
              sprintId={issue.sprintId as Id<"sprints">}
              projectId={projectId}
              issueId={issue._id}
              inSprint={inSprint}
            />
            <BacklogDropdown
              issueId={issue._id}
              projectId={projectId}
              inSprint={inSprint}
            />
          </div>
          {children}
        </div>

        <SprintEditIssueDialog
          open={isDialogOpen}
          setOpen={setIsDialogOpen}
          issueId={issue._id}
        />
      </>
    );
  },
);

Issue.displayName = "Issue";
