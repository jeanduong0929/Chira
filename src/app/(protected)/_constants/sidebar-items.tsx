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

export const getSidebarItems = (projectId?: string): SidebarGroup[] => [
  {
    label: "Planning",
    items: [
      {
        label: "Backlog",
        href: `/projects/${projectId}/backlog`,
        icon: ScrollText,
      },
      {
        label: "Board",
        href: `/projects/${projectId}/board`,
        icon: Columns3,
      },
    ],
  },
  {
    label: "Planning",
    items: [
      {
        label: "Backlog",
        href: `/projects/${projectId}/backlog`,
        icon: ScrollText,
      },
      {
        label: "Board",
        href: `/projects/${projectId}/board`,
        icon: Columns3,
      },
    ],
  },
  {
    label: "Planning",
    items: [
      {
        label: "Backlog",
        href: `/projects/${projectId}/backlog`,
        icon: ScrollText,
      },
      {
        label: "Board",
        href: `/projects/${projectId}/board`,
        icon: Columns3,
      },
    ],
  },
  {
    label: "Planning",
    items: [
      {
        label: "Backlog",
        href: `/projects/${projectId}/backlog`,
        icon: ScrollText,
      },
      {
        label: "Board",
        href: `/projects/${projectId}/board`,
        icon: Columns3,
      },
    ],
  },
  {
    label: "Planning",
    items: [
      {
        label: "Backlog",
        href: `/projects/${projectId}/backlog`,
        icon: ScrollText,
      },
      {
        label: "Board",
        href: `/projects/${projectId}/board`,
        icon: Columns3,
      },
    ],
  },
  {
    label: "Planning",
    items: [
      {
        label: "Backlog",
        href: `/projects/${projectId}/backlog`,
        icon: ScrollText,
      },
      {
        label: "Board",
        href: `/projects/${projectId}/board`,
        icon: Columns3,
      },
    ],
  },
  {
    label: "Planning",
    items: [
      {
        label: "Backlog",
        href: `/projects/${projectId}/backlog`,
        icon: ScrollText,
      },
      {
        label: "Board",
        href: `/projects/${projectId}/board`,
        icon: Columns3,
      },
    ],
  },
  {
    label: "Planning",
    items: [
      {
        label: "Backlog",
        href: `/projects/${projectId}/backlog`,
        icon: ScrollText,
      },
      {
        label: "Board",
        href: `/projects/${projectId}/board`,
        icon: Columns3,
      },
    ],
  },
  {
    label: "Planning",
    items: [
      {
        label: "Backlog",
        href: `/projects/${projectId}/backlog`,
        icon: ScrollText,
      },
      {
        label: "Board",
        href: `/projects/${projectId}/board`,
        icon: Columns3,
      },
    ],
  },
];
