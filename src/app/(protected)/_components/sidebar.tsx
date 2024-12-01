"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, LucideIcon } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/store/user-sidebar";
import { Label } from "@/components/ui/label";
import { useProject } from "@/store/use-project";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";

const SidebarWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn(className, "flex")} {...props}>
      {children}
    </div>
  );
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
        isOpen ? "ml-64" : "ml-5",
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
  const { isOpen } = useSidebar();

  return (
    <div
      ref={ref}
      className={cn(
        className,
        "fixed left-0 top-[56px] flex max-h-[calc(100vh-56px)] min-h-[calc(100vh-56px)] flex-col border-r-4 transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-5",
      )}
      {...props}
    >
      {children}
    </div>
  );
});

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const [projectId, _] = useProject();

  const { isOpen } = useSidebar();
  const { data: project, isLoading } = useQuery(
    convexQuery(api.projects.getByIdWithUser, {
      projectId: projectId as Id<"projects">,
    }),
  );

  return (
    <div
      ref={ref}
      className={cn(
        className,
        "flex min-w-64 items-center gap-x-2 px-4 pt-5 transition-opacity duration-200 ease-in-out",
        isOpen ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      {...props}
    >
      <Button
        className="size-10 shrink-0 bg-[#FF5631] hover:bg-[#FF5631]/90"
        size={"icon"}
      >
        {project?.name?.[0]
          .toUpperCase()
          .concat(project?.name?.[1].toUpperCase())}
      </Button>
      <div className="flex flex-col">
        <h2 className="text-md font-semibold">{project?.name}</h2>
        <p className="text-xs text-muted-foreground">Software Development</p>
      </div>
    </div>
  );
});

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { isOpen, toggle } = useSidebar();

  return (
    <Button
      ref={ref}
      className={cn(
        className,
        "absolute -right-4 top-5 rounded-full border bg-white transition-transform duration-300 ease-in-out",
        isOpen ? "rotate-180" : "rotate-0",
      )}
      variant="ghost"
      size="iconSm"
      onClick={toggle}
      {...props}
    >
      <ChevronRight />
    </Button>
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
        "flex min-w-64 flex-col gap-y-10 overflow-y-auto overflow-x-hidden px-2 py-5 transition-opacity duration-200 ease-in-out",
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
      className={cn(className, "flex flex-col gap-y-1 text-sm text-[#44556F]")}
      {...props}
    >
      {children}
    </div>
  );
});

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    open: boolean;
    setOpen: (open: boolean) => void;
  }
>(({ className, children, open, setOpen, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(className, "flex h-9 items-center px-2")}
      {...props}
    >
      <Button
        variant={"ghost"}
        size={"iconXs"}
        className="mr-1"
        onClick={() => setOpen(!open)}
      >
        <ChevronRight
          className={cn(
            "transition-transform duration-300 ease-in-out",
            open ? "rotate-90" : "rotate-0",
          )}
        />
      </Button>

      <Label className="overflow-hidden truncate">{children}</Label>
    </div>
  );
});

const SidebarGroupItem = React.forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement> & {
    label: string;
    href: string;
    icon: LucideIcon;
    open: boolean;
    disabled?: boolean;
  }
>(({ className, label, href, icon: Icon, open, disabled, ...props }, ref) => {
  const pathname = usePathname();

  if (open) {
    return (
      <Button
        ref={ref}
        className={cn(
          className,
          "flex justify-start px-6 hover:bg-[#EAF3FF]",
          pathname === href &&
            "bg-[#EAF3FF] text-[#377BE8] hover:text-[#377BE8]",
          disabled && "pointer-events-none opacity-50",
        )}
        variant="ghost"
        {...props}
        asChild
      >
        <Link href={href}>
          <Icon className="size-4" />
          <span className="overflow-hidden truncate">{label}</span>
        </Link>
      </Button>
    );
  }
});

SidebarHeader.displayName = "SidebarHeader";
SidebarWrapper.displayName = "SidebarWrapper";
SidebarChildren.displayName = "SidebarChildren";
SidebarTrigger.displayName = "SidebarTrigger";
Sidebar.displayName = "Sidebar";
SidebarContent.displayName = "SidebarContent";
SidebarGroup.displayName = "SidebarGroup";
SidebarGroupLabel.displayName = "SidebarGroupLabel";
SidebarGroupItem.displayName = "SidebarGroupItem";

export {
  Sidebar,
  SidebarWrapper,
  SidebarChildren,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupItem,
};
