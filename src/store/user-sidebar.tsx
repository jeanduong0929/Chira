"use client";

import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const userSidebarAtom = atomWithStorage<boolean>("sidebarState", true);

export const useSidebar = () => {
  const [isOpen, setIsOpen] = useAtom(userSidebarAtom);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return { isOpen, open, close, toggle };
};
