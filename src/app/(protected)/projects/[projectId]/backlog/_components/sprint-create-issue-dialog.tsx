import React, { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { Bookmark, Check, CheckCheck, CheckIcon, Circle } from "lucide-react";
import { TiptapEditor } from "./tiptap-editor";
import { AssigneeCombobox } from "./assignee-combobox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [projectId, setProjectId] = useProject();
  const [issueType, setIssueType] = useState<"story" | "bug" | "task">("story");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [storyPoints, setStoryPoints] = useState<string>("");
  const [assignee, setAssignee] = useState<Omit<
    Doc<"users">,
    "_creationTime"
  > | null>(null);

  const { data: user } = useQuery(convexQuery(api.users.getAuth, {}));
  const { data: members } = useQuery(
    convexQuery(api.members.getMembers, {
      projectId: projectId as Id<"projects">,
    }),
  );
  const { mutate: createIssue } = useMutation({
    mutationFn: useConvexMutation(api.issues.create),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createIssue(
      {
        title: summary,
        description: description,
        storyPoints: parseInt(storyPoints) ?? undefined,
        issueType: issueType,
        assigneeId: assignee?.clerkId,
        projectId: projectId as Id<"projects">,
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
          }
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
                  setStoryPoints(value.toString());
                }
              }}
            />
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
                  clerkId: user?.clerkId as string,
                });
              }}
            >
              Assign to me
            </Button>
          </div>

          <DialogFooter className="mt-5">
            <Button
              type="submit"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button disabled={!summary}>Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const IssueTypeSelect = ({
  setIssueType,
}: {
  setIssueType: Dispatch<SetStateAction<"story" | "bug" | "task">>;
}) => {
  return (
    <Select
      defaultValue="story"
      onValueChange={(value) => {
        setIssueType(value as "story" | "bug" | "task");
      }}
    >
      <SelectTrigger className="w-[350px]">
        <SelectValue placeholder="Bug" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="story" value="story">
          <div className="flex items-center gap-x-3">
            <div className="shrink-0 bg-[#64BA3B] p-1">
              <Bookmark className="size-3" fill="#fff" stroke="#fff" />
            </div>
            <span>Story</span>
          </div>
        </SelectItem>
        <SelectItem key="task" value="task">
          <div className="flex items-center gap-x-3">
            <div className="shrink-0 bg-[#0B66E4] p-1">
              <CheckIcon className="size-3 text-white" strokeWidth={4} />
            </div>
            <span>Task</span>
          </div>
        </SelectItem>
        <SelectItem key="bug" value="bug">
          <div className="flex items-center gap-x-3">
            <div className="shrink-0 bg-[#E84C3D] p-1">
              <Circle className="size-3" fill="#fff" stroke="#fff" />
            </div>
            <span>Bug</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
