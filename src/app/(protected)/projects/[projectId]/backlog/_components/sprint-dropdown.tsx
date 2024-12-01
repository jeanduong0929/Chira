import React from "react";
import { Ellipsis } from "lucide-react";
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

interface SpringDropdownProps {
  sprintId: Id<"sprints">;
}

export const SpringDropdown = ({ sprintId }: SpringDropdownProps) => {
  const [confirm, ConfirmDialog] = useConfirm();

  const { mutate: removeSprint } = useMutation({
    mutationFn: useConvexMutation(api.sprints.remove),
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
          <DropdownMenuItem>Edit sprint</DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              const ok = await confirm();
              if (!ok) return;

              removeSprint({
                sprintId,
              });
            }}
          >
            Delete sprint
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        title={"Delete Sprint"}
        description={"Are you sure you want to delete this sprint?"}
        variant={"destructive"}
      />
    </>
  );
};
