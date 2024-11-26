"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ProjectDropdown } from "./project-dropdown";
import { Button } from "../../ui/button";

import { UserButton } from "@clerk/nextjs";

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className="flex h-[56px] w-full items-center justify-between border-b">
      <nav className="mx-auto flex w-11/12 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectDropdown />
          <Button>Create</Button>
        </div>
        <div className="flex items-center">
          <UserButton />
        </div>
      </nav>
    </div>
  );
};
