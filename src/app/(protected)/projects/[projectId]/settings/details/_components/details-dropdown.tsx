import React from "react";
import { Ellipsis } from "lucide-react";
import { useParams } from "next/navigation";
import { api } from "../../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../../convex/_generated/dataModel";

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
import { toast } from "sonner";

export const DetailsDropdown = () => {
  const { projectId } = useParams();

  const { mutate: removeProject } = useMutation({
    mutationFn: useConvexMutation(api.projects.remove),
  });

  const [confirm, ConfirmDialog] = useConfirm();

  console.log("projectId", projectId);

  return (
    <>
      <ConfirmDialog
        title={"Delete Project"}
        description={"Are you sure you want to delete this project?"}
        variant={"destructive"}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={async () => {
              const ok = await confirm();
              if (!ok) return;

              removeProject(
                { projectId: projectId as Id<"projects"> },
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
