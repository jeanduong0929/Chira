import { Dispatch, SetStateAction } from "react";
import { useDrop } from "react-dnd";
import { IssueWithAssignee } from "../types/issue-with-assignee";
import { Doc } from "../../../../../../../convex/_generated/dataModel";
import { api } from "../../../../../../../convex/_generated/api";

import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { useConfirm } from "@/hooks/use-confirm";

export const Column = ({
  newStatus,
  children,
  member,
  setAssignedIssues,
  setUnassignedIssues,
}: {
  newStatus: "not_started" | "in_progress" | "completed";
  children: React.ReactNode;
  member:
    | (Doc<"members"> & {
        user: Doc<"users">;
      })
    | null;
  setAssignedIssues: Dispatch<SetStateAction<IssueWithAssignee[]>>;
  setUnassignedIssues: Dispatch<SetStateAction<IssueWithAssignee[]>>;
}) => {
  const { mutate: updateStatus } = useMutation({
    mutationFn: useConvexMutation(api.issues.updateStatus),
  });
  const { mutate: updateAssignee } = useMutation({
    mutationFn: useConvexMutation(api.issues.updateAssignee),
  });

  const [switchConfirm, SwitchConfirmDialog] = useConfirm();

  /**
   * Custom hook to handle drag-and-drop functionality for issues.
   *
   * This hook uses the `useDrop` method from `react-dnd` to specify the behavior
   * when an issue is dropped onto this column. It accepts issues of type "ISSUE".
   *
   * @param {Object} monitor - The monitor object provided by react-dnd, used to
   * collect information about the drag-and-drop state.
   * @returns {Object} - An object containing the `isOver` state, which indicates
   * whether the dragged item is currently over this drop target.
   *
   * @param {Object} draggedItem - The item being dragged, which contains:
   * @param {Doc<"issues">} draggedItem.issue - The issue document being dragged.
   * @param {string} draggedItem.type - The type of the dragged item.
   * @param {string | null} draggedItem.sourceAssigneeId - The ID of the assignee
   * from which the issue is being dragged, or null if unassigned.
   * @param {"not_started" | "in_progress" | "completed"} draggedItem.sourceStatus -
   * The current status of the issue being dragged.
   * @param {boolean} draggedItem.isUnassigned - A flag indicating whether the
   * issue is currently unassigned.
   *
   * The drop function handles the following scenarios:
   * - If the status of the issue has changed, it updates the status accordingly.
   * - If the assignee has changed, it prompts the user for confirmation before
   * updating the assignee.
   *
   * The `collect` function returns an object that contains the `isOver` state,
   * which is used to determine if the dragged item is currently over this column.
   */
  const [{ isOver }, drop] = useDrop({
    accept: "ISSUE",
    drop: async (draggedItem: {
      issue: Doc<"issues">;
      type: string;
      sourceAssigneeId: string | null;
      sourceStatus: "not_started" | "in_progress" | "completed";
      isUnassigned: boolean;
    }) => {
      console.log(draggedItem);
      const statusChanged = draggedItem.sourceStatus !== newStatus;
      const assigneeChanged = draggedItem.sourceAssigneeId !== member?.clerkId;

      if (!statusChanged && !assigneeChanged) return;

      if (statusChanged) {
        if (draggedItem.isUnassigned) {
          setUnassignedIssues((prev) =>
            prev.map((prevIssue) => {
              if (prevIssue._id === draggedItem.issue._id) {
                updateStatus({
                  issue: { id: draggedItem.issue._id, status: newStatus },
                });

                return {
                  ...prevIssue,
                  status: statusChanged ? newStatus : prevIssue.status,
                };
              }
              return prevIssue;
            }),
          );
        } else {
          setAssignedIssues((prev) =>
            prev.map((prevIssue) => {
              if (prevIssue._id === draggedItem.issue._id) {
                updateStatus({
                  issue: { id: draggedItem.issue._id, status: newStatus },
                });

                return {
                  ...prevIssue,
                  status: statusChanged ? newStatus : prevIssue.status,
                };
              }
              return prevIssue;
            }),
          );
        }
      } else if (assigneeChanged) {
        const ok = await switchConfirm();
        if (!ok) return;

        if (draggedItem.isUnassigned) {
          setUnassignedIssues((prev) =>
            prev.filter((prevIssue) => prevIssue._id !== draggedItem.issue._id),
          );

          setAssignedIssues((prev) => [
            ...prev,
            {
              ...draggedItem.issue,
              assignee: member
                ? {
                    ...member,
                    user: {
                      imageUrl: member.user.imageUrl || "",
                      name: member.user.name,
                    },
                  }
                : null,
              assigneeId: member ? member.clerkId : "",
            },
          ]);

          updateAssignee({
            issue: {
              id: draggedItem.issue._id,
              assigneeId: member?.clerkId || "",
            },
          });
        } else {
          if (member) {
            setAssignedIssues((prev) =>
              prev.map((prevIssue) => {
                if (prevIssue._id === draggedItem.issue._id) {
                  updateAssignee({
                    issue: {
                      id: draggedItem.issue._id,
                      assigneeId: member.clerkId,
                    },
                  });

                  return {
                    ...prevIssue,
                    assignee: member
                      ? {
                          ...member,
                          user: {
                            imageUrl: member.user.imageUrl || "",
                            name: member.user.name,
                          },
                        }
                      : null,
                    assigneeId: member ? member.clerkId : "",
                  };
                }
                return prevIssue;
              }),
            );
          } else {
            setAssignedIssues((prev) =>
              prev.filter(
                (prevIssue) => prevIssue._id !== draggedItem.issue._id,
              ),
            );

            setUnassignedIssues((prev) => {
              return [
                ...prev,
                {
                  ...draggedItem.issue,
                  assignee: null,
                  assigneeId: "",
                },
              ];
            });

            updateAssignee({
              issue: {
                id: draggedItem.issue._id,
                assigneeId: "",
              },
            });
          }
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <>
      <div
        ref={(node) => {
          if (node) drop(node);
        }}
        className="relative h-[320px] w-[270px] rounded-md bg-[#F7F8F9] dark:bg-[#202024]"
      >
        {isOver && (
          <div className="absolute left-0 top-0 flex w-full items-center">
            <div className="size-2 rounded-full border-2 border-blue-500" />
            <div className="h-[2px] w-full bg-blue-500" />
          </div>
        )}
        {children}
      </div>

      <SwitchConfirmDialog
        title="Switch Assignee"
        description="Are you sure you want to switch the assignee?"
      />
    </>
  );
};
