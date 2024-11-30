import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { ProjectDialog } from "../projects/_components/project-dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const ProjectDropdown = () => {
  const [openProjectDialog, setOpenProjectDialog] = useState(false);

  return (
    <>
      <ProjectDialog
        open={openProjectDialog}
        onOpenChange={setOpenProjectDialog}
      />

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
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOpenProjectDialog(true)}
          >
            Create project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
