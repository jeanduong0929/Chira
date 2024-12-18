import React from "react";
import { SprintDropdown } from "./sprint-dropdown";
import { api } from "../../../../../../../convex/_generated/api";
import { Doc } from "../../../../../../../convex/_generated/dataModel";

import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";

interface SprintActionsProps {
  sprint: Doc<"sprints">;
  onStartSprint: () => void;
  onCompleteSprint: () => void;
}

export const SprintActions = ({
  sprint,
  onStartSprint,
  onCompleteSprint,
}: SprintActionsProps) => {
  const { data: member } = useQuery(
    convexQuery(api.members.getAccess, {
      projectId: sprint.projectId,
    }),
  );

  return (
    <div className="flex items-center gap-x-2">
      {sprint.status === "not_started" && (
        <Button onClick={onStartSprint}>Start sprint</Button>
      )}
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
