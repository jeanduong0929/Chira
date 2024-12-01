"use client";

import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Id } from "../../convex/_generated/dataModel";

const projectAtom = atomWithStorage<Id<"projects"> | null>("project", null);

export const useProject = () => {
  return useAtom(projectAtom);
};
