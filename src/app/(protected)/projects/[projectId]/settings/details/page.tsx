"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useQuery, useMutation } from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { toast } from "sonner";

const DetailsPage = () => {
  const { projectId } = useParams();
  const { data: project, isLoading } = useQuery(
    convexQuery(api.projects.getByIdWithUser, {
      projectId: projectId as Id<"projects">,
    }),
  );
  const { mutate: updateProject } = useMutation({
    mutationFn: useConvexMutation(api.projects.update),
  });

  const [name, setName] = useState("");
  const [confirm, ConfirmDialog] = useConfirm();

  useEffect(() => {
    if (project) {
      setName(project.name);
    }
  }, [project]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <ConfirmDialog
        title={"Confirm"}
        description={"Are you sure you want to save this project?"}
      />

      <div className="flex flex-col gap-y-10">
        <h1 className="text-2xl font-semibold">Details</h1>

        <form
          className="mx-auto flex w-[353px] flex-col gap-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const ok = await confirm();
            if (!ok) return;

            updateProject(
              {
                projectId: projectId as Id<"projects">,
                name,
              },
              {
                onSuccess: (data) => {
                  if (data) {
                    toast.success("Project updated");
                  }
                },
              },
            );
          }}
        >
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project Name"
          />
          <Button type="submit">Save</Button>
        </form>
      </div>
    </>
  );
};

export default DetailsPage;
