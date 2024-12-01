"use client";

import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useEffect } from "react";
import { useState } from "react";

export const userSidebarAtom = atomWithStorage<boolean>("sidebarState", true);

export const useSidebar = () => {
  const [isOpen, setIsOpen] = useAtom(userSidebarAtom);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return { isOpen, open, close, toggle, mounted };
};
