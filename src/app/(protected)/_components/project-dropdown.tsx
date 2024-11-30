import React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const ProjectDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"}>
          Projects
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[320px]" align="start">
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href="/projects">View all projects</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          Create project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
