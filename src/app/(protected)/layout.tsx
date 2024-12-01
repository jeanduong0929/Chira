"use client";

import React, { useEffect, useState } from "react";
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

  const { data: project, isLoading: projectLoading } = useQuery(
    convexQuery(api.projects.getByIdWithUser, {
      projectId: projectId as Id<"projects">,
    }),
  );
  const { data: projects, isLoading } = useQuery(
    convexQuery(api.projects.getAllWithUser, {}),
  );
  const { user } = useUser();
  const { mutate: createUser } = useMutation({
    mutationFn: useConvexMutation(api.users.create),
  });

  useEffect(() => {
    if (user) {
      createUser({
        name: (user.fullName as string) ?? "",
        imageUrl: user.imageUrl ?? "",
      });
    }

    // Set the projectId to the first project if it's not set
    if (!projectId && projects && projects.length > 0) {
      setProjectId(projects[0]._id);
    }
  }, [createUser, projectId, projects, setProjectId, user]);

  const handleSidebarClick = (group: string) => {
    setSidebarOpen((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  return (
    <div>
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
          <main className="mx-auto w-11/12 max-w-screen-2xl py-10">
            {children}
          </main>
        </SidebarChildren>
      </SidebarWrapper>
    </div>
  );
};

export default ProtectedLayout;
