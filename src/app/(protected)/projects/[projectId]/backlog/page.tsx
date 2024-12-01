"use client";

import React, { SetStateAction, Dispatch, useState, useEffect } from "react";
import { toast } from "sonner";
import { ChevronDown, Search } from "lucide-react";
import { useParams } from "next/navigation";
import { SprintCard } from "./_components/sprint-card";
import { api } from "../../../../../../convex/_generated/api";
import { Doc, Id } from "../../../../../../convex/_generated/dataModel";

import { Input } from "@/components/ui/input";
import { useQuery, useMutation } from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useConfirm } from "@/hooks/use-confirm";
import { Skeleton } from "@/components/ui/skeleton";
import { BacklogDropdown } from "./_components/backlog-dropdown";

const BacklogPage = () => {
  const [name, setName] = useState("");
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
    if (sprints && sprints.length > 0) {
      setOpenSprints(
        sprints.reduce(
          (acc, sprint) => {
            acc[sprint._id] = true;
            return acc;
          },
          {} as Record<Id<"sprints">, boolean>,
        ),
      );
    }
  }, [sprints]);

  return (
    <div className="flex flex-col gap-y-10">
      <BacklogHeader name={name} setName={setName} />

      <div className="flex flex-col gap-y-5">
        {isLoading ? (
          <Skeleton className="h-[252px] w-full rounded-xl" />
        ) : (
          sprints?.map((sprint) => (
            <SprintCard
              key={sprint._id}
              sprint={sprint}
              open={openSprints[sprint._id]}
              setOpen={(open) =>
                setOpenSprints({ ...openSprints, [sprint._id]: open })
              }
            />
          ))
        )}

        <BacklogCard
          projectId={projectId as Id<"projects">}
          sprints={sprints ?? []}
        />
      </div>
    </div>
  );
};

const BacklogHeader = ({
  name,
  setName,
}: {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div className="flex flex-col gap-y-5">
      <h1 className="text-2xl font-semibold">Backlog</h1>

      <div className="relative flex w-[224px] items-center">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Search issues"
        />
        <Search className="absolute right-5 size-3" />
      </div>
    </div>
  );
};

const BacklogCard = ({
  projectId,
  sprints,
}: {
  projectId: Id<"projects">;
  sprints: Doc<"sprints">[];
}) => {
  const [showBacklog, setShowBacklog] = useState(true);
  const [confirm, ConfirmDialog] = useConfirm();

  const { mutate: createSprint } = useMutation({
    mutationFn: useConvexMutation(api.sprints.create),
  });
  const { data: issues, isLoading: issuesLoading } = useQuery(
    convexQuery(api.issues.getAll, {
      projectId: projectId as Id<"projects">,
    }),
  );

  return (
    <>
      <ConfirmDialog
        title={"Create Sprint"}
        description={"Are you sure you want to create a sprint?"}
      />

      <div className="flex flex-col gap-y-1">
        <div className="flex items-center justify-between gap-x-1">
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
          <Button
            variant={"ghost"}
            onClick={async () => {
              const ok = await confirm();
              if (!ok) return;

              createSprint(
                {
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
          (issues?.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-200 p-4">
              <p className="text-center text-xs text-gray-500">
                Your backlog is empty
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {issues
                ?.filter((issue) => !issue.sprintId)
                .map((issue) => (
                  <div
                    key={issue._id}
                    className="flex items-center justify-between border px-10 py-2"
                  >
                    <div className="flex items-center gap-x-2">
                      <p className="text-sm font-medium">{issue.title}</p>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <BacklogDropdown
                        issueId={issue._id}
                        projectId={projectId}
                      />
                    </div>
                  </div>
                ))}
            </div>
          ))}
      </div>
    </>
  );
};

export default BacklogPage;
