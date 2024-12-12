import React, { useState } from "react";
import { toast } from "sonner";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useProject } from "@/store/use-project";

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProjectDialog = ({ open, onOpenChange }: ProjectDialogProps) => {
  const [projectId, setProjectId] = useProject();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const { data: projects } = useQuery(
    convexQuery(api.projects.getAllUserProjects, {}),
  );
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
            setError("");
            //Validate user input
            if(name.length < 3){
              setError("Project name must be at least 3 characters!");
            }
            else{
              createProject(
                { name },
                {
                  onSuccess: (data) => {
                    if (data) {
                      if (!projects || projects.length === 0) {
                        setProjectId(data);
                      }
                      toast.success("Project created");
                      setName("");
                      onOpenChange(false);
                    }
                  },
                  onError: (error) => {
                    setError("Failed to create project!" + error);
                  },
                },
              );
            }


    
          }}
        >
          {error && <p className="text-red-500 text-sm">{error}</p>}
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
