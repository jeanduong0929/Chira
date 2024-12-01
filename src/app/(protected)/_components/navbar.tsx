"use client";

import React, { useState } from "react";
import { Expand } from "lucide-react";
import { ProjectDropdown } from "../projects/_components/project-dropdown";
import { CreateIssueDialog } from "../projects/[projectId]/backlog/_components/sprint-create-issue-dialog";

import { Button } from "@/components/ui/button";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import { useProject } from "@/store/use-project";

export const Navbar = () => {
  const { isLoaded } = useAuth();

  const [projectId, _] = useProject();
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
              disabled={!projectId}
            >
              Create
            </Button>
          </div>

          {isLoaded ? (
            <UserButton />
          ) : (
            <Skeleton className="size-[28px] rounded-full" />
          )}
        </nav>
      </div>

      <CreateIssueDialog
        open={openCreateIssueDialog}
        setOpen={setOpenCreateIssueDialog}
      />
    </>
  );
};
