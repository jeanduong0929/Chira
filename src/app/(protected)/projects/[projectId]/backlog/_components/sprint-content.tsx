import React from "react";
import { Issue } from "./issue";
import { Doc } from "../../../../../../../convex/_generated/dataModel";

import { cn } from "@/lib/utils";
import { CardContent } from "@/components/ui/card";

interface SprintContentProps {
  sprint: Doc<"sprints"> & { issues: Doc<"issues">[] };
  isOver?: boolean;
}

export const SprintContent = ({ sprint, isOver }: SprintContentProps) => {
  console.log(sprint.status);

  if (sprint.status === "completed") {
    return (
      <CardContent className="mx-5 mb-5 flex h-[80px] items-center justify-center rounded-lg border-2 border-gray-200 p-0">
        <p className="text-sm font-semibold text-muted-foreground">
          Sprint completed
        </p>
      </CardContent>
    );
  }

  if (sprint.issues.length === 0) {
    return (
      <CardContent
        className={cn(
          "mx-5 mb-5 flex h-[188px] items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-0",
          isOver && "border-blue-500",
        )}
      >
        <p className="text-xs font-semibold text-muted-foreground">
          Plan your sprint
        </p>
      </CardContent>
    );
  }

  return (
    <div className="mx-2 mb-5">
      {sprint.issues.map((issue) => (
        <Issue
          key={issue._id}
          issue={issue}
          projectId={issue.projectId}
          inSprint={true}
          sprintId={sprint._id}
          isOver={isOver}
        />
      ))}
    </div>
  );
};
