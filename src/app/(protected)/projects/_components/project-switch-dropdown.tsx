import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { useProject } from "@/store/use-project";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectSwitchDropdownProps {
  project: Doc<"projects"> & { user: Doc<"users"> };
}

export const ProjectSwitchDropdown = ({
  project,
}: ProjectSwitchDropdownProps) => {
  const { data: projects, isLoading } = useQuery(
    convexQuery(api.projects.getAllUserProjects, {}),
  );

  const [projectId, setProjectId] = useProject();

  const router = useRouter();
  const pathname = usePathname();


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="size-10 shrink-0 bg-[#00A4BF] text-black hover:bg-[#00A4BF]/90"
          size={"icon"}
        >

          { project?.name?.[0]
            .toUpperCase()
            .concat(project?.name?.[0].toUpperCase())}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        <DropdownMenuLabel>Projects</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <>
            <DropdownMenuItem>
              <Skeleton className="h-4 w-24 rounded-lg" />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Skeleton className="h-4 w-24 rounded-lg" />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Skeleton className="h-4 w-24 rounded-lg" />
            </DropdownMenuItem>
          </>
        ) : (
          projects?.map((project) => (
            <DropdownMenuItem
              key={project._id}
              className="flex cursor-pointer items-center gap-x-3"
              onClick={async () => {
                setProjectId(project._id);

                const split = pathname.split("/").slice(1);
                if (split.length > 1) {
                  split[1] = project._id;
                  router.replace(`/${split.join("/")}`);
                }
              }}
            >
              <div className="rounded-md bg-[#00A4BF]/20 px-2 py-1 text-xs font-semibold">
                {
                project.name[1]
                  .toUpperCase()
                  .concat(project.name[1].toUpperCase())}
              </div>
              <span className="text-sm font-medium">{project.name}</span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
