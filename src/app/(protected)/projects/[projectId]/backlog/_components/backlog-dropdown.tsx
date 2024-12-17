import React, { useState } from "react";
import { Ellipsis } from "lucide-react";
import { toast } from "sonner";
import { SprintEditIssueDialog } from "./sprint-edit-issue-dialog";
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
import { CloneIssueDialog } from "@/features/issues/components/clone-issue-dialog";

export const BacklogDropdown = ({
  issueId,
  projectId,
  inSprint,
}: {
  issueId: Id<"issues">;
  projectId: Id<"projects">;
  inSprint: boolean;
}) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [deleteConfirm, DeleteConfirmDialog] = useConfirm();
  const [cloneConfirm, CloneConfirmDialog] = useConfirm();
  const [cloneIssueDialog, setCloneIssueDialog] = useState(false);

  const { mutate: removeIssue } = useMutation({
    mutationFn: useConvexMutation(api.issues.remove),
  });
  const { mutate: moveToTop } = useMutation({
    mutationFn: useConvexMutation(api.issues.moveToTop),
  });
  const { mutate: cloneIssue } = useMutation({
    mutationFn: useConvexMutation(api.issues.clone),
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
          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            Edit
          </DropdownMenuItem>
          {!inSprint && (
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
          )}
          <DropdownMenuItem onClick={() => setCloneIssueDialog(true)}>
            Clone
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-500 focus:text-red-500"
            onClick={async () => {
              const ok = await deleteConfirm();
              if (!ok) return;

              removeIssue(
                { issueId: issueId },
                {
                  onSuccess: (data) => {
                    if (data) {
                      toast.success("Issue deleted");
                    }
                  },
                  onError: (error) => {
                    toast.error("Failed to delete issue");
                  },
                },
              );
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmDialog
        title="Delete issue"
        description="Are you sure you want to delete this issue?"
        variant="destructive"
      />
      <SprintEditIssueDialog
        open={openEdit}
        setOpen={setOpenEdit}
        issueId={issueId}
      />
      <CloneIssueDialog
        issueId={issueId}
        open={cloneIssueDialog}
        setOpen={setCloneIssueDialog}
      />
      {/* <CloneConfirmDialog
        title="Clone issue"
        description="Are you sure you want to clone this issue?"
      /> */}
    </>
  );
};
