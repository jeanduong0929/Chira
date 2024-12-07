import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SprintCard } from "./sprint-card";
import { Doc, Id } from "../../../../../../../convex/_generated/dataModel";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SprintsListProps {
  sprints: (Doc<"sprints"> & { issues: Doc<"issues">[] })[];
  openSprints: Record<Id<"sprints">, boolean>;
  onToggleSprint: (sprintId: Id<"sprints">) => void;
}

export const SprintsList = ({
  sprints,
  openSprints,
  onToggleSprint,
}: SprintsListProps) => {
  const [showCompleted, setShowCompleted] = useState(false);

  const completedSprints = sprints.filter(
    (sprint) => sprint.status === "completed",
  );
  const activeSprints = sprints.filter(
    (sprint) => sprint.status !== "completed",
  );

  return (
    <div className="flex flex-col gap-y-5">
      {activeSprints.map((sprint) => (
        <SprintCard
          key={sprint._id}
          sprint={sprint}
          sprints={sprints}
          open={openSprints[sprint._id]}
          setOpen={() => onToggleSprint(sprint._id)}
        />
      ))}

      {completedSprints.length > 0 && (
        <div className="flex items-center gap-x-1">
          <Button
            variant={"ghost"}
            size={"iconXs"}
            onClick={() => setShowCompleted(!showCompleted)}
          >
            <ChevronDown
              className={cn(
                "transition-transform duration-300 ease-in-out",
                showCompleted ? "rotate-0" : "-rotate-90",
              )}
            />
          </Button>
          <p className="text-sm font-medium">
            Completed sprints ({completedSprints.length})
          </p>
        </div>
      )}
      {showCompleted &&
        completedSprints.map((sprint) => (
          <SprintCard
            key={sprint._id}
            sprint={sprint}
            sprints={sprints}
            open={openSprints[sprint._id]}
            setOpen={() => onToggleSprint(sprint._id)}
          />
        ))}
    </div>
  );
};
