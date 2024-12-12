import React from "react";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";

export const IssueCardDropdown = ({ issueId }: { issueId: Id<"issues"> }) => {
  const [confirm, ConfirmDialog] = useConfirm();

  const { mutate: deleteIssue } = useMutation({
    mutationFn: useConvexMutation(api.issues.remove),
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="iconSm">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem>Move to backlog</DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-500 focus:text-red-500"
            onClick={async () => {
              const ok = await confirm();
              if (!ok) return;

              deleteIssue(
                { issueId },
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
