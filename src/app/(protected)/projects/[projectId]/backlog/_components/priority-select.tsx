import React, { Dispatch, SetStateAction } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const PrioritySelect = ({
  setPriority,
}: {
  setPriority: Dispatch<SetStateAction<"low" | "medium" | "high">>;
}) => {
  return (
    <Select
      defaultValue="low"
      onValueChange={(value) => {
        setPriority(value as "low" | "medium" | "high");
      }}
    >
      <SelectTrigger className="w-[350px]">
        <SelectValue placeholder="Bug" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="low" value="low">
          <div className="flex items-center gap-x-3">
            <div className="size-3 shrink-0 bg-[#64BA3B]" />
            <span>Low</span>
          </div>
        </SelectItem>
        <SelectItem key="medium" value="medium">
          <div className="flex items-center gap-x-3">
            <div className="size-3 shrink-0 bg-[#0B66E4]" />
            <span>Medium</span>
          </div>
        </SelectItem>
        <SelectItem key="high" value="high">
          <div className="flex items-center gap-x-3">
            <div className="size-3 shrink-0 bg-[#E84C3D]" />
            <span>High</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
