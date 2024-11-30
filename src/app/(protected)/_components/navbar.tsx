import React from "react";
import { ProjectDropdown } from "./project-dropdown";

export const Navbar = () => {
  return (
    <div className="h-[56px] w-full flex items-center border-b">
      <nav className="max-w-screen-2xl w-11/12 mx-auto flex items-center justify-between">
        <ProjectDropdown />
      </nav>
    </div>
  );
};
