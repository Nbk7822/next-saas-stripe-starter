"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { SidebarNavItem } from "@/types";
import { Menu, PanelLeftClose, PanelRightClose } from "lucide-react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UpgradeCard } from "@/components/dashboard/upgrade-card";
import { Icons } from "@/components/shared/icons";

interface DashboardSidebarProps {
  links: SidebarNavItem[];
}

const dashboardBrandLinks = [
  { char: "L", href: "/dashboard?workspace=launch" },
  { char: "L", href: "/dashboard?workspace=machines" },
  { char: "M", href: "/dashboard?workspace=scripts" },
  { char: "H", href: "/dashboard?workspace=dashboard" },
  { char: "U", href: "/dashboard/profile" },
  { char: "B", href: "/dashboard/support" },
];

export function DashboardSidebar({ links }: DashboardSidebarProps) {
  const path = usePathname();
  const searchParams = useSearchParams();
  const currentRoute = searchParams.toString()
    ? `${path}?${searchParams.toString()}`
    : path;

  // NOTE: Use this if you want save in local storage -- Credits: Hosna Qasmei
  //
  // const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
  //   if (typeof window !== "undefined") {
  //     const saved = window.localStorage.getItem("sidebarExpanded");
  //     return saved !== null ? JSON.parse(saved) : true;
  //   }
  //   return true;
  // });

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     window.localStorage.setItem(
  //       "sidebarExpanded",
  //       JSON.stringify(isSidebarExpanded),
  //     );
  //   }
  // }, [isSidebarExpanded]);

  const { isTablet } = useMediaQuery();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(!isTablet);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  useEffect(() => {
    setIsSidebarExpanded(!isTablet);
  }, [isTablet]);

  const isActiveRoute = (href: string) => {
    if (!href || href === "#") return false;
    if (href === "/dashboard?workspace=dashboard" && path === "/dashboard") {
      return true;
    }
    const hasQuery = href.includes("?");
    return hasQuery ? href === currentRoute : href === path;
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="sticky top-0 h-full">
        <ScrollArea className="dashboard-sidebar-shell h-full overflow-y-auto border-r border-white/20 bg-white/45 backdrop-blur-xl dark:border-white/10 dark:bg-black/30">
          <aside
            className={cn(
              isSidebarExpanded ? "w-[220px] xl:w-[260px]" : "w-[68px]",
              "hidden h-screen md:block",
            )}
          >
            <div className="flex h-full max-h-screen flex-1 flex-col gap-2">
              <div className="flex h-14 items-center gap-2 px-3 lg:h-[60px]">
                {isSidebarExpanded ? (
                  <div className="group inline-flex items-center gap-2 rounded-xl border border-transparent px-2 py-1 transition-all hover:border-white/25 hover:bg-white/55 dark:hover:border-white/15 dark:hover:bg-white/10">
                    <Link
                      href="/dashboard?workspace=dashboard"
                      className="inline-flex items-center"
                    >
                      <Icons.logo className="size-5 text-foreground/85 transition-colors group-hover:text-foreground" />
                    </Link>
                    <div className="font-urban text-sm font-bold tracking-[0.14em] text-white [mix-blend-mode:difference]">
                      {dashboardBrandLinks.map((item, index) => (
                        <Link
                          key={`${item.char}-${index}`}
                          href={item.href}
                          className="landing-toolbar-word inline-flex"
                        >
                          {item.char}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/dashboard?workspace=dashboard"
                    className="landing-hover-tab ml-1 inline-flex size-9 items-center justify-center rounded-xl border border-transparent text-foreground/85 hover:border-white/25 hover:bg-white/60 dark:hover:border-white/15 dark:hover:bg-white/10"
                  >
                    <Icons.logo className="size-5" />
                    <span className="sr-only">{siteConfig.name}</span>
                  </Link>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  className="landing-hover-tab ml-auto size-9 rounded-xl border border-transparent text-foreground/70 hover:border-white/25 hover:bg-white/60 hover:text-foreground dark:hover:border-white/15 dark:hover:bg-white/10 lg:size-8"
                  onClick={toggleSidebar}
                >
                  {isSidebarExpanded ? (
                    <PanelLeftClose
                      size={18}
                      className="stroke-muted-foreground"
                    />
                  ) : (
                    <PanelRightClose
                      size={18}
                      className="stroke-muted-foreground"
                    />
                  )}
                  <span className="sr-only">Toggle Sidebar</span>
                </Button>
              </div>

              <nav className="flex flex-1 flex-col gap-8 px-4 pt-4">
                {links.map((section) => (
                  <section
                    key={section.title}
                    className="flex flex-col gap-0.5"
                  >
                    {isSidebarExpanded ? (
                      <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/50">
                        {section.title}
                      </p>
                    ) : (
                      <div className="h-4" />
                    )}
                    {section.items.map((item) => {
                      const Icon = Icons[item.icon || "arrowRight"];
                      return (
                        item.href && (
                          <Fragment key={`link-fragment-${item.title}`}>
                            {isSidebarExpanded ? (
                              <Link
                                key={`link-${item.title}`}
                                href={item.disabled ? "#" : item.href}
                                className={cn(
                                  "group flex items-center gap-3 rounded-xl border border-transparent p-2.5 text-sm font-medium transition-all duration-200",
                                  isActiveRoute(item.href)
                                    ? "border-white/30 bg-white/70 text-foreground shadow-[0_16px_36px_-28px_rgba(15,23,42,0.6)] dark:border-white/20 dark:bg-white/10"
                                    : "dark:hover:bg-white/8 text-muted-foreground hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/55 hover:text-foreground dark:hover:border-white/15",
                                  item.disabled &&
                                    "cursor-not-allowed opacity-80 hover:translate-y-0 hover:border-transparent hover:bg-transparent hover:text-muted-foreground",
                                )}
                              >
                                <Icon className="size-5" />
                                {item.title}
                                {item.badge && (
                                  <Badge className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full">
                                    {item.badge}
                                  </Badge>
                                )}
                              </Link>
                            ) : (
                              <Tooltip key={`tooltip-${item.title}`}>
                                <TooltipTrigger asChild>
                                  <Link
                                    key={`link-tooltip-${item.title}`}
                                    href={item.disabled ? "#" : item.href}
                                    className={cn(
                                      "group flex items-center gap-3 rounded-xl border border-transparent py-2 text-sm font-medium transition-all duration-200",
                                      isActiveRoute(item.href)
                                        ? "border-white/30 bg-white/70 text-foreground shadow-[0_16px_36px_-28px_rgba(15,23,42,0.6)] dark:border-white/20 dark:bg-white/10"
                                        : "dark:hover:bg-white/8 text-muted-foreground hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/55 hover:text-foreground dark:hover:border-white/15",
                                      item.disabled &&
                                        "cursor-not-allowed opacity-80 hover:translate-y-0 hover:border-transparent hover:bg-transparent hover:text-muted-foreground",
                                    )}
                                  >
                                    <span className="flex size-full items-center justify-center">
                                      <Icon className="size-5" />
                                    </span>
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                  {item.title}
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </Fragment>
                        )
                      );
                    })}
                  </section>
                ))}
              </nav>

              <div className="mt-auto xl:p-4">
                {isSidebarExpanded ? <UpgradeCard /> : null}
              </div>
            </div>
          </aside>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}

export function MobileSheetSidebar({ links }: DashboardSidebarProps) {
  const path = usePathname();
  const searchParams = useSearchParams();
  const currentRoute = searchParams.toString()
    ? `${path}?${searchParams.toString()}`
    : path;
  const [open, setOpen] = useState(false);
  const { isSm, isMobile } = useMediaQuery();

  const isActiveRoute = (href: string) => {
    if (!href || href === "#") return false;
    if (href === "/dashboard?workspace=dashboard" && path === "/dashboard") {
      return true;
    }
    const hasQuery = href.includes("?");
    return hasQuery ? href === currentRoute : href === path;
  };

  if (isSm || isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="landing-hover-tab size-9 shrink-0 border-white/25 bg-white/75 backdrop-blur-xl dark:border-white/15 dark:bg-black/35 md:hidden"
          >
            <Menu className="size-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="flex flex-col border-white/20 bg-white/85 p-0 backdrop-blur-2xl dark:border-white/15 dark:bg-black/65"
        >
          <ScrollArea className="h-full overflow-y-auto">
            <div className="flex h-screen flex-col">
              <nav className="flex flex-1 flex-col gap-y-8 p-6 text-lg font-medium">
                <Link
                  href="/dashboard?workspace=dashboard"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Icons.logo className="size-6" />
                  <span className="font-urban text-xl font-bold tracking-[0.12em] text-white [mix-blend-mode:difference]">
                    {dashboardBrandLinks.map((item, index) => (
                      <span key={`${item.char}-mobile-${index}`}>
                        {item.char}
                      </span>
                    ))}
                  </span>
                </Link>

                {links.map((section) => (
                  <section
                    key={section.title}
                    className="flex flex-col gap-0.5"
                  >
                    <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/50">
                      {section.title}
                    </p>

                    {section.items.map((item) => {
                      const Icon = Icons[item.icon || "arrowRight"];
                      return (
                        item.href && (
                          <Fragment key={`link-fragment-${item.title}`}>
                            <Link
                              key={`link-${item.title}`}
                              onClick={() => {
                                if (!item.disabled) setOpen(false);
                              }}
                              href={item.disabled ? "#" : item.href}
                              className={cn(
                                "group flex items-center gap-3 rounded-xl border border-transparent p-2.5 text-sm font-medium transition-all duration-200",
                                isActiveRoute(item.href)
                                  ? "border-white/30 bg-white/70 text-foreground shadow-[0_16px_36px_-28px_rgba(15,23,42,0.6)] dark:border-white/20 dark:bg-white/10"
                                  : "dark:hover:bg-white/8 text-muted-foreground hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/55 hover:text-foreground dark:hover:border-white/15",
                                item.disabled &&
                                  "cursor-not-allowed opacity-80 hover:translate-y-0 hover:border-transparent hover:bg-transparent hover:text-muted-foreground",
                              )}
                            >
                              <Icon className="size-5" />
                              {item.title}
                              {item.badge && (
                                <Badge className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full">
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>
                          </Fragment>
                        )
                      );
                    })}
                  </section>
                ))}

                <div className="mt-auto">
                  <UpgradeCard />
                </div>
              </nav>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="flex size-9 animate-pulse rounded-lg bg-muted md:hidden" />
  );
}
