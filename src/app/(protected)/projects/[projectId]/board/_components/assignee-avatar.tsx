import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IssueWithAssignee } from "../types/issue-with-assignee";

export const AssigneeAvatar = ({
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
