import { Navbar } from "@/components/shared/navbar/navbar";
import React from "react";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default ProtectedLayout;
