import React from "react";
import { ChevronDown } from "lucide-react";
import { SprintDropdown } from "./sprint-dropdown";
import { Issue } from "./issue";
import { Doc } from "../../../../../../../convex/_generated/dataModel";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SprintCardProps {
  sprint: Doc<"sprints"> & {
    issues: Doc<"issues">[];
  };
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const SprintCard = ({ sprint, open, setOpen }: SprintCardProps) => {
  return (
    <Card className="border-none bg-[#F7F8F9]">
      <CardHeader className="py-1">
        <CardTitle className="text-md flex items-center justify-between">
          <div className="flex items-center gap-x-3">
            <div className="flex items-center gap-x-1">
              <Button
                variant={"ghost"}
                size={"iconXs"}
                className="hover:bg-[#D5D9E0]"
                onClick={() => setOpen(!open)}
              >
                <ChevronDown
                  className={cn(
                    "transition-transform duration-300 ease-in-out",
                    open ? "rotate-0" : "-rotate-90",
                  )}
                />
              </Button>
              <span>{sprint.name}</span>
            </div>
            <p className="text-xs font-normal text-muted-foreground">
              ({sprint.issues.length} issues)
            </p>
          </div>
          <SprintDropdown sprint={sprint} />
        </CardTitle>
        <CardDescription className="hidden" />
      </CardHeader>

      {open && (
        <>
          <EmptySprintCardContent issues={sprint.issues} />
          <div className="mx-2 mb-5">
            {sprint.issues.map((issue) => (
              <Issue
                key={issue._id}
                issue={issue}
                projectId={issue.projectId}
                inSprint={true}
              />
            ))}
          </div>
        </>
      )}
    </Card>
  );
};

const EmptySprintCardContent = ({ issues }: { issues: Doc<"issues">[] }) => {
  if (issues.length === 0)
    return (
      <CardContent
        className={cn(
          issues.length === 0 &&
            "mx-5 mb-5 flex h-[188px] items-center justify-center rounded-lg border-2 border-dashed border-gray-200",
        )}
      >
        {issues.length === 0 ? (
          <p className="text-xs font-semibold text-muted-foreground">
            Plan your sprint
          </p>
        ) : (
          <p>Card Content</p>
        )}
      </CardContent>
    );
};
