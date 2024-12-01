import React, { useState } from "react";
import { BacklogDropdown } from "./backlog-dropdown";
import { SprintEditIssueDialog } from "./sprint-edit-issue-dialog";
import { MoveToDropdown } from "./move-to-dropdown";
import { Doc } from "../../../../../../../convex/_generated/dataModel";
import { Id } from "../../../../../../../convex/_generated/dataModel";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Issue = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    issue: Doc<"issues">;
    projectId: Id<"projects">;
    inSprint: boolean;
  }
>(({ className, issue, projectId, inSprint, children, ...props }, ref) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        ref={ref}
        className={cn(
          "relative flex items-center justify-between border bg-white px-10 py-2",
          className,
        )}
        {...props}
      >
        <div className="flex items-center gap-x-2">
          <Button
            variant={"ghost"}
            className="p-0 text-sm font-medium hover:bg-transparent hover:text-[#0B66E4]"
            onClick={() => setOpen(true)}
          >
            {issue.title}
          </Button>
        </div>
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
        open={open}
        setOpen={setOpen}
        issueId={issue._id}
      />
    </>
  );
});

Issue.displayName = "Issue";
