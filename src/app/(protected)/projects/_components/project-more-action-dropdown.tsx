import React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Ellipsis } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { useConfirm } from "@/hooks/use-confirm";

interface ProjectMoreActionDropdownProps {
  project: Doc<"projects"> & {
    member: Doc<"members">;
  };
}

export const ProjectMoreActionDropdown = ({
  project,
}: ProjectMoreActionDropdownProps) => {
  const { mutate: removeProject } = useMutation({
    mutationFn: useConvexMutation(api.projects.softDelete),
  });
  const { mutate: leaveProject } = useMutation({
    mutationFn: useConvexMutation(api.members.remove),
  });

  const [deleteConfirm, DeleteConfirmDialog] = useConfirm();
  const [leaveConfirm, LeaveConfirmDialog] = useConfirm();

  return (
    <>
      <DeleteConfirmDialog
        title={"Delete project"}
        description={"Are you sure you want to delete this project?"}
        variant={"destructive"}
      />
      <LeaveConfirmDialog
        title={"Leave project"}
        description={"Are you sure you want to leave this project?"}
        variant={"destructive"}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"iconSm"}>
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {project.member.role === "admin" && (
            <DropdownMenuItem asChild>
              <Link href={`/projects/${project._id}/settings/details`}>
                Project settings
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link href={`/projects/${project._id}/members`}>Members</Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-yellow-500 focus:text-yellow-500"
            onClick={async () => {
              const ok = await leaveConfirm();
              if (!ok) return;

              leaveProject(
                {
                  memberId: project.member._id,
                },
                {
                  onSuccess: (data) => {
                    if (data) {
                      toast.success("You have left the project");
                    }
                  },
                  onError: (error) => {
                    toast.error("Failed to leave the project");
                  },
                },
              );
            }}
          >
            Leave project
          </DropdownMenuItem>
          {project.member.role === "admin" && (
            <DropdownMenuItem
              className="text-red-500 focus:text-red-500"
              onClick={async () => {
                const ok = await deleteConfirm();
                if (!ok) return;

                removeProject(
                  {
                    projectId: project._id,
                  },
                  {
                    onSuccess: (data) => {
                      if (data) {
                        toast.success("Project deleted");
                      }
                    },
                    onError: (error) => {
                      toast.error("Failed to delete the project");
                    },
                  },
                );
              }}
            >
              Move to trash
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
