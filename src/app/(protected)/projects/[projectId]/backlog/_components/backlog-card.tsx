import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useDrop } from "react-dnd";
import { ChevronDown } from "lucide-react";
import { Issue } from "./issue";
import { DraggableIssue } from "./draggable-issue";
import { api } from "../../../../../../../convex/_generated/api";
import { Doc, Id } from "../../../../../../../convex/_generated/dataModel";

import { useQuery, useMutation } from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useConfirm } from "@/hooks/use-confirm";
import { useRandomName } from "@/hooks/use-generate-name";
import { Filter } from "@/components/ui/filter";
import { FilterCard } from "@/components/ui/filter-card";

export const BacklogCard = ({
  searchQuery,
  projectId,
  sprints,
}: {
  searchQuery: string;
  projectId: Id<"projects">;
  sprints: Doc<"sprints">[];
}) => {
  const [showBacklog, setShowBacklog] = useState(true);
  const [confirm, ConfirmDialog] = useConfirm();
  const [backlogConfirm, BacklogConfirmDialog] = useConfirm();
  const [displayFilterCard, setFilterCard] = useState(false);
  const [filteredIssues, setFilteredIssues] = useState<Doc<"issues">[]>([]);
  const [allFilteredIssues, setAllFilteredIssues] = useState<Doc<"issues">[]>([]);
  const { mutate: createSprint } = useMutation({
    mutationFn: useConvexMutation(api.sprints.create),
  });
  const { data: issues } = useQuery(
    convexQuery(api.issues.getAll, {
      projectId: projectId as Id<"projects">,
    }),
  );
  const { data: access } = useQuery(
    convexQuery(api.members.getAccess, {
      projectId: projectId as Id<"projects">,
    }),
  );
  const { mutate: moveToBacklog } = useMutation({
    mutationFn: useConvexMutation(api.issues.moveToBacklog),
  });

  const randomName = useRandomName();

  useEffect(() => {
    if (issues) {
      setFilteredIssues(issues.filter((issue) => !issue.sprintId));
      setAllFilteredIssues(issues.filter((issue) => !issue.sprintId));
    }
  }, [issues]);

  const searchIssues = useMemo(() => {
    if (!filteredIssues) return [];
    if (searchQuery === "") return filteredIssues;
    return filteredIssues?.filter((issue) =>
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, filteredIssues]);

  const [{ isOver }, drop] = useDrop({
    accept: "ISSUE",
    drop: async (draggedItem: { issue: Doc<"issues"> }) => {
      if (!draggedItem.issue.sprintId) return;

      const ok = await backlogConfirm();
      if (!ok) return;

      moveToBacklog(
        {
          issueId: draggedItem.issue._id,
        },
        {
          onSuccess: (data) => {
            if (data) {
              toast.success("Issue moved to backlog");
            }
          },
        },
      );
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const filterIssuesByPriority = (selectedPriority:string) => {
    if(selectedPriority == "None"){
      setFilteredIssues(allFilteredIssues);
      return;
    }
    const filteredIssues : Doc<"issues">[] = allFilteredIssues.filter(issue => issue.priority === selectedPriority.toLowerCase());
    setFilteredIssues(filteredIssues);
  }

  return (
    <>
      <ConfirmDialog
        title={"Create Sprint"}
        description={"Are you sure you want to create a sprint?"}
      />
      <BacklogConfirmDialog
        title={"Move to Backlog"}
        description={"Are you sure you want to move this issue to the backlog?"}
      />

      <div className="flex flex-col gap-y-1">
        <div className="flex items-center justify-between gap-x-1">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center gap-x-1">
              <Button
                variant={"ghost"}
                size={"iconXs"}
                onClick={() => setShowBacklog(!showBacklog)}
              >
                <ChevronDown
                  className={cn(
                    "transition-transform duration-300 ease-in-out",
                    showBacklog ? "rotate-0" : "-rotate-90",
                  )}
                />
              </Button>
              <p className="text-sm font-medium">Backlog</p>
            </div>
            <p className="text-xs text-gray-500">
              ({filteredIssues.length} issues)
            </p>
          </div>

          <div>
            <div className="mb-5">
              <Filter openFilterCard={() => setFilterCard(prev => !prev)}></Filter>
            </div>

            <div className="absolute z-10">
              {displayFilterCard && <FilterCard filterPriority = {filterIssuesByPriority}></FilterCard>}

            </div>
          </div>
       
          {access?.role === "admin" && (
            <Button
              variant={"ghost"}
              onClick={async () => {
                const ok = await confirm();
                if (!ok) return;

                createSprint(
                  {
                    name: randomName,
                    projectId: projectId as Id<"projects">,
                    index: sprints?.length ?? 0,
                  },
                  {
                    onSuccess: (data) => {
                      if (data) {
                        toast.success("Sprint created");
                      }
                    },
                  },
                );
              }}
            >
              Create Sprint
            </Button>
          )}
        </div>
        {showBacklog &&
          (filteredIssues?.length === 0 ? (
            <div
              ref={(node) => {
                if (node) drop(node);
              }}
              className={cn(
                "rounded-lg border-2 border-dashed border-gray-200 p-4",
                isOver && "border-blue-500",
              )}
            >
              <p className="text-center text-xs text-gray-500">
                Your backlog is empty
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {searchIssues.map((issue, idx) =>
                searchQuery ? (
                  <Issue
                    key={issue._id}
                    issue={issue}
                    projectId={projectId}
                    inSprint={false}
                    sprintId={null}
                  />
                ) : (
                  <DraggableIssue
                    key={issue._id}
                    issue={issue}
                    index={idx}
                    projectId={projectId}
                    setFilteredIssues={setFilteredIssues}
                  />
                ),
              )}
            </div>
          ))}
      </div>
    </>
  );
};
