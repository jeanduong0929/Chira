import { Dispatch, SetStateAction } from "react";
import { useDrop } from "react-dnd";
import { IssueWithAssignee } from "../types/issue-with-assignee";
import { Doc } from "../../../../../../../convex/_generated/dataModel";
import { api } from "../../../../../../../convex/_generated/api";

import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";

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

  const [{ isOver }, drop] = useDrop({
    accept: "ISSUE",
    drop: (draggedItem: {
      issue: Doc<"issues">;
      type: string;
      sourceAssigneeId: string | null;
      sourceStatus: "not_started" | "in_progress" | "completed";
      isUnassigned: boolean;
    }) => {
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

            setUnassignedIssues((prev) => [
              ...prev,
              {
                ...draggedItem.issue,
                assignee: null,
                assigneeId: "",
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
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={(node) => {
        if (node) drop(node);
      }}
      className="relative h-[320px] w-[270px] rounded-md bg-[#F7F8F9]"
    >
      {isOver && (
        <div className="absolute left-0 top-0 flex w-full items-center">
          <div className="size-2 rounded-full border-2 border-blue-500" />
          <div className="h-[2px] w-full bg-blue-500" />
        </div>
      )}
      {children}
    </div>
  );
};
