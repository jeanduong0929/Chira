"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useParams } from "next/navigation";
import { useDrop } from "react-dnd";
import { useDrag } from "react-dnd";
import { boardColumns } from "./_constants/board-columns";
import { api } from "../../../../../../convex/_generated/api";
import { Doc, Id } from "../../../../../../convex/_generated/dataModel";

import { useQuery } from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const BoardPage = () => {
  const [issues, setIssues] = useState<Doc<"issues">[]>([]);

  const { projectId } = useParams();
  const { data: sprint, isLoading: isLoadingSprint } = useQuery(
    convexQuery(api.sprints.getActiveSprintByProjectId, {
      projectId: projectId as Id<"projects">,
    }),
  );
  const { data: issuez, isLoading: isLoadingIssues } = useQuery(
    convexQuery(api.issues.getBySprintId, {
      sprintId: sprint?._id as Id<"sprints">,
    }),
  );

  useEffect(() => {
    if (issuez) {
      setIssues(issuez);
    }
  }, [issuez]);

  if (isLoadingSprint)
    return (
      <div className="flex gap-x-5">
        {Object.entries(boardColumns).map(([key, _value]) => (
          <div key={key} className="w-[270px]">
            <Skeleton className="h-[56px] rounded-md bg-[#F7F8F9] p-4 text-muted-foreground" />
          </div>
        ))}
      </div>
    );

  return (
    <div className="flex flex-col gap-y-5">
      <div className="flex gap-x-5">
        {boardColumns.map(({ label, value }, index) => (
          <div key={value} className="w-[270px]">
            <h3 className="rounded-md bg-[#F7F8F9] p-4 text-muted-foreground">
              {label}
            </h3>
          </div>
        ))}
      </div>

      <UnassignedIssues
        sprint={sprint ?? null}
        issues={issues ?? []}
        setIssues={setIssues}
      />
    </div>
  );
};

const UnassignedIssues = ({
  sprint,
  issues,
  setIssues,
}: {
  sprint: Doc<"sprints"> | null;
  issues: Doc<"issues">[];
  setIssues: Dispatch<SetStateAction<Doc<"issues">[]>>;
}) => {
  const [showUnassigned, setShowUnassigned] = useState(true);

  console.log(issues);

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
              value={value as "not_started" | "in_progress" | "completed"}
              issues={issues}
              setIssues={setIssues}
            >
              {!sprint && index === 0 && <GetStartedBacklog />}

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

const Column = ({
  value,
  children,
  issues,
  setIssues,
}: {
  value: "not_started" | "in_progress" | "completed";
  children: React.ReactNode;
  issues: Doc<"issues">[];
  setIssues: Dispatch<SetStateAction<Doc<"issues">[]>>;
}) => {
  const { mutate: updateStatus } = useMutation({
    mutationFn: useConvexMutation(api.issues.updateStatus),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "COLUMN",
    drop: (draggedItem: { issue: Doc<"issues">; type: string }) => {
      if (draggedItem.type === "COLUMN" && draggedItem.issue.status !== value) {
        setIssues((prev) =>
          prev.map((i) => {
            if (i._id === draggedItem.issue._id) {
              return { ...i, status: value };
            }
            return i;
          }),
        );

        updateStatus({
          issue: { id: draggedItem.issue._id, status: value },
        });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={(node) => {
        if (node) drop(node);
      }}
      className="relative h-[320px] w-[270px] rounded-md bg-[#F7F8F9]"
    >
      {isOver && (
        <div className="absolute left-0 top-0 flex w-full items-center">
          <div className="size-2 rounded-full border-2 border-blue-500" />
          <div className="h-[2px] w-full bg-blue-500" />
        </div>
      )}
      {children}
    </div>
  );
};

const IssueCard = ({ issue }: { issue: Doc<"issues"> }) => {
  const [, drag] = useDrag({
    type: "COLUMN",
    item: { issue, type: "COLUMN" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <>
      <Card
        ref={(node) => {
          drag(node);
        }}
        className="rounded-sm"
      >
        <CardHeader className="pt-3">
          <CardTitle className="flex items-center justify-between">
            <span className="text-sm font-medium">{issue.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <p>Card Content</p>
        </CardContent>
      </Card>
    </>
  );
};

const GetStartedBacklog = () => {
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

export default BoardPage;
