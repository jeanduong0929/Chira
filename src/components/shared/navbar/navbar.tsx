"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ProjectDropdown } from "./project-dropdown";
import { Button } from "../../ui/button";

import { UserButton, useUser } from "@clerk/nextjs";
import { SquareChartGantt } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const Navbar = () => {
  const pathname = usePathname();
  const { isLoaded } = useUser();

  return (
    <div className="flex h-[56px] w-full items-center justify-between border-b">
      <nav className="mx-auto flex w-11/12 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-x-2">
          <div className="mr-4 flex items-center">
            <SquareChartGantt className="mr-1 size-5" />
            <h1 className="text-xl font-semibold">Chira</h1>
          </div>
          <ProjectDropdown />
          <Button>Create</Button>
        </div>
        <div className="flex items-center">
          {isLoaded ? (
            <UserButton />
          ) : (
            <Skeleton className="h-[28px] w-[28px] rounded-full" />
          )}
        </div>
      </nav>
    </div>
  );
};
