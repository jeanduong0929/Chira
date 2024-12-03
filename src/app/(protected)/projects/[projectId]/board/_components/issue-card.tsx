import { useDrag } from "react-dnd";
import { Doc } from "../../../../../../../convex/_generated/dataModel";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const IssueCard = ({ issue }: { issue: Doc<"issues"> }) => {
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
            <span className="text-sm font-medium">{issue.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <p>Card Content</p>
        </CardContent>
      </Card>
    </>
  );
};
