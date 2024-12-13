import { cn } from "@/lib/utils";
import React from "react";

export const DisplayIssuePriority = ({
  priority,
  className,
}: {
  priority: "low" | "medium" | "high";
  className?: string;
}) => {
  if (priority === "low") {
    return (
      <div className={cn("flex items-center gap-x-3", className)}>
        <div className="size-3 shrink-0 rounded-full bg-[#64BA3B]" />
        <span>Low</span>
      </div>
    );
  }
  if (priority === "medium") {
    return (
      <div className={cn("flex items-center gap-x-3", className)}>
        <div className="size-3 shrink-0 rounded-full bg-[#0B66E4]" />
        <span>Medium</span>
      </div>
    );
  }
  return (
    <div className={cn("flex items-center gap-x-3", className)}>
      <div className="size-3 shrink-0 rounded-full bg-[#E84C3D]" />
      <span>High</span>
    </div>
  );
};
