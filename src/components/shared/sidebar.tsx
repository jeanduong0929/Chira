"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

import { cn } from "@/lib/utils";
import { useSidebar } from "@/store/use-sidebar";

const SidebarWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("flex", className)} {...props} />;
});

const SidebarChildren = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { isOpen } = useSidebar();

  return (
    <div
      ref={ref}
      className={cn(
        className,
        "w-full transition-all duration-300 ease-in-out",
        isOpen ? "ml-64" : "ml-6",
      )}
      {...props}
    >
      {children}
    </div>
  );
});

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { isOpen, toggle } = useSidebar();

  return (
    <div
      ref={ref}
      className={cn(
        className,
        "group fixed left-0 top-[56px] min-h-[calc(100vh-56px)] border-r-[2.5px] transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-5",
      )}
      {...props}
    >
      <Button
        size={"iconSm"}
        variant="ghost"
        className={cn(
          "absolute right-[-15px] top-10 rounded-full border bg-white transition-all duration-300 ease-in-out",
          isOpen
            ? "rotate-180 opacity-0 shadow-sm group-hover:opacity-100"
            : "rotate-0",
        )}
        onClick={() => toggle()}
      >
        <ChevronRight className="size-6" />
      </Button>

      <div>{children}</div>
    </div>
  );
});

SidebarWrapper.displayName = "SidebarWrapper";
SidebarChildren.displayName = "SidebarChildren";
Sidebar.displayName = "Sidebar";

export { SidebarWrapper, SidebarChildren, Sidebar };
