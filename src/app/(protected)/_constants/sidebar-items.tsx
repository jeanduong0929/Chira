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

export const getSidebarItems = (pathname: string): SidebarGroup[] => [
  {
    label: "Planning",
    items: [
      {
        label: "Backlog",
        href: `projects/${pathname}/backlog`,
        icon: ScrollText,
      },
      {
        label: "Board",
        href: `projects/${pathname}/board`,
        icon: Columns3,
      },
    ],
  },
];
