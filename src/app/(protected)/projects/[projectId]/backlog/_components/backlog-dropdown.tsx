import React, { useState } from "react";
import { Ellipsis } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { useConfirm } from "@/hooks/use-confirm";

export const BacklogDropdown = ({
  issueId,
  projectId,
}: {
  issueId: Id<"issues">;
  projectId: Id<"projects">;
}) => {
  const [open, setOpen] = useState(false);
  const [confirm, ConfirmDialog] = useConfirm();

  const { mutate: removeIssue } = useMutation({
    mutationFn: useConvexMutation(api.issues.remove),
  });
  const { mutate: moveToTop } = useMutation({
    mutationFn: useConvexMutation(api.issues.moveToTop),
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              moveToTop(
                { issueId: issueId, projectId: projectId },
                {
                  onSuccess: (data) => {
                    if (data) {
                      toast.success("Issue moved to top of backlog");
                    }
                  },
                },
              );
            }}
          >
            Top of backlog
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              const ok = await confirm();
              if (!ok) return;

              removeIssue(
                { issueId: issueId },
                {
                  onSuccess: (data) => {
                    if (data) {
                      toast.success("Issue deleted");
                    }
                  },
                },
              );
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        title="Delete issue"
        description="Are you sure you want to delete this issue?"
        variant="destructive"
      />
    </>
  );
};
