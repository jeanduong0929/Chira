import { Dispatch, SetStateAction } from "react";
import { useDrop } from "react-dnd";
import { Doc } from "../../../../../../../convex/_generated/dataModel";
import { api } from "../../../../../../../convex/_generated/api";

import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";

export const Column = ({
  value,
  children,
  setIssues,
}: {
  value: "not_started" | "in_progress" | "completed";
  children: React.ReactNode;
  setIssues: Dispatch<SetStateAction<Doc<"issues">[]>>;
}) => {
  const { mutate: updateStatus } = useMutation({
    mutationFn: useConvexMutation(api.issues.updateStatus),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "COLUMN",
    drop: (draggedItem: { issue: Doc<"issues">; type: string }) => {
      if (draggedItem.type === "COLUMN" && draggedItem.issue.status !== value) {
        setIssues((prev) =>
          prev.map((i) => {
            if (i._id === draggedItem.issue._id) {
              return { ...i, status: value };
            }
            return i;
          }),
        );

        updateStatus({
          issue: { id: draggedItem.issue._id, status: value },
        });
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
