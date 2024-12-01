import { useDrag, useDrop } from "react-dnd";
import { Doc, Id } from "../../../../../../../convex/_generated/dataModel";
import { BacklogDropdown } from "./backlog-dropdown";

interface Props {
  issue: Doc<"issues">;
  index: number;
  projectId: Id<"projects">;
  moveIssue: (fromIndex: number, toIndex: number) => void;
}

export const DraggableIssue = ({
  issue,
  index,
  projectId,
  moveIssue,
}: Props) => {
  const [, drag] = useDrag({
    type: "ISSUE",
    item: { index, type: "ISSUE" },
  });

  const [{ isOver }, drop] = useDrop({
    accept: "ISSUE",
    drop: (draggedItem: { index: number; type: string }) => {
      if (draggedItem.type === "ISSUE" && draggedItem.index !== index) {
        moveIssue(draggedItem.index, index);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={(node) => {
        drag(node);
        drop(node);
      }}
      className="flex items-center justify-between border px-10 py-2"
    >
      <div className="flex items-center gap-x-2">
        <p className="text-sm font-medium">{issue.title}</p>
      </div>
      <div className="flex items-center gap-x-2">
        <BacklogDropdown
          issueId={issue._id}
          projectId={projectId}
          inSprint={false}
        />
      </div>
    </div>
  );
};
