import React, { Dispatch, SetStateAction, useState } from "react";
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

interface CreateIssueDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const CreateIssueDialog = ({
  open,
  setOpen,
}: CreateIssueDialogProps) => {
  const [projectId] = useProject();
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
  const { mutate: createIssue } = useMutation({
    mutationFn: useConvexMutation(api.issues.create),
  });

  /**
   * Handles the submission of the create issue form.
   *
   * This function is triggered when the form is submitted. It prevents the default
   * form submission behavior and calls the `createIssue` mutation with the provided
   * issue details. On successful creation of the issue, it resets the form fields
   * and closes the dialog.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form event triggered by the submission.
   *
   * @returns {void} This function does not return a value.
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createIssue(
      {
        title: summary,
        description: description,
        storyPoints: storyPoints,
        issueType: issueType,
        assigneeId: assignee?.clerkId,
        projectId: projectId as Id<"projects">,
        priority: priority,
      },
      {
        onSuccess: (data) => {
          if (data) {
            toast.success("Issue created");
            setSummary("");
            setDescription("");
            setAssignee(null);
            setStoryPoints("");
            setOpen(false);
            setPriority("low");
          }
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        // reset the editor content when the dialog is closed
        if (!open) {
          setDescription("");
          setSummary("");
          setStoryPoints("");
          setAssignee(null);
          setPriority("low");
        }
        setOpen(open);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Issue</DialogTitle>
          <DialogDescription>
            Create a new issue for this sprint.
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-y-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-y-1">
            <Label className="text-sm font-medium">Issue Type</Label>
            <IssueTypeSelect setIssueType={setIssueType} />
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
            <PrioritySelect setPriority={setPriority} />
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
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
