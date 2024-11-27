import React from "react";

import { Navbar } from "@/components/shared/navbar/navbar";
import { Sidebar, SidebarChildren } from "@/components/shared/sidebar";
import { SidebarWrapper } from "@/components/shared/sidebar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div>
      <Navbar />

      <SidebarWrapper>
        <Sidebar></Sidebar>

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
