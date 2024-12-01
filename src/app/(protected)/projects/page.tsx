"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { ProjectMoreActionDropdown } from "./_components/project-more-action-dropdown";
import { api } from "../../../../convex/_generated/api";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { convexQuery } from "@convex-dev/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useProject } from "@/store/use-project";

const ProjectsPage = () => {
  const { data: projects } = useQuery(
    convexQuery(api.projects.getAllWithUser, {}),
  );

  const [_, setProject] = useProject();
  const [name, setName] = useState("");

  const filterProjects = useMemo(() => {
    if (!projects) return [];
    if (name === "") return projects;
    return projects?.filter((project) =>
      project.name.toLowerCase().includes(name.toLowerCase()),
    );
  }, [name, projects]);

  return (
    <div className="flex flex-col gap-y-10">
      <div className="flex flex-col gap-y-5">
        <h1 className="text-2xl font-semibold">Projects</h1>

        <div className="relative flex w-[224px] items-center">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Search projects"
          />
          <Search className="absolute right-5 size-3" />
        </div>
      </div>

      <Table>
        <TableCaption>A list of your recent projects.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Lead</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterProjects?.map((project) => (
            <TableRow key={project._id}>
              <TableCell>
                <Button
                  variant={"link"}
                  className="p-0 text-[#0B66E4]"
                  onClick={() => setProject(project._id)}
                  asChild
                >
                  <Link href={`/projects/${project._id}/board`}>
                    {project.name}
                  </Link>
                </Button>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-x-2">
                  <Avatar className="size-5">
                    <AvatarImage src={project.user.imageUrl} />
                    <AvatarFallback>{project.user.name}</AvatarFallback>
                  </Avatar>
                  <span>{project.user.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <ProjectMoreActionDropdown projectId={project._id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectsPage;
