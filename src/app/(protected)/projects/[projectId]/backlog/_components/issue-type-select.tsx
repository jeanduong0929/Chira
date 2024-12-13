import React, { Dispatch, SetStateAction } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DisplayIssueType } from "@/features/issues/components/display-issue-type";

export const IssueTypeSelect = ({
  setIssueType,
  issueType,
}: {
  setIssueType: Dispatch<SetStateAction<"story" | "bug" | "task">>;
  issueType: "story" | "bug" | "task";
}) => {
  return (
    <Select
      defaultValue={issueType}
      onValueChange={(value) => {
        setIssueType(value as "story" | "bug" | "task");
      }}
    >
      <SelectTrigger className="w-[350px]">
        <SelectValue placeholder="Bug" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="story" value="story">
          <DisplayIssueType issueType="story" />
        </SelectItem>
        <SelectItem key="task" value="task">
          <DisplayIssueType issueType="task" />
        </SelectItem>
        <SelectItem key="bug" value="bug">
          <DisplayIssueType issueType="bug" />
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
