"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { DetailsDropdown } from "./_components/details-dropdown";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useQuery, useMutation } from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { AlertTriangle, ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";

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

  if (isLoading)
    return (
      <div className="flex min-h-[calc(100vh-136px)] flex-col items-center justify-center">
        <Loader2 className="size-10 animate-spin" />
      </div>
    );

  if (!project && !isLoading) {
    return (
      <div>
        <Button variant={"ghost"} asChild>
          <Link href="/projects">
            <ChevronLeft />
            Go back
          </Link>
        </Button>
        <div className="flex min-h-[calc(100vh-136px)] flex-col items-center justify-center text-red-500">
          <AlertTriangle className="size-10" />
          <p className="text-lg font-semibold">Project not found.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ConfirmDialog
        title={"Confirm"}
        description={"Are you sure you want to save this project?"}
      />

      <div className="flex flex-col gap-y-32">
        <div className="flex flex-col gap-y-5">
          <Button variant={"ghost"} className="w-fit" asChild>
            <Link href="/projects">
              <ChevronLeft />
              Go back
            </Link>
          </Button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Details</h1>
            <DetailsDropdown />
          </div>
        </div>

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
