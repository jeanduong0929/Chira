"use client";

import { useParams } from "next/navigation";
import { Id } from "../../../../convex/_generated/dataModel";

export const useProjectId = () => {
  const params = useParams();
  return params.projectId as Id<"projects">;
};
