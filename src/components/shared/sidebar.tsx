"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, LucideIcon } from "lucide-react";
import { Button } from "../ui/button";

import { cn } from "@/lib/utils";
import { useSidebar } from "@/store/use-sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
        isOpen ? "w-64 px-2 py-10" : "w-5",
      )}
      {...props}
    >
      <Button
        size={"iconSm"}
        variant="ghost"
        className={cn(
          "absolute right-[-15px] top-10 flex flex-col rounded-full border bg-white transition-all duration-300 ease-in-out",
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

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { isOpen } = useSidebar();

  return (
    <div
      ref={ref}
      className={cn(
        className,
        "flex flex-col gap-y-10 transition-opacity duration-200 ease-in-out",
        isOpen ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      {...props}
    >
      {children}
    </div>
  );
});

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        className,
        "flex flex-col gap-y-1 text-sm text-muted-foreground",
      )}
      {...props}
    >
      {children}
    </div>
  );
});

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
  }
>(({ className, children, isOpen, setIsOpen, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        className,
        "flex h-9 items-center gap-x-2 px-3 py-2 font-medium",
      )}
      {...props}
    >
      <Button
        variant={"ghost"}
        size={"iconXs"}
        onClick={() => setIsOpen(!isOpen)}
      >
        <ChevronDown
          className={cn(
            "transition-transform duration-300 ease-in-out",
            isOpen ? "rotate-0" : "-rotate-90",
          )}
        />
      </Button>
      <div>{children}</div>
    </div>
  );
});

const SidebarGroupItem = React.forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement> & {
    label: string;
    href: string;
    icon: LucideIcon;
    isOpen: boolean;
  }
>(({ className, label, href, icon: Icon, isOpen, ...props }, ref) => {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <Button
      ref={ref}
      variant={"ghost"}
      className={cn(
        className,
        "flex justify-start px-6 font-medium transition-opacity duration-200 ease-in-out hover:bg-[#E9F2FF] hover:text-muted-foreground",
        pathname === href &&
          "border-l-4 border-l-[#0B66E4] bg-[#E9F2FF] text-[#0B66E4] hover:text-[#0B66E4]",
      )}
      {...props}
      asChild
    >
      <Link href={href}>
        <Icon />
        <span>{label}</span>
      </Link>
    </Button>
  );
});

SidebarWrapper.displayName = "SidebarWrapper";
SidebarChildren.displayName = "SidebarChildren";
Sidebar.displayName = "Sidebar";
SidebarContent.displayName = "SidebarContent";
SidebarGroup.displayName = "SidebarGroup";
SidebarGroupLabel.displayName = "SidebarGroupLabel";
SidebarGroupItem.displayName = "SidebarGroupItem";

export {
  SidebarWrapper,
  SidebarChildren,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupItem,
};
