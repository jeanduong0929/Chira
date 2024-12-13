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
   * Custom hook to handle the drop functionality for issues in the board column.
   *
   * @returns An array containing the drop state and the drop target ref.
   */
  const [{ isOver }, drop] = useDrop({
    accept: "ISSUE",
    /**
     * Handles the drop event when an issue is dropped onto the board column.
     *
     * @param draggedItem - The item being dragged, containing issue details and source information.
     * @param draggedItem.issue - The issue document being dragged.
     * @param draggedItem.type - The type of the dragged item.
     * @param draggedItem.sourceAssigneeId - The ID of the source assignee.
     * @param draggedItem.sourceStatus - The status of the issue before being dragged.
     * @param draggedItem.isUnassigned - Boolean indicating if the issue is unassigned.
     */
    drop: async (draggedItem: {
      issue: Doc<"issues">;
      type: string;
      sourceAssigneeId: string | null;
      sourceStatus: "not_started" | "in_progress" | "completed";
      isUnassigned: boolean;
    }) => {
      const statusChanged = draggedItem.sourceStatus !== newStatus;
      const assigneeChanged = draggedItem.sourceAssigneeId !== member?.clerkId;

      // Return only if nothing changes
      if (!statusChanged && !assigneeChanged) return;

      // Handle assignee change first if needed
      if (assigneeChanged) {
        const ok = await switchConfirm();
        if (!ok) return;

        if (draggedItem.isUnassigned) {
          // Moving from unassigned to assigned
          setUnassignedIssues((prev) =>
            prev.filter((prevIssue) => prevIssue._id !== draggedItem.issue._id),
          );

          setAssignedIssues((prev) => [
            ...prev,
            {
              ...draggedItem.issue,
              status: statusChanged ? newStatus : draggedItem.issue.status,
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
              reporter: {
                imageUrl: draggedItem.issue.reporterId,
                name: draggedItem.issue.reporterId,
              },
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
            // Moving between assigned users
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
                    status: statusChanged ? newStatus : prevIssue.status,
                    assignee: {
                      ...member,
                      user: {
                        imageUrl: member.user.imageUrl || "",
                        name: member.user.name,
                      },
                    },
                    assigneeId: member.clerkId,
                  };
                }
                return prevIssue;
              }),
            );
          } else {
            // Moving from assigned to unassigned
            setAssignedIssues((prev) =>
              prev.filter(
                (prevIssue) => prevIssue._id !== draggedItem.issue._id,
              ),
            );

            setUnassignedIssues((prev) => [
              ...prev,
              {
                ...draggedItem.issue,
                status: statusChanged ? newStatus : draggedItem.issue.status,
                assignee: null,
                assigneeId: "",
                reporter: {
                  imageUrl: draggedItem.issue.reporterId,
                  name: draggedItem.issue.reporterId,
                },
              },
            ]);

            updateAssignee({
              issue: {
                id: draggedItem.issue._id,
                assigneeId: "",
              },
            });
          }
        }
      }

      // Handle status change if needed
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
                  status: newStatus,
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
                  status: newStatus,
                };
              }
              return prevIssue;
            }),
          );
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
        className="relative max-h-[320px] min-h-[400px] w-[270px] overflow-y-auto rounded-md bg-[#F7F8F9] dark:bg-[#202024]"
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
