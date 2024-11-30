"use client";

import React from "react";
import { ChevronRight, LucideIcon, Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/store/user-sidebar";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
        "flex flex-col gap-y-10 overflow-y-auto overflow-x-hidden px-2 py-10 transition-opacity duration-200 ease-in-out",
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
  HTMLLabelElement,
  React.HTMLAttributes<HTMLLabelElement>
>(({ className, children, ...props }, ref) => {
  return (
    <Label
      ref={ref}
      className={cn(className, "h-9 overflow-hidden truncate px-4 py-2")}
      {...props}
    >
      {children}
    </Label>
  );
});

const SidebarGroupItem = React.forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement> & {
    label: string;
    href: string;
    icon: LucideIcon;
  }
>(({ className, label, href, icon: Icon, ...props }, ref) => {
  const pathname = usePathname();

  return (
    <Button
      ref={ref}
      className={cn(
        className,
        "flex justify-start hover:bg-[#EAF3FF]",
        pathname === href && "bg-[#EAF3FF] text-[#377BE8] hover:text-[#377BE8]",
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
});

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
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupItem,
};
