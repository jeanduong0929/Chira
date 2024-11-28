"use client";

import React, { useState } from "react";

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
  const [isOpenGroups, setIsOpenGroups] = useState<Record<string, boolean>>(
    () => {
      const initialGroups: Record<string, boolean> = {};
      sidebarItems.forEach(({ label }) => {
        initialGroups[label] = true;
      });
      return initialGroups;
    },
  );

  return (
    <>
      <Navbar />

      <SidebarWrapper>
        <Sidebar>
          <SidebarContent>
            {sidebarItems.map(({ label, items }) => (
              <SidebarGroup key={label}>
                <SidebarGroupLabel
                  isOpen={isOpenGroups[label]}
                  setIsOpen={(isOpen) =>
                    setIsOpenGroups({ ...isOpenGroups, [label]: isOpen })
                  }
                >
                  {label}
                </SidebarGroupLabel>
                {items.map((item) => (
                  <SidebarGroupItem
                    key={item.label}
                    label={item.label}
                    href={item.href}
                    icon={item.icon}
                    isOpen={isOpenGroups[label]}
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
    </>
  );
};

export default ProtectedLayout;
