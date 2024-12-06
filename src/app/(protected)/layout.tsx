"use client";

import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useRouter } from "next/navigation";
import { Navbar } from "./_components/navbar";
import {
  Sidebar,
  SidebarChildren,
  SidebarContent,
  SidebarGroup,
  SidebarGroupItem,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarTrigger,
  SidebarWrapper,
} from "./_components/sidebar";
import { getSidebarItems } from "./_constants/sidebar-items";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { useProject } from "@/store/use-project";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  const router = useRouter();

  const [projectId, setProjectId] = useProject();
  const [sidebarOpen, setSidebarOpen] = useState<Record<string, boolean>>(
    () => {
      const initialState: Record<string, boolean> = {};
      for (const group of getSidebarItems()) {
        initialState[group.label] = true;
      }
      return initialState;
    },
  );

  const { data: project } = useQuery(
    convexQuery(api.projects.getByIdWithUser, {
      projectId: projectId as Id<"projects">,
    }),
  );
  const { data: projects, isLoading: projectsLoading } = useQuery(
    convexQuery(api.projects.getAllUserProjects, {}),
  );
  const { data: projectById } = useQuery(
    convexQuery(api.projects.getById, {
      projectId: projectId as Id<"projects">,
    }),
  );
  const { user } = useUser();
  const { mutate: createUser } = useMutation({
    mutationFn: useConvexMutation(api.users.create),
  });

  useEffect(() => {
    if (user) {
      createUser({
        name: (user.fullName as string) ?? "",
        email: user.emailAddresses[0].emailAddress,
        imageUrl: user.imageUrl ?? "",
      });
    }

    // Set the projectId to the first project if it's not set
    if (!projectId && projects && projects.length > 0) {
      setProjectId(projects[0]._id);
      // If the project gets deleted, set the projectId to the first project
    } else if (projects && projects.length > 0 && !projectById) {
      setProjectId(projects[0]._id);
    }
  }, [createUser, projectById, projectId, projects, setProjectId, user]);

  const handleSidebarClick = (group: string) => {
    setSidebarOpen((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  useEffect(() => {
    if (projectsLoading) return;
    if (projects && projects.length === 0) {
      router.replace("/projects");
    }
  }, [projects, projectsLoading, router]);

  return (
    <div className="flex h-screen flex-col">
      <Navbar />

      <SidebarWrapper>
        <Sidebar>
          <SidebarHeader />
          <SidebarTrigger />
          <SidebarContent>
            {getSidebarItems(project?._id).map((group) => (
              <SidebarGroup key={group.label}>
                <SidebarGroupLabel
                  open={sidebarOpen[group.label]}
                  setOpen={() => handleSidebarClick(group.label)}
                >
                  {group.label}
                </SidebarGroupLabel>
                {group.items.map((item) => (
                  <SidebarGroupItem
                    open={sidebarOpen[group.label]}
                    key={item.label}
                    disabled={projects?.length === 0}
                    {...item}
                  />
                ))}
              </SidebarGroup>
            ))}
          </SidebarContent>
        </Sidebar>

        <SidebarChildren>
          <DndProvider backend={HTML5Backend}>
            <main className="mx-auto h-full w-11/12 max-w-screen-2xl py-10">
              {children}
            </main>
          </DndProvider>
        </SidebarChildren>
      </SidebarWrapper>
    </div>
  );
};

export default ProtectedLayout;
