import React, { useEffect, useState } from "react";
import { toast } from "sonner";
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
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Label } from "@/components/ui/label";

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
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 14),
  });

  const { mutate: updateSprint } = useMutation({
    mutationFn: useConvexMutation(api.sprints.update),
  });

  const getSprintDates = (sprint: Doc<"sprints">) => {
    const startDate = sprint.startDate
      ? new Date(sprint.startDate)
      : new Date();
    const endDate = sprint.endDate
      ? new Date(sprint.endDate)
      : addDays(new Date(), 14);

    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      setDate({
        from: startDate,
        to: endDate,
      });
    }
  };

  useEffect(() => {
    if (sprint) {
      setName(sprint.name);
      getSprintDates(sprint);
    }
  }, [sprint]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-y-8">
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
                startDate: date?.from?.toISOString() ?? "",
                endDate: date?.to?.toISOString() ?? "",
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
          <div className="flex flex-col gap-y-2">
            <Label>Sprint name</Label>
            <Input
              className="w-[250px]"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {sprint.status === "active" && (
            <div className="flex flex-col gap-y-2">
              <Label>Sprint dates</Label>
              <DatePickerWithRange date={date} setDate={setDate} />
            </div>
          )}

          <Button type="submit" className="mt-5" disabled={!name}>
            Update
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
