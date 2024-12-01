import React from "react";
import { SpringDropdown } from "./sprint-dropdown";
import { Doc } from "../../../../../../../convex/_generated/dataModel";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SprintCardProps {
  index: number;
  sprint: Doc<"sprints"> & {
    issues: Doc<"issues">[];
  };
}

export const SprintCard = ({ index, sprint }: SprintCardProps) => {
  return (
    <Card className="border-none bg-[#F7F8F9]">
      <CardHeader className="py-1">
        <CardTitle className="text-md flex items-center justify-between">
          <div className="flex items-center gap-x-3">
            <span>{sprint.name}</span>
            <p className="text-xs font-normal text-muted-foreground">
              ({sprint.issues.length} issues)
            </p>
          </div>
          <SpringDropdown sprintId={sprint._id} />
        </CardTitle>
        <CardDescription className="hidden" />
      </CardHeader>

      <EmptySprintCardContent issues={sprint.issues} />
    </Card>
  );
};

const EmptySprintCardContent = ({ issues }: { issues: Doc<"issues">[] }) => {
  if (issues.length === 0)
    return (
      <CardContent
        className={cn(
          issues.length === 0 &&
            "mx-5 mb-5 h-[188px] rounded-lg border-2 border-dashed border-gray-200",
        )}
      >
        {issues.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center">
            <p className="text-xs font-semibold text-muted-foreground">
              Plan your sprint
            </p>
          </div>
        ) : (
          <p>Card Content</p>
        )}
      </CardContent>
    );
};
