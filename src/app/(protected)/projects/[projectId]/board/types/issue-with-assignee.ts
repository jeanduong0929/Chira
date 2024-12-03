import { Doc } from "../../../../../../../convex/_generated/dataModel";

export type IssueWithAssignee = Doc<"issues"> & {
  assignee:
    | (Doc<"members"> & {
        user: {
          name: string;
          imageUrl: string;
        };
      })
    | null;
};
