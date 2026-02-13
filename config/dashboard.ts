import { UserRole } from "@prisma/client";

import { SidebarNavItem } from "types";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "WORKSPACE",
    items: [
      {
        href: "/dashboard?workspace=dashboard",
        icon: "dashboard",
        title: "Dashboard",
      },
      {
        href: "/dashboard?workspace=launch",
        icon: "add",
        title: "Launch Machine",
      },
      {
        href: "/dashboard?workspace=machines",
        icon: "laptop",
        title: "Machines",
      },
      { href: "/dashboard?workspace=scripts", icon: "post", title: "Scripts" },
      {
        href: "/dashboard?workspace=settings",
        icon: "settings",
        title: "Settings",
      },
    ],
  },
  {
    title: "PAGES",
    items: [
      {
        href: "/dashboard/profile",
        icon: "user",
        title: "Profile",
      },
      {
        href: "/admin",
        icon: "laptop",
        title: "Admin Panel",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/dashboard/billing",
        icon: "billing",
        title: "Billing",
        authorizeOnly: UserRole.USER,
      },
      { href: "/dashboard/charts", icon: "lineChart", title: "Charts" },
      {
        href: "/admin/orders",
        icon: "package",
        title: "Orders",
        badge: 2,
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/dashboard/support",
        icon: "messages",
        title: "Support & Feedback",
      },
      { href: "/", icon: "home", title: "Homepage" },
      { href: "/docs", icon: "bookOpen", title: "Documentation" },
    ],
  },
];
