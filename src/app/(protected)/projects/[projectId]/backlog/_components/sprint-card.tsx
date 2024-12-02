import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SprintDropdown } from "./sprint-dropdown";
import { Issue } from "./issue";
import { StartSprintDialog } from "./start-sprint-dialog";
import { CompleteSprintDialog } from "./complete-sprint-dialog";
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
  const [startSprintDialogOpen, setStartSprintDialogOpen] = useState(false);
  const [completeSprintDialogOpen, setCompleteSprintDialogOpen] =
    useState(false);

  const getDate = () => {
    return (
      new Date(sprint.startDate as string).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      }) +
      " - " +
      new Date(sprint.endDate as string).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      })
    );
  };

  return (
    <>
      <Card className="border-none bg-[#F7F8F9]">
        <CardHeader className="py-1">
          <CardTitle className="text-md flex items-center justify-between py-2">
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
              <span className="text-xs font-normal">{getDate()}</span>
              <p className="text-xs font-normal text-muted-foreground">
                ({sprint.issues.length} issues)
              </p>
            </div>
            <div className="flex items-center gap-x-2">
              {sprint.status === "not_started" && (
                <Button onClick={() => setStartSprintDialogOpen(true)}>
                  Start sprint
                </Button>
              )}
              {sprint.status === "active" && (
                <Button
                  variant={"secondary"}
                  onClick={() => setCompleteSprintDialogOpen(true)}
                  className="bg-[#E9EBEE] hover:bg-[#D5D9E0]"
                >
                  Complete sprint
                </Button>
              )}
              <SprintDropdown sprint={sprint} />
            </div>
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

      <StartSprintDialog
        sprintId={sprint._id}
        open={startSprintDialogOpen}
        setOpen={setStartSprintDialogOpen}
      />
      <CompleteSprintDialog
        sprint={sprint}
        open={completeSprintDialogOpen}
        setOpen={setCompleteSprintDialogOpen}
      />
    </>
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
