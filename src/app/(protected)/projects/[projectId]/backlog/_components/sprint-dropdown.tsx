import React, { useState } from "react";
import { toast } from "sonner";
import { Ellipsis } from "lucide-react";
import { SprintEditDialog } from "./sprint-edit-dialog";
import { api } from "../../../../../../../convex/_generated/api";
import { Doc } from "../../../../../../../convex/_generated/dataModel";

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

interface SprintDropdownProps {
  sprint: Doc<"sprints">;
}

export const SprintDropdown = ({ sprint }: SprintDropdownProps) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [confirm, ConfirmDialog] = useConfirm();
  const [statusConfirm, StatusConfirmDialog] = useConfirm();

  const { mutate: removeSprint } = useMutation({
    mutationFn: useConvexMutation(api.sprints.remove),
  });
  const { mutate: notStarted } = useMutation({
    mutationFn: useConvexMutation(api.sprints.notStarted),
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size={"icon"} className="hover:bg-[#D5D9E0]">
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            Edit sprint
          </DropdownMenuItem>
          {sprint.status === "active" && (
            <DropdownMenuItem
              onClick={async () => {
                const ok = await statusConfirm();
                if (!ok) return;

                notStarted(
                  {
                    sprintId: sprint._id,
                  },
                  {
                    onSuccess: (data) => {
                      if (data) {
                        toast.success("Sprint status changed to not started");
                      }
                    },
                  },
                );
              }}
            >
              Not started
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={async () => {
              const ok = await confirm();
              if (!ok) return;

              removeSprint(
                {
                  sprintId: sprint._id,
                },
                {
                  onSuccess: (data) => {
                    if (data) {
                      toast.success("Sprint deleted");
                    }
                  },
                },
              );
            }}
          >
            Delete sprint
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SprintEditDialog
        sprint={sprint}
        open={openEdit}
        onOpenChange={setOpenEdit}
      />
      <ConfirmDialog
        title={"Delete Sprint"}
        description={"Are you sure you want to delete this sprint?"}
        variant={"destructive"}
      />
      <StatusConfirmDialog
        title={"Change sprint status"}
        description={
          "Are you sure you want to change the status of this sprint?"
        }
        variant={"destructive"}
      />
    </>
  );
};
