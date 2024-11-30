import React from "react";
import { Navbar } from "./_components/navbar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div>
      <Navbar />

      <main className="max-w-screen-2xl w-11/12 mx-auto py-10">{children}</main>
    </div>
  );
};

export default ProtectedLayout;
