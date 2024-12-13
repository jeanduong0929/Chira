import React from "react";
import { DisplayIssuePriority } from "./display-issue-priority";
import { DisplayIssueType } from "./display-issue-type";
import { DisplayIssueProgress } from "./display-issue-progress";
import { Doc } from "../../../../convex/_generated/dataModel";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { IssueWithAssignee } from "@/app/(protected)/projects/[projectId]/board/types/issue-with-assignee";
import { TiptapEditor } from "@/app/(protected)/projects/[projectId]/backlog/_components/tiptap-editor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface IssueDetailsProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  issue: IssueWithAssignee;
}

export const IssueDetails = ({ open, setOpen, issue }: IssueDetailsProps) => {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex min-w-[600px] flex-col gap-y-5">
        <SheetHeader>
          <SheetTitle>{issue.title}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-y-10 text-sm">
          <div className="rounded-lg border">
            <p className="border-b p-4 font-medium">Description</p>
            <TiptapEditor
              content={issue.description || ""}
              setContent={() => {}}
              readOnly={true}
            />
          </div>

          <div className="rounded-lg border">
            <div className="p-4">
              <p className="font-medium">Details</p>
            </div>
            <div className="flex flex-col gap-y-5 border-t p-4">
              <div className="flex items-center gap-x-2">
                <p className="w-[200px] font-medium">Issue Type:</p>
                <DisplayIssueType
                  issueType={issue.issueType}
                  className="text-muted-foreground"
                />
              </div>
              <div className="flex items-center gap-x-2">
                <p className="w-[200px] font-medium">Priority:</p>
                <DisplayIssuePriority
                  priority={issue.priority}
                  className="text-muted-foreground"
                />
              </div>
              <div className="flex items-center gap-x-2">
                <p className="w-[200px] font-medium">Assignee:</p>
                <Assignee assignee={issue.assignee} />
              </div>
              <div className="flex items-center gap-x-2">
                <p className="w-[200px] font-medium">Status:</p>
                <DisplayIssueProgress status={issue.status} />
              </div>
              <div className="flex items-center gap-x-2">
                <p className="w-[200px] font-medium">Story Points:</p>
                <div className="flex size-[21px] items-center justify-center rounded-full bg-[#DCE6F4] dark:bg-gray-800">
                  <span className="text-xs font-medium">
                    {issue.storyPoints}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const Assignee = ({
  assignee,
}: {
  assignee:
    | (Doc<"members"> & {
        user: {
          name: string;
          imageUrl: string;
        };
      })
    | null;
}) => {
  if (!assignee) return null;

  return (
    <div className="flex items-center gap-x-2">
      <Avatar className="size-6">
        <AvatarImage src={assignee.user.imageUrl} />
        <AvatarFallback>{assignee.user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <p className="text-muted-foreground">{assignee.user.name}</p>
    </div>
  );
};
