import React from "react";

export const DisplayIssueProgress = ({
  status,
}: {
  status: "not_started" | "in_progress" | "completed";
}) => {
  if (status === "not_started") {
    return <div className="text-muted-foreground">Not Started</div>;
  }
  if (status === "in_progress") {
    return <div className="text-muted-foreground">In Progress</div>;
  }
  if (status === "completed") {
    return <div className="text-muted-foreground">Completed</div>;
  }
  return null;
};
