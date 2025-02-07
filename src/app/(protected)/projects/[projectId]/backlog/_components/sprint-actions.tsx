import React from "react";
import { SprintDropdown } from "./sprint-dropdown";
import { api } from "../../../../../../../convex/_generated/api";
import { Doc } from "../../../../../../../convex/_generated/dataModel";

import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { FilterDropDown } from "@/components/ui/filter-drop-down";

interface SprintActionsProps {
  sprint: Doc<"sprints">;
  onStartSprint: () => void;
  onCompleteSprint: () => void;
  updateIssueFilterByPriority: (priority:string) => void;
}

export const SprintActions = ({
  sprint,
  onStartSprint,
  onCompleteSprint,
  updateIssueFilterByPriority
}: SprintActionsProps) => {
  const { data: member } = useQuery(
    convexQuery(api.members.getAccess, {
      projectId: sprint.projectId,
    }),
  );

  const filterByPriority = (priority: string) => {
    // Implement filtering logic here
    updateIssueFilterByPriority(priority);
  };

  return (
    <div className="flex items-center gap-x-2">
      {sprint.status === "not_started" && (
        <Button onClick={onStartSprint}>Start sprint</Button>
      )}
        <FilterDropDown filterByPriority={filterByPriority}></FilterDropDown>

      {sprint.status === "active" && (
        <Button
          variant="secondary"
          onClick={onCompleteSprint}
          className="bg-[#E9EBEE] hover:bg-[#D5D9E0] dark:bg-[#262626] dark:hover:bg-[#1A1A1A]"
        >
          Complete sprint
        </Button>
      )}
      {member?.role === "admin" && <SprintDropdown sprint={sprint} />}
    </div>
  );
};
