import { cn } from "@/lib/utils";
import { Circle, Bookmark, CheckIcon } from "lucide-react";

export const DisplayIssueType = ({
  issueType,
  className,
}: {
  issueType: "story" | "bug" | "task";
  className?: string;
}) => {
  if (issueType === "story") {
    return (
      <div className={cn("flex items-center gap-x-3", className)}>
        <div className="shrink-0 bg-[#64BA3B] p-1">
          <Bookmark className="size-3" fill="#fff" stroke="#fff" />
        </div>
        <span>Story</span>
      </div>
    );
  }
  if (issueType === "task") {
    return (
      <div className={cn("flex items-center gap-x-3", className)}>
        <div className="shrink-0 bg-[#0B66E4] p-1">
          <CheckIcon className="size-3 text-white" strokeWidth={4} />
        </div>
        <span>Task</span>
      </div>
    );
  }
  if (issueType === "bug") {
    return (
      <div className={cn("flex items-center gap-x-3", className)}>
        <div className="shrink-0 bg-[#E84C3D] p-1">
          <Circle className="size-3" fill="#fff" stroke="#fff" />
        </div>
        <span>Bug</span>
      </div>
    );
  }
  return null;
};
