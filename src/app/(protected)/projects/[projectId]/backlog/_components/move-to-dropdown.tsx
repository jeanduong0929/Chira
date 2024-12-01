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
  sprintId: Id<"sprints">;
  projectId: Id<"projects">;
  issueId: Id<"issues">;
  inSprint: boolean;
}

export const MoveToDropdown = ({
  sprintId,
  projectId,
  issueId,
  inSprint,
}: MoveToDropdownProps) => {
  const [confirm, ConfirmDialog] = useConfirm();
  const [backlogConfirm, BacklogConfirmDialog] = useConfirm();

  const { data: sprints } = useQuery(
    convexQuery(api.sprints.getAll, {
      projectId: projectId,
    }),
  );
  const { mutate: moveToSprint } = useMutation({
    mutationFn: useConvexMutation(api.issues.moveToSprint),
  });
  const { mutate: moveToBacklog } = useMutation({
    mutationFn: useConvexMutation(api.issues.moveToBacklog),
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
          <DropdownMenuLabel>Sprints</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {sprints
            ?.filter((sprint) => sprint._id !== sprintId)
            .map((sprint) => (
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
          {inSprint && (
            <DropdownMenuItem
              onClick={async () => {
                const ok = await backlogConfirm();
                if (!ok) return;

                moveToBacklog(
                  {
                    issueId: issueId,
                  },
                  {
                    onSuccess: (data) => {
                      if (data) {
                        toast.success("Issue moved to backlog");
                      }
                    },
                    onError: (error) => {
                      toast.error(error.message);
                    },
                  },
                );
              }}
            >
              Move to backlog
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        title="Move to sprint"
        description="Are you sure you want to move this issue to the selected sprint?"
      />
      <BacklogConfirmDialog
        title="Move to backlog"
        description="Are you sure you want to move this issue to the backlog?"
      />
    </>
  );
};
