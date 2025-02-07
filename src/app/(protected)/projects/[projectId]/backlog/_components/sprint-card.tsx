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
  const [selectedPriority, setSelectedPriority] = useState("Not Selected");
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

  const updateIssueFilterByPriority = (priority:string) => {
    setSelectedPriority(priority);
  }
  /**
   * Custom hook to handle the drop functionality for issues in the sprint card.
   *
   * @returns {Object} An object containing the drop state and the drop target ref.
   * @property {boolean} isOver - Indicates whether an issue is currently being dragged over the sprint card.
   * @property {function} drop - A ref function to be attached to the drop target.
   */
  const [{ isOver }, drop] = useDrop({
    accept: "ISSUE",
    /**
     * Handles the drop event when an issue is dropped onto the sprint card.
     *
     * @param {Object} draggedItem - The item being dragged, containing issue details.
     * @param {Doc<"issues">} draggedItem.issue - The issue document being dragged.
     *
     * @returns {Promise<void>} A promise that resolves when the drop action is complete.
     */
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
    /**
     * Collects the drop state from the monitor.
     *
     * @param {Object} monitor - The monitor object from react-dnd.
     * @returns {Object} An object containing the drop state.
     * @property {boolean} isOver - Indicates whether the drop target is currently being hovered over.
     */
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  /**
   * Handles the action of starting a sprint.
   *
   * This function checks if there is already an active sprint and if the current sprint has any issues.
   * If there is an active sprint, it displays an error message indicating that only one active sprint is allowed.
   * If the current sprint has no issues, it displays an error message prompting the user to add issues before starting the sprint.
   * If both conditions are satisfied, it opens the dialog to start the sprint.
   */
  const handleStartSprint = () => {
    if (sprints.filter((s) => s.status === "active").length > 0) {
      toast.error("You can only have one active sprint");
      return;
    }
    if (sprint.issues.length === 0) {
      toast.error("You need to add issues to the sprint before starting it");
      return;
    }
    setStartSprintDialogOpen(true);
  };

  /**
   * Formats the start and end dates of a sprint into a readable string.
   *
   * @param {string | undefined} startDate - The start date of the sprint. If undefined, the function will return an empty string.
   * @param {string | undefined} endDate - The end date of the sprint. If undefined, the function will return an empty string.
   * @returns {string} A formatted string representing the date range of the sprint in the format "MMM DD - MMM DD".
   * If either the startDate or endDate is not provided, an empty string is returned.
   */
  const formatSprintDate = (
    startDate: string | undefined,
    endDate: string | undefined,
  ) => {
    if (!startDate || !endDate) return "";

    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    const start = new Date(startDate).toLocaleDateString(undefined, options);
    const end = new Date(endDate).toLocaleDateString(undefined, options);

    return `${start} - ${end}`;
  };

  return (
    <>
      <Card
        className={cn(
          "border-none bg-[#F7F8F9] dark:bg-[#202024]",
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
                updateIssueFilterByPriority={updateIssueFilterByPriority}
                onCompleteSprint={() => setCompleteSprintDialogOpen(true)}
              />
            )}
          </CardTitle>
        </CardHeader>
        {open && <SprintContent sprint={sprint} isOver={isOver} priority={selectedPriority}/>}
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
