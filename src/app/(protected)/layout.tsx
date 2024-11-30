"use client";

import React from "react";
import { Navbar } from "./_components/navbar";
import {
  Sidebar,
  SidebarChildren,
  SidebarContent,
  SidebarGroup,
  SidebarGroupItem,
  SidebarGroupLabel,
  SidebarTrigger,
  SidebarWrapper,
} from "./_components/sidebar";
import { getSidebarItems } from "./_constants/sidebar-items";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div>
      <Navbar />

      <SidebarWrapper>
        <Sidebar>
          <SidebarTrigger />
          <SidebarContent>
            {getSidebarItems("").map((group) => (
              <SidebarGroup key={group.label}>
                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                {group.items.map((item) => (
                  <SidebarGroupItem key={item.label} {...item} />
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
