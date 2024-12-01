import React, { Dispatch, SetStateAction, useState } from "react";
import { Bookmark } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { TiptapEditor } from "./tiptap-editor";

interface CreateIssueDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const CreateIssueDialog = ({
  open,
  setOpen,
}: CreateIssueDialogProps) => {
  const [issueType, setIssueType] = useState<"story" | "bug" | "task">("story");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Issue</DialogTitle>
          <DialogDescription>
            Create a new issue for this sprint.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-y-5">
          <div className="flex flex-col gap-y-1">
            <Label className="text-sm font-medium">Issue Type</Label>
            <IssueTypeSelect setIssueType={setIssueType} />
          </div>

          <Separator className="" />

          <div className="flex flex-col gap-y-1">
            <Label className="text-sm font-medium">Summary</Label>
            <Input placeholder="Summary" />
          </div>
          <div className="flex flex-col gap-y-1">
            <Label className="text-sm font-medium">Description</Label>
            <TiptapEditor />
          </div>
        </div>
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
          <div className="flex items-center gap-x-2">
            <div className="shrink-0 bg-[#64BA3B] p-1">
              <Bookmark className="size-3" fill="#fff" stroke="#fff" />
            </div>
            <span>Story</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
