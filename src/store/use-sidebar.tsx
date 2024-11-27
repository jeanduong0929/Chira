"use client";

import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
export const sidebarOpenAtom = atomWithStorage("sidebarState", true);

export const useSidebar = () => {
  const [isOpen, setIsOpen] = useAtom(sidebarOpenAtom);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return { isOpen, open, close, toggle };
};
