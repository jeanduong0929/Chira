"use client";

import React from "react";
import { ProjectDropdown } from "./project-dropdown";

import { Button } from "@/components/ui/button";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";

export const Navbar = () => {
  const { isLoaded } = useAuth();

  return (
    <div className="h-[56px] w-full flex items-center border-b">
      <nav className="max-w-screen-2xl w-11/12 mx-auto flex items-center justify-between">
        <div>
          <ProjectDropdown />
          <Button>Create</Button>
        </div>

        {isLoaded ? (
          <UserButton />
        ) : (
          <Skeleton className="size-[28px] rounded-full" />
        )}
      </nav>
    </div>
  );
};
