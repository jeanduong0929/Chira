"use client";

import React, { useState } from "react";
import { api } from "../../../../../../convex/_generated/api";
import { Doc, Id } from "../../../../../../convex/_generated/dataModel";

import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { boardColumns } from "./_constants/board-columns";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const BoardPage = () => {
  const { projectId } = useParams();
  const { data: sprint, isLoading: isLoadingSprint } = useQuery(
    convexQuery(api.sprints.getActiveSprintByProjectId, {
      projectId: projectId as Id<"projects">,
    }),
  );
  const { data: issues, isLoading: isLoadingIssues } = useQuery(
    convexQuery(api.issues.getBySprintId, {
      sprintId: sprint?._id as Id<"sprints">,
    }),
  );

  if (isLoadingSprint || isLoadingIssues)
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

      <UnassignedIssues sprint={sprint ?? null} />
    </div>
  );
};

const UnassignedIssues = ({ sprint }: { sprint: Doc<"sprints"> | null }) => {
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
            <div
              key={value}
              className="h-[320px] w-[270px] rounded-md bg-[#F7F8F9]"
            >
              {!sprint && index === 0 && <GetStartedBacklog />}
            </div>
          ))}
        </div>
      )}
    </div>
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
