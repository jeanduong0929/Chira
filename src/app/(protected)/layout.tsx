"use client";

import React from "react";
import { ScrollText } from "lucide-react";

import { Navbar } from "@/components/shared/navbar/navbar";
import {
  Sidebar,
  SidebarChildren,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupItem,
} from "@/components/shared/sidebar";
import { SidebarWrapper } from "@/components/shared/sidebar";
import { sidebarItems } from "@/constants/sidebar-items";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div>
      <Navbar />

      <SidebarWrapper>
        <Sidebar>
          <SidebarContent>
            {sidebarItems.map((group) => (
              <SidebarGroup key={group.label}>
                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                {group.items.map((item) => (
                  <SidebarGroupItem
                    key={item.label}
                    label={item.label}
                    href={item.href}
                    icon={item.icon}
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
