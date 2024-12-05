import { Doc, Id } from "../../../../../../../convex/_generated/dataModel";
import { SprintCard } from "./sprint-card";

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
  return (
    <>
      {sprints.map((sprint) => (
        <SprintCard
          key={sprint._id}
          sprint={sprint}
          sprints={sprints}
          open={openSprints[sprint._id]}
          setOpen={(open) => onToggleSprint(sprint._id)}
        />
      ))}
    </>
  );
};
