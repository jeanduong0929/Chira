import React, { useEffect, useState } from "react";
import { api } from "../../../../../../../convex/_generated/api";
import { Doc } from "../../../../../../../convex/_generated/dataModel";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface SprintEditDialogProps {
  sprint: Doc<"sprints">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SprintEditDialog = ({
  sprint,
  open,
  onOpenChange,
}: SprintEditDialogProps) => {
  const [name, setName] = useState(sprint.name);

  const { mutate: updateSprint } = useMutation({
    mutationFn: useConvexMutation(api.sprints.update),
  });

  useEffect(() => {
    setName(sprint.name);
  }, [sprint]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit sprint: {name}</DialogTitle>
          <DialogDescription>Update the name of the sprint.</DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-y-5"
          onSubmit={(e) => {
            e.preventDefault();

            updateSprint(
              {
                sprintId: sprint._id,
                name,
              },
              {
                onSuccess: (data) => {
                  if (data) {
                    toast.success("Sprint updated");
                    setName("");
                    onOpenChange(false);
                  }
                },
              },
            );
          }}
        >
          <Input
            className="w-[250px]"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button type="submit" disabled={!name}>
            Update
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
