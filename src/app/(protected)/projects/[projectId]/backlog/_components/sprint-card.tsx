import React from "react";
import { SpringDropdown } from "./sprint-dropdown";
import { Doc } from "../../../../../../../convex/_generated/dataModel";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SprintCardProps {
  index: number;
  sprint: Doc<"sprints"> & {
    issues: Doc<"issues">[];
  };
}

export const SprintCard = ({ index, sprint }: SprintCardProps) => {
  return (
    <Card className="border-none bg-[#F7F8F9]">
      <CardHeader>
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

      <CardContent className="mx-2 rounded-lg border-2 border-dashed border-gray-200">
        <p>Card Content</p>
      </CardContent>

      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
};
