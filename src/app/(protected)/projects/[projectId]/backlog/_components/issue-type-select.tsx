import React, { Dispatch, SetStateAction } from "react";
import { Bookmark, CheckIcon, Circle } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const IssueTypeSelect = ({
  setIssueType,
}: {
  setIssueType: Dispatch<SetStateAction<"story" | "bug" | "task">>;
}) => {
  return (
    <Select
      defaultValue="story"
      onValueChange={(value) => {
        setIssueType(value as "story" | "bug" | "task");
      }}
    >
      <SelectTrigger className="w-[350px]">
        <SelectValue placeholder="Bug" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="story" value="story">
          <div className="flex items-center gap-x-3">
            <div className="shrink-0 bg-[#64BA3B] p-1">
              <Bookmark className="size-3" fill="#fff" stroke="#fff" />
            </div>
            <span>Story</span>
          </div>
        </SelectItem>
        <SelectItem key="task" value="task">
          <div className="flex items-center gap-x-3">
            <div className="shrink-0 bg-[#0B66E4] p-1">
              <CheckIcon className="size-3 text-white" strokeWidth={4} />
            </div>
            <span>Task</span>
          </div>
        </SelectItem>
        <SelectItem key="bug" value="bug">
          <div className="flex items-center gap-x-3">
            <div className="shrink-0 bg-[#E84C3D] p-1">
              <Circle className="size-3" fill="#fff" stroke="#fff" />
            </div>
            <span>Bug</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
