import React, { Dispatch, SetStateAction } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DisplayIssuePriority } from "@/features/issues/components/display-issue-priority";

export const PrioritySelect = ({
  setPriority,
  priority,
}: {
  setPriority: Dispatch<SetStateAction<"low" | "medium" | "high">>;
  priority: "low" | "medium" | "high";
}) => {
  return (
    <Select
      defaultValue={priority}
      onValueChange={(value) => {
        setPriority(value as "low" | "medium" | "high");
      }}
    >
      <SelectTrigger className="w-[350px]">
        <SelectValue placeholder="Bug" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="low" value="low">
          <DisplayIssuePriority priority="low" />
        </SelectItem>
        <SelectItem key="medium" value="medium">
          <DisplayIssuePriority priority="medium" />
        </SelectItem>
        <SelectItem key="high" value="high">
          <DisplayIssuePriority priority="high" />
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
