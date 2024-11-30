import React from "react";
import { Ellipsis } from "lucide-react";
import { Id } from "../../../../../convex/_generated/dataModel";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProjectMoreActionDropdownProps {
  projectId: Id<"projects">;
}

export const ProjectMoreActionDropdown = ({
  projectId,
}: ProjectMoreActionDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"iconSm"}>
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="cursor-pointer">
          <Link href={`/projects/${projectId}/settings/details`}>
            Project settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          Move to trash
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
