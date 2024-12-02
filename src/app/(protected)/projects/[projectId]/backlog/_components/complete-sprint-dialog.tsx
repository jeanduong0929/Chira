import React, { useState } from "react";
import { toast } from "sonner";
import { Doc } from "../../../../../../../convex/_generated/dataModel";
import { api } from "../../../../../../../convex/_generated/api";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { useRandomName } from "@/hooks/use-generate-name";

interface CompleteSprintDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  sprint: Doc<"sprints"> & { issues: Doc<"issues">[] };
}

export const CompleteSprintDialog = ({
  sprint,
  open,
  setOpen,
}: CompleteSprintDialogProps) => {
  const [moveTo, setMoveTo] = useState<"backlog" | "new_sprint">("backlog");

  const completedIssues = sprint.issues.filter(
    (issue) => issue.status === "completed",
  );
  const openIssues = sprint.issues.filter(
    (issue) => issue.status !== "completed",
  );

  const { mutate: completeSprint } = useMutation({
    mutationFn: useConvexMutation(api.sprints.completeSprint),
  });

  const randomName = useRandomName();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete {sprint.name}</DialogTitle>
          <DialogDescription>
            Complete the sprint and move the issues to the backlog or new
            sprint.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            completeSprint(
              {
                name: randomName,
                sprintId: sprint._id,
                openIssues: moveTo,
                issuesIds: openIssues.map((issue) => issue._id),
              },
              {
                onSuccess: (data) => {
                  if (data) {
                    toast.success("Sprint completed");
                    setMoveTo("backlog");
                    setOpen(false);
                  }
                },
              },
            );
          }}
        >
          <div className="flex flex-col gap-y-2 text-sm">
            <p>This sprint contains:</p>
            <li className="flex items-center gap-x-2">
              <span className="h-4 w-4 rounded-full bg-green-500" />
              Completed issues: {completedIssues.length}
            </li>
            <li className="flex items-center gap-x-2">
              <span className="h-4 w-4 rounded-full bg-yellow-500" />
              Open issues: {openIssues.length}
            </li>
          </div>

          <div className="flex flex-col gap-y-2">
            <Label>Move open issues to</Label>
            <MoveToSelect value={moveTo} setValue={setMoveTo} />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant={"outline"}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Complete sprint</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const MoveToSelect = ({
  value,
  setValue,
}: {
  value: "backlog" | "new_sprint";
  setValue: (value: "backlog" | "new_sprint") => void;
}) => {
  return (
    <Select
      defaultValue={value}
      onValueChange={(value) => setValue(value as "backlog" | "new_sprint")}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="New sprint" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="backlog">Backlog</SelectItem>
        <SelectItem value="new_sprint">New sprint</SelectItem>
      </SelectContent>
    </Select>
  );
};
