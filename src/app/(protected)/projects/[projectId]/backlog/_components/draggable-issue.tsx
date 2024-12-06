import React, { Dispatch, SetStateAction } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Issue } from "./issue";
import { Doc, Id } from "../../../../../../../convex/_generated/dataModel";
import { api } from "../../../../../../../convex/_generated/api";

import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { cn } from "@/lib/utils";

export const DraggableIssue = ({
  issue,
  index,
  projectId,
  setFilteredIssues,
}: {
  issue: Doc<"issues">;
  index: number;
  projectId: Id<"projects">;
  setFilteredIssues: Dispatch<SetStateAction<Doc<"issues">[]>>;
}) => {
  const { mutate: updateSequence } = useMutation({
    mutationFn: useConvexMutation(api.issues.updateSequence),
  });

  const moveIssue = (fromIndex: number, toIndex: number) => {
    setFilteredIssues((prevItems) => {
      const newItems = [...prevItems];
      const [movedItem] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, movedItem);

      setTimeout(() => {
        updateSequence({
          issues: newItems.map((issue, idx) => ({
            issueId: issue._id,
            sequence: idx,
          })),
        });
      }, 0);
      return newItems;
    });
  };

  const [{ isDragging }, drag] = useDrag({
    type: "ISSUE",
    item: { index, type: "ISSUE", issue },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "ISSUE",
    drop: (draggedItem: { index: number; type: string }) => {
      if (draggedItem.type === "ISSUE" && draggedItem.index !== index) {
        moveIssue(draggedItem.index, index);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <Issue
      issue={issue}
      projectId={projectId}
      ref={(node) => {
        if (node) drag(drop(node));
      }}
      inSprint={false}
      className={cn(isDragging && "opacity-50")}
      sprintId={null}
    >
      {isOver && canDrop && (
        <div className="absolute -top-1 left-0 flex w-full items-center">
          <div className="size-2 rounded-full border-2 border-blue-500" />
          <div className="h-[2px] w-full bg-blue-500" />
        </div>
      )}
    </Issue>
  );
};
