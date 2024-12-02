import React from "react";
import { toast } from "sonner";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";

interface StartSprintDialogProps {
  sprintId: Id<"sprints">;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const StartSprintDialog = ({
  sprintId,
  open,
  setOpen,
}: StartSprintDialogProps) => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 14),
  });

  const { mutate: startSprint } = useMutation({
    mutationFn: useConvexMutation(api.sprints.startSprint),
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setDate({
            from: new Date(),
            to: addDays(new Date(), 14),
          });
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start sprint</DialogTitle>
          <DialogDescription>
            Start the sprint and add issues to it.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (!date?.from || !date?.to) return;

            startSprint(
              {
                sprintId: sprintId,
                start: date?.from?.toISOString(),
                end: date?.to?.toISOString(),
              },
              {
                onSuccess: (data) => {
                  if (data) {
                    toast.success("Sprint started");
                    setDate({
                      from: new Date(),
                      to: addDays(new Date(), 14),
                    });
                    setOpen(false);
                  }
                },
              },
            );
          }}
          className="flex flex-col gap-y-4"
        >
          <DatePickerWithRange date={date} setDate={setDate} />

          <DialogFooter>
            <Button type="button" variant={"outline"}>
              Cancel
            </Button>
            <Button type="submit" disabled={!date}>
              Start
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
