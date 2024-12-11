"use client";

import React, { useState } from "react";
import { Expand } from "lucide-react";
import { NotificationDropdown } from "./notification-dropdown";
import { ModeToggle } from "./theme-toggle";
import { ProjectDropdown } from "../projects/_components/project-dropdown";
import { CreateIssueDialog } from "../projects/[projectId]/backlog/_components/sprint-create-issue-dialog";
import { api } from "../../../../convex/_generated/api";

import { Button } from "@/components/ui/button";
import { useAuth, UserButton } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { convexQuery } from "@convex-dev/react-query";

export const Navbar = () => {
  const { isLoaded } = useAuth();
  const { data: projects } = useQuery(
    convexQuery(api.projects.getAllUserProjects, {}),
  );

  const [openCreateIssueDialog, setOpenCreateIssueDialog] = useState(false);

  return (
    <>
      <div className="flex h-[56px] w-full items-center border-b">
        <nav className="mx-auto flex w-11/12 max-w-screen-2xl items-center justify-between">
          <div className="flex items-center gap-x-3">
            <div className="mr-10 flex items-center">
              <Expand className="mr-2 size-6" />
              <h1 className="text-xl font-semibold">Chira</h1>
            </div>
            <ProjectDropdown />
            <Button
              onClick={() => setOpenCreateIssueDialog(true)}
              disabled={projects?.length === 0}
            >
              Create
            </Button>
          </div>

          <div className="flex items-center gap-x-5">
            <ModeToggle />
            <NotificationDropdown />
            {isLoaded ? (
              <UserButton />
            ) : (
              <Skeleton className="size-[28px] rounded-full" />
            )}
          </div>
        </nav>
      </div>

      <CreateIssueDialog
        open={openCreateIssueDialog}
        setOpen={setOpenCreateIssueDialog}
      />
    </>
  );
};
