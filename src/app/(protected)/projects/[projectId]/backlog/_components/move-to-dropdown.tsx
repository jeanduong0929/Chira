import React from "react";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";

interface MoveToDropdownProps {
  projectId: Id<"projects">;
  issueId: Id<"issues">;
}

export const MoveToDropdown = ({ projectId, issueId }: MoveToDropdownProps) => {
  const [confirm, ConfirmDialog] = useConfirm();

  const { data: sprints } = useQuery(
    convexQuery(api.sprints.getAll, {
      projectId: projectId,
    }),
  );
  const { mutate: moveToSprint } = useMutation({
    mutationFn: useConvexMutation(api.issues.moveToSprint),
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className="text-sm font-medium">
            Move to
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]">
          <DropdownMenuLabel>Recent sprints</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {sprints?.map((sprint) => (
            <DropdownMenuItem
              key={sprint._id}
              onClick={async () => {
                const ok = await confirm();
                if (!ok) return;

                moveToSprint(
                  {
                    issueId: issueId,
                    sprintId: sprint._id,
                  },
                  {
                    onSuccess: (data) => {
                      if (data) {
                        toast.success("Issue moved to sprint");
                      }
                    },
                  },
                );
              }}
            >
              {sprint.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        title="Move to sprint"
        description="Are you sure you want to move this issue to the selected sprint?"
      />
    </>
  );
};
