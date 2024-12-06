import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import { TiptapEditor } from "./tiptap-editor";
import { AssigneeCombobox } from "./assignee-combobox";
import { IssueTypeSelect } from "./issue-type-select";
import { PrioritySelect } from "./priority-select";
import { api } from "../../../../../../../convex/_generated/api";
import { Doc, Id } from "../../../../../../../convex/_generated/dataModel";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useProject } from "@/store/use-project";

interface SprintEditIssueDialogProps {
  issueId: Id<"issues">;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const SprintEditIssueDialog = ({
  issueId,
  open,
  setOpen,
}: SprintEditIssueDialogProps) => {
  const [projectId, setProjectId] = useProject();
  const [issueType, setIssueType] = useState<"story" | "bug" | "task">("story");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [storyPoints, setStoryPoints] = useState<string>("");
  const [assignee, setAssignee] = useState<Omit<
    Doc<"users">,
    "_creationTime"
  > | null>(null);
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");

  const { data: user } = useQuery(convexQuery(api.users.getAuth, {}));
  const { data: members } = useQuery(
    convexQuery(api.members.getMembers, {
      projectId: projectId as Id<"projects">,
    }),
  );
  const { data: issue } = useQuery(
    convexQuery(api.issues.getById, {
      issueId: issueId,
    }),
  );
  const { mutate: updateIssue } = useMutation({
    mutationFn: useConvexMutation(api.issues.update),
  });

  useEffect(() => {
    if (issue) {
      setSummary(issue.title);
      setDescription(issue.description ?? "");
      setStoryPoints(issue.storyPoints?.toString() ?? "");
      setAssignee(issue.assignee);
      setIssueType(issue.issueType);
      setPriority(issue.priority);
    }
  }, [issue]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateIssue(
      {
        issueId: issueId,
        title: summary,
        description: description,
        storyPoints: storyPoints,
        issueType: issueType,
        priority: priority,
        assigneeId: assignee?.clerkId,
        projectId: projectId as Id<"projects">,
        sprintId: issue?.sprintId as Id<"sprints">,
      },
      {
        onSuccess: (data) => {
          if (data) {
            toast.success("Issue updated");
            setSummary("");
            setDescription("");
            setAssignee(null);
            setStoryPoints("");
            setPriority("low");
            setOpen(false);
          }
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Issue</DialogTitle>
          <DialogDescription>Edit the issue.</DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-y-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-y-1">
            <Label className="text-sm font-medium">Issue Type</Label>
            <IssueTypeSelect
              issueType={issueType}
              setIssueType={setIssueType}
            />
          </div>

          <Separator className="" />

          <div className="flex flex-col gap-y-1">
            <Label className="text-sm font-medium">
              Summary
              <span className="ml-1 text-red-500">*</span>
            </Label>
            <Input
              placeholder="Summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <Label className="text-sm font-medium">Description</Label>
            <TiptapEditor content={description} setContent={setDescription} />
          </div>
          <div className="flex flex-col gap-y-1">
            <Label className="text-sm font-medium">Story Points</Label>
            <Input
              placeholder="Story Points"
              value={storyPoints}
              onChange={(e) => {
                if (e.target.value === "") {
                  setStoryPoints("");
                  return;
                }
                const value = parseInt(e.target.value);
                if (value > 0) {
                  setStoryPoints(e.target.value);
                }
              }}
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <Label className="text-sm font-medium">Priority</Label>
            <PrioritySelect priority={priority} setPriority={setPriority} />
          </div>
          <div className="flex flex-col gap-y-1">
            <Label className="text-sm font-medium">Assignee</Label>
            <AssigneeCombobox
              members={members ?? []}
              value={assignee}
              setValue={setAssignee}
            />
            <Button
              type="button"
              variant="link"
              className="w-fit px-0 text-[#0B66E4]"
              onClick={() => {
                setAssignee({
                  _id: user?._id as Id<"users">,
                  imageUrl: user?.imageUrl,
                  name: user?.name as string,
                  email: user?.email as string,
                  clerkId: user?.clerkId as string,
                });
              }}
            >
              Assign to me
            </Button>
          </div>

          <DialogFooter className="mt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!summary}>
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
