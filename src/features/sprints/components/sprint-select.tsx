import React, { Dispatch, SetStateAction } from "react";
import { Doc, Id } from "../../../../convex/_generated/dataModel";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SprintSelect = ({
  currentSprint,
  sprints,
  setSprint,
}: {
  sprints: Doc<"sprints">[];
  currentSprint: Doc<"sprints"> | null;
  setSprint: Dispatch<SetStateAction<Id<"sprints"> | null>>;
}) => {
  return (
    <Select
      defaultValue={currentSprint?._id ?? "backlog"}
      onValueChange={(value) => {
        if (value === "backlog") {
          setSprint(null);
        } else {
          setSprint(value as Id<"sprints">);
        }
      }}
    >
      <SelectTrigger className="w-[350px]">
        <SelectValue placeholder="Sprint" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key={"backlog"} value={"backlog"}>
          Backlog
        </SelectItem>
        {sprints.map((s) => (
          <SelectItem key={s._id} value={s._id}>
            {s.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
