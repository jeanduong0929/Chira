import { Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useParams } from "next/navigation";
import { Column } from "./board-column";
import { IssueCard } from "./issue-card";
import { IssueWithAssignee } from "../types/issue-with-assignee";
import { boardColumns } from "../_constants/board-columns";
import { Doc } from "../../../../../../../convex/_generated/dataModel";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const UnassignedIssues = ({
  sprint,
  issues,
  setUnassignedIssues,
  setAssignedIssues,
}: {
  sprint: Doc<"sprints"> | null;
  issues: IssueWithAssignee[];
  setUnassignedIssues: Dispatch<SetStateAction<IssueWithAssignee[]>>;
  setAssignedIssues: Dispatch<SetStateAction<IssueWithAssignee[]>>;
}) => {
  const [showUnassigned, setShowUnassigned] = useState(true);

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center gap-x-2">
        <Button
          variant="ghost"
          size="iconXs"
          onClick={() => setShowUnassigned(!showUnassigned)}
        >
          <ChevronDown
            className={cn(
              "size-4 transition-transform duration-300 ease-in-out",
              showUnassigned ? "rotate-0" : "-rotate-90",
            )}
          />
        </Button>
        <h3 className="text-sm">Unassigned</h3>
      </div>

      {showUnassigned && (
        <div className="flex gap-x-5">
          {boardColumns.map(({ value }, index) => (
            <Column
              key={value}
              newStatus={value as "not_started" | "in_progress" | "completed"}
              member={null}
              setAssignedIssues={setAssignedIssues}
              setUnassignedIssues={setUnassignedIssues}
            >
              {!sprint && index === 0 && <GetStartedPrompts />}

              <div className="flex flex-col gap-y-1 p-2">
                {issues?.map(
                  (issue) =>
                    issue.status === value && (
                      <IssueCard key={issue._id} issue={issue} />
                    ),
                )}
              </div>
            </Column>
          ))}
        </div>
      )}
    </div>
  );
};

const GetStartedPrompts = () => {
  const { projectId } = useParams();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-y-5 px-5">
      <h3 className="text-sm font-medium">Get started in the backlog</h3>
      <p className="text-center text-sm text-muted-foreground">
        Plan and start a sprint to see issues here.
      </p>
      <Button
        variant={"secondary"}
        className="bg-[#E8EBEE] hover:bg-[#D5D9DF]"
        asChild
      >
        <Link href={`/projects/${projectId}/backlog`}>Go to Backlog</Link>
      </Button>
    </div>
  );
};
