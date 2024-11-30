"use client";

import React, { useState } from "react";
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
  const [sidebarOpen, setSidebarOpen] = useState<Record<string, boolean>>(
    () => {
      const initialState: Record<string, boolean> = {};
      for (const group of getSidebarItems()) {
        initialState[group.label] = true;
      }
      return initialState;
    },
  );

  const handleSidebarClick = (group: string) => {
    setSidebarOpen((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  return (
    <div>
      <Navbar />

      <SidebarWrapper>
        <Sidebar>
          <SidebarTrigger />
          <SidebarContent>
            {getSidebarItems("").map((group) => (
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
                    {...item}
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
