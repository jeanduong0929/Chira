import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ConfirmDialogProps = {
  title: string;
  description: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  variant?: "default" | "destructive";
};

export const useConfirm = () => {
  const [state, setState] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () =>
    new Promise<boolean>((resolve, _reject) => setState({ resolve }));

  const handleConfirm = () => {
    state?.resolve(true);
    setState(null);
  };

  const handleCancel = () => {
    state?.resolve(false);
    setState(null);
  };

  const ConfirmDialog = ({
    title,
    description,
    confirmButtonText = "Confirm",
    cancelButtonText = "Cancel",
    variant = "default",
  }: ConfirmDialogProps) => (
    <Dialog open={!!state}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant={"outline"} onClick={handleCancel}>
            {cancelButtonText}
          </Button>
          <Button variant={variant} onClick={handleConfirm}>
            {confirmButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [confirm, ConfirmDialog] as const;
};
