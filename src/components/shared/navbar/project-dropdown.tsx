import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export const ProjectDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-9 items-center rounded-sm px-1 py-2 hover:bg-[#DDDFE5]">
        <span className="text-sm font-medium">Projects</span>
        <ChevronDown className="ml-1 size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[320px]" align="start">
        <DropdownMenuItem>Recent</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>View all projects</DropdownMenuItem>
        <DropdownMenuItem>Create project</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
