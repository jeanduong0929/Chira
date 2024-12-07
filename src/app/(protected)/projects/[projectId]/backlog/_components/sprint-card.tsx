import React, { useState } from "react";
import { toast } from "sonner";
import { useDrop } from "react-dnd";
import { ChevronDown } from "lucide-react";
import { SprintActions } from "./sprint-actions";
import { SprintContent } from "./sprint-content";
import { StartSprintDialog } from "./start-sprint-dialog";
import { CompleteSprintDialog } from "./complete-sprint-dialog";
import { Doc } from "../../../../../../../convex/_generated/dataModel";
import { api } from "../../../../../../../convex/_generated/api";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useConfirm } from "@/hooks/use-confirm";

interface SprintCardProps {
  sprint: Doc<"sprints"> & { issues: Doc<"issues">[] };
  sprints: Doc<"sprints">[];
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const SprintCard = ({
  sprint,
  sprints,
  open,
  setOpen,
}: SprintCardProps) => {
  const [startSprintDialogOpen, setStartSprintDialogOpen] = useState(false);
  const [completeSprintDialogOpen, setCompleteSprintDialogOpen] =
    useState(false);
  const [moveToSprintConfirm, MoveToSprintConfirmDialog] = useConfirm();

  const { data: access } = useQuery(
    convexQuery(api.members.getAccess, {
      projectId: sprint.projectId,
    }),
  );
  const { mutate: moveToSprint } = useMutation({
    mutationFn: useConvexMutation(api.issues.moveToSprint),
    onSuccess: (data) => {
      if (data) toast.success("Issue moved to sprint");
    },
  });

  const [{ isOver }, drop] = useDrop({
    accept: "ISSUE",
    drop: async (draggedItem: { issue: Doc<"issues"> }) => {
      if (draggedItem.issue.sprintId === sprint._id) return;
      if (sprint.status === "completed") return;

      const ok = await moveToSprintConfirm();
      if (!ok) return;

      moveToSprint({
        issueId: draggedItem.issue._id,
        sprintId: sprint._id,
      });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleStartSprint = () => {
    if (sprints.filter((s) => s.status === "active").length > 0) {
      toast.error("You can only have one active sprint");
      return;
    }
    setStartSprintDialogOpen(true);
  };

  function formatSprintDate(
    startDate: string | undefined,
    endDate: string | undefined,
  ) {
    if (!startDate || !endDate) return "";

    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    const start = new Date(startDate).toLocaleDateString(undefined, options);
    const end = new Date(endDate).toLocaleDateString(undefined, options);

    return `${start} - ${end}`;
  }

  return (
    <>
      <Card
        className={cn(
          "border-none bg-[#F7F8F9]",
          sprint.status === "completed" &&
            "pointer-events-none bg-[#E9EBEE] opacity-50",
        )}
        ref={(node) => {
          if (node) drop(node);
        }}
      >
        <CardHeader className="py-1">
          <CardTitle className="text-md flex items-center justify-between py-2">
            <div className="flex items-center gap-x-3">
              <Button
                variant="ghost"
                size="iconXs"
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
              <span
                className={cn(
                  "text-xs font-normal",
                  !formatSprintDate(sprint.startDate, sprint.endDate) &&
                    "hidden",
                )}
              >
                {formatSprintDate(sprint.startDate, sprint.endDate)}
              </span>
              <p className="text-xs font-normal text-muted-foreground">
                ({sprint.issues.length} issues)
              </p>
            </div>

            {access?.role === "admin" && (
              <SprintActions
                sprint={sprint}
                onStartSprint={handleStartSprint}
                onCompleteSprint={() => setCompleteSprintDialogOpen(true)}
              />
            )}
          </CardTitle>
        </CardHeader>

        {open && <SprintContent sprint={sprint} isOver={isOver} />}
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
      <MoveToSprintConfirmDialog
        title="Move issues to sprint"
        description="Are you sure you want to move all issues to this sprint?"
      />
    </>
  );
};
