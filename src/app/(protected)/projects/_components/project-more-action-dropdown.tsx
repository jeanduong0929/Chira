import React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Ellipsis } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

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
  projectId: Id<"projects">;
}

export const ProjectMoreActionDropdown = ({
  projectId,
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
          <DropdownMenuItem className="cursor-pointer">
            <Link href={`/projects/${projectId}/settings/details`}>
              Project settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={async () => {
              const ok = await confirm();
              if (!ok) return;

              removeProject(
                {
                  projectId,
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
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
