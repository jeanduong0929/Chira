import { useState } from "react";
import { useDrag } from "react-dnd";
import { Bookmark, CheckIcon, Circle } from "lucide-react";
import { IssueCardDropdown } from "./issue-card-dropdown";
import { IssueWithAssignee } from "../types/issue-with-assignee";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SprintEditIssueDialog } from "../../backlog/_components/sprint-edit-issue-dialog";

export const IssueCard = ({ issue }: { issue: IssueWithAssignee }) => {
  const [open, setOpen] = useState(false);

  const [, drag] = useDrag({
    type: "COLUMN",
    item: { issue, type: "COLUMN" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <>
      <Card
        ref={(node) => {
          drag(node);
        }}
        className="rounded-sm"
      >
        <CardHeader className="pt-3">
          <CardTitle className="flex items-center justify-between">
            <span
              className="cursor-pointer text-sm font-medium hover:text-[#0B66E4]"
              onClick={() => setOpen(true)}
            >
              {issue.title}
            </span>
            <IssueCardDropdown issueId={issue._id} />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between pb-4">
          <IssueType issueType={issue.issueType} />
          <AssigneeAvatar assignee={issue.assignee} />
        </CardContent>
      </Card>

      <SprintEditIssueDialog
        issueId={issue._id}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
};

const IssueType = ({ issueType }: { issueType: "story" | "task" | "bug" }) => {
  if (issueType === "story") {
    return (
      <div className="flex items-center gap-x-3 text-sm">
        <div className="shrink-0 bg-[#64BA3B] p-1">
          <Bookmark className="size-3" fill="#fff" stroke="#fff" />
        </div>
        <span>Story</span>
      </div>
    );
  }

  if (issueType === "task") {
    return (
      <div className="flex items-center gap-x-3 text-sm">
        <div className="shrink-0 bg-[#0B66E4] p-1">
          <CheckIcon className="size-3 text-white" strokeWidth={4} />
        </div>
        <span>Task</span>
      </div>
    );
  }

  if (issueType === "bug") {
    return (
      <div className="flex items-center gap-x-3 text-sm">
        <div className="shrink-0 bg-[#E84C3D] p-1">
          <Circle className="size-3" fill="#fff" stroke="#fff" />
        </div>
        <span>Bug</span>
      </div>
    );
  }

  return null;
};

const AssigneeAvatar = ({
  assignee,
}: {
  assignee: IssueWithAssignee["assignee"];
}) => {
  if (!assignee)
    return (
      <svg
        viewBox="0 0 24 24"
        fill="#525D71"
        height="1em"
        width="1em"
        className="size-6"
      >
        <path d="M12 2C6.579 2 2 6.579 2 12s4.579 10 10 10 10-4.579 10-10S17.421 2 12 2zm0 5c1.727 0 3 1.272 3 3s-1.273 3-3 3c-1.726 0-3-1.272-3-3s1.274-3 3-3zm-5.106 9.772c.897-1.32 2.393-2.2 4.106-2.2h2c1.714 0 3.209.88 4.106 2.2C15.828 18.14 14.015 19 12 19s-3.828-.86-5.106-2.228z" />
      </svg>
    );

  const initials = assignee?.user.name
    .toUpperCase()
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Avatar className="size-6">
      <AvatarImage src={assignee?.user.imageUrl} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};
