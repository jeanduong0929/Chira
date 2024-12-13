import React from "react";
import { Issue } from "./issue";
import { Doc } from "../../../../../../../convex/_generated/dataModel";

import { cn } from "@/lib/utils";
import { CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SprintContentProps {
  sprint: Doc<"sprints"> & { issues: Doc<"issues">[] };
  isOver?: boolean;
}

export const SprintContent = ({ sprint, isOver }: SprintContentProps) => {
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
    <ScrollArea className="mx-2 mb-5 h-[540px]">
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
    </ScrollArea>
  );
};
