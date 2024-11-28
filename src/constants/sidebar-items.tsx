import { Columns3, LucideIcon, ScrollText } from "lucide-react";

type SidebarItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type SidebarGroup = {
  label: string;
  items: SidebarItem[];
};

export const sidebarItems: SidebarGroup[] = [
  {
    label: "Planning",
    items: [
      {
        label: "Backlog",
        href: "/projects/1/boards/1/backlog",
        icon: ScrollText,
      },
      {
        label: "Board",
        href: "/projects/1/boards/1",
        icon: Columns3,
      },
    ],
  },
];
