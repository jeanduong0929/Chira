import { Bookmark, CheckIcon, Circle } from "lucide-react";

export const IssueType = ({
  issueType,
}: {
  issueType: "story" | "task" | "bug";
}) => {
  if (issueType === "story") {
    return (
      <div className="flex items-center gap-x-3 text-sm">
        <div className="shrink-0 bg-[#64BA3B] p-1">
          <Bookmark className="size-3" fill="#fff" stroke="#fff" />
        </div>
        <span>Story</span>
      </div>
    );
  }

  if (issueType === "task") {
    return (
      <div className="flex items-center gap-x-3 text-sm">
        <div className="shrink-0 bg-[#0B66E4] p-1">
          <CheckIcon className="size-3 text-white" strokeWidth={4} />
        </div>
        <span>Task</span>
      </div>
    );
  }

  if (issueType === "bug") {
    return (
      <div className="flex items-center gap-x-3 text-sm">
        <div className="shrink-0 bg-[#E84C3D] p-1">
          <Circle className="size-3" fill="#fff" stroke="#fff" />
        </div>
        <span>Bug</span>
      </div>
    );
  }

  return null;
};
