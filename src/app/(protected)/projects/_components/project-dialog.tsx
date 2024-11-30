import React, { useState } from "react";
import { toast } from "sonner";
import { api } from "../../../../../convex/_generated/api";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProjectDialog = ({ open, onOpenChange }: ProjectDialogProps) => {
  const [name, setName] = useState("");

  const { mutate: createProject } = useMutation({
    mutationFn: useConvexMutation(api.projects.create),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
          <DialogDescription>
            Create a new project to get started.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            createProject(
              { name },
              {
                onSuccess: (data) => {
                  if (data) {
                    toast.success("Project created");
                    setName("");
                    onOpenChange(false);
                  }
                },
              },
            );
          }}
        >
          <Input
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Button type="submit" disabled={!name}>
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
