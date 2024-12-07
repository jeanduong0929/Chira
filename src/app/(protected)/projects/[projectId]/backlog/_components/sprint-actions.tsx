import React from "react";
import { SprintDropdown } from "./sprint-dropdown";
import { Doc } from "../../../../../../../convex/_generated/dataModel";

import { Button } from "@/components/ui/button";

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
  return (
    <div className="flex items-center gap-x-2">
      {sprint.status === "not_started" && (
        <Button onClick={onStartSprint}>Start sprint</Button>
      )}
      {sprint.status === "active" && (
        <Button
          variant="secondary"
          onClick={onCompleteSprint}
          className="bg-[#E9EBEE] hover:bg-[#D5D9E0]"
        >
          Complete sprint
        </Button>
      )}
      <SprintDropdown sprint={sprint} />
    </div>
  );
};
