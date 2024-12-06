import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { IssueWithAssignee } from "../types/issue-with-assignee";

export const IssueCardSheet = ({
  issue,
  isSheetOpen,
  setIsSheetOpen,
}: {
  issue: IssueWithAssignee;
  isSheetOpen: boolean;
  setIsSheetOpen: (open: boolean) => void;
}) => {
  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{issue.title}</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
