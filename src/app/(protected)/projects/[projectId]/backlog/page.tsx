"use client";

import React, {
  SetStateAction,
  Dispatch,
  useState,
  useEffect,
  useMemo,
} from "react";
import { toast } from "sonner";
import { ChevronDown, Search } from "lucide-react";
import { useParams } from "next/navigation";
import { useDrag, useDrop } from "react-dnd";
import { SprintsList } from "./_components/sprints-list";
import { Issue } from "./_components/issue";
import { api } from "../../../../../../convex/_generated/api";
import { Doc, Id } from "../../../../../../convex/_generated/dataModel";

import { Input } from "@/components/ui/input";
import { useQuery, useMutation } from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useConfirm } from "@/hooks/use-confirm";
import { Skeleton } from "@/components/ui/skeleton";
import { useRandomName } from "@/hooks/use-generate-name";

const BacklogPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openSprints, setOpenSprints] = useState<
    Record<Id<"sprints">, boolean>
  >({});
  const { projectId } = useParams();

  const { data: sprints, isLoading } = useQuery(
    convexQuery(api.sprints.getAll, {
      projectId: projectId as Id<"projects">,
    }),
  );

  useEffect(() => {
    if (sprints?.length) {
      setOpenSprints(
        sprints.reduce(
          (acc, sprint) => ({
            ...acc,
            [sprint._id]: true,
          }),
          {},
        ),
      );
    }
  }, [sprints]);

  const toggleSprint = (sprintId: Id<"sprints">) => {
    setOpenSprints((prev) => ({
      ...prev,
      [sprintId]: !prev[sprintId],
    }));
  };

  return (
    <div className="flex flex-col gap-y-10">
      <BacklogHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="flex flex-col gap-y-5">
        {isLoading ? (
          <Skeleton className="h-[252px] w-full rounded-xl" />
        ) : (
          <>
            <SprintsList
              sprints={sprints ?? []}
              openSprints={openSprints}
              onToggleSprint={toggleSprint}
            />
            <BacklogCard
              searchQuery={searchQuery}
              projectId={projectId as Id<"projects">}
              sprints={sprints ?? []}
            />
          </>
        )}
      </div>
    </div>
  );
};

const BacklogHeader = ({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div className="flex flex-col gap-y-5">
      <h1 className="text-2xl font-semibold">Backlog</h1>

      <div className="relative flex w-[224px] items-center">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search issues"
        />
        <Search className="absolute right-5 size-3" />
      </div>
    </div>
  );
};

const BacklogCard = ({
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
  const [filteredIssues, setFilteredIssues] = useState<Doc<"issues">[]>([]);

  const { mutate: createSprint } = useMutation({
    mutationFn: useConvexMutation(api.sprints.create),
  });
  const { data: issues } = useQuery(
    convexQuery(api.issues.getAll, {
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

const DraggableIssue = ({
  issue,
  index,
  projectId,
  setFilteredIssues,
}: {
  issue: Doc<"issues">;
  index: number;
  projectId: Id<"projects">;
  setFilteredIssues: Dispatch<SetStateAction<Doc<"issues">[]>>;
}) => {
  const { mutate: updateSequence } = useMutation({
    mutationFn: useConvexMutation(api.issues.updateSequence),
  });

  const moveIssue = (fromIndex: number, toIndex: number) => {
    setFilteredIssues((prevItems) => {
      const newItems = [...prevItems];
      const [movedItem] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, movedItem);

      setTimeout(() => {
        updateSequence({
          issues: newItems.map((issue, idx) => ({
            issueId: issue._id,
            sequence: idx,
          })),
        });
      }, 0);
      return newItems;
    });
  };

  const [{ isDragging }, drag] = useDrag({
    type: "ISSUE",
    item: { index, type: "ISSUE", issue },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "ISSUE",
    drop: (draggedItem: { index: number; type: string }) => {
      if (draggedItem.type === "ISSUE" && draggedItem.index !== index) {
        moveIssue(draggedItem.index, index);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <Issue
      issue={issue}
      projectId={projectId}
      ref={(node) => {
        if (node) drag(drop(node));
      }}
      inSprint={false}
      className={cn(isDragging && "opacity-50")}
      sprintId={null}
    >
      {isOver && canDrop && (
        <div className="absolute -top-1 left-0 flex w-full items-center">
          <div className="size-2 rounded-full border-2 border-blue-500" />
          <div className="h-[2px] w-full bg-blue-500" />
        </div>
      )}
    </Issue>
  );
};

export default BacklogPage;
