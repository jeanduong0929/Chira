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
  const { data: projects } = useQuery(
    convexQuery(api.projects.getAllUserProjects, {}),
  );
  const { user } = useUser();
  const { mutate: createUser } = useMutation({
    mutationFn: useConvexMutation(api.users.create),
  });

  /**
   * useEffect hook to handle project loading and redirection.
   *
   * This effect runs whenever `projects`, `router`, `projectId`, or `setProjectId` changes.
   *
   * - If `projects` is null or undefined, the effect returns early.
   * - If `projects` is an empty array, the user is redirected to the "/projects" page.
   * - If `projectId` is not set, it sets the `projectId` to the first project's ID.
   *
   * @param {Array} projects - The list of projects.
   * @param {object} router - The router object for navigation.
   * @param {string} projectId - The current project ID.
   * @param {function} setProjectId - Function to set the current project ID.
   */
  useEffect(() => {
    if (projects === null || projects === undefined) return;

    if (projects.length === 0) {
      router.replace("/projects");
      return;
    }

    if (!projectId) {
      setProjectId(projects[0]._id);
    }
  }, [projects, router, projectId, setProjectId]);

  /**
   * Effect that creates a user in the system when the user object is available.
   * This effect runs whenever the `user` or `createUser` dependencies change.
   *
   * It checks if the `user` object is defined, and if so, it calls the `createUser`
   * mutation function with the user's details, including:
   * - `name`: The full name of the user, defaulting to an empty string if not available.
   * - `email`: The email address of the user, taken from the first email address in the user's emailAddresses array.
   * - `imageUrl`: The URL of the user's profile image, defaulting to an empty string if not available.
   */
  useEffect(() => {
    if (user) {
      createUser({
        name: (user.fullName as string) ?? "",
        email: user.emailAddresses[0].emailAddress,
        imageUrl: user.imageUrl ?? "",
      });
    }
  }, [user, createUser]);

  /**
   * Effect that manages the currently selected project based on the list of available projects.
   *
   * This effect runs whenever the `projects`, `projectId`, `project`, or `setProjectId` dependencies change.
   *
   * It performs the following checks:
   * - If there are no projects available, the effect exits early.
   * - If no project is currently selected (`projectId` is falsy), it sets the initial project to the first project in the list.
   * - If the current project has been deleted (i.e., it is not found in the list of projects) and we are not in the middle of a project switch, it resets the selected project to the first project in the list.
   */
  useEffect(() => {
    if (!projects || projects.length === 0) return;

    // Only set initial project if none selected
    if (!projectId) {
      setProjectId(projects[0]._id);
      return;
    }

    // Only reset to first project if current project was deleted
    // AND we're not in the middle of a project switch
    if (!project && projectId && !projects.some((p) => p._id === projectId)) {
      setProjectId(projects[0]._id);
      return;
    }
  }, [projects, projectId, project, setProjectId]);

  /**
   * Toggles the open state of a sidebar group.
   *
   * This function updates the sidebar's open state by flipping the current
   * value of the specified group. It uses the previous state to ensure that
   * the update is based on the most recent state.
   *
   * @param {string} group - The label of the sidebar group to toggle.
   */
  const handleSidebarClick = (group: string) => {
    setSidebarOpen((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

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
            <main className="mx-auto h-full w-11/12 max-w-screen-2xl py-10 dark:bg-background">
              {children}
            </main>
          </DndProvider>
        </SidebarChildren>
      </SidebarWrapper>
    </div>
  );
};

export default ProtectedLayout;
