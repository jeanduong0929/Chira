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
import { useQuery, useMutation } from "@tanstack/react-query";
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
    mutationFn: useConvexMutation(api.projects.remove),
  });

  const [confirm, ConfirmDialog] = useConfirm();

  return (
    <>
      <ConfirmDialog
        title={"Delete project"}
        description={"Are you sure you want to delete this project?"}
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
          {project.member.role === "admin" && (
            <DropdownMenuItem
              onClick={async () => {
                const ok = await confirm();
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
