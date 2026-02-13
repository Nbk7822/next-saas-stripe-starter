"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

type MenuItem = {
  label: string;
  href: string;
};

const workspaceItems: MenuItem[] = [
  { label: "Workspace Dashboard", href: "/dashboard?workspace=dashboard" },
  { label: "Launch Machine", href: "/dashboard?workspace=launch" },
  { label: "Workspace Machines", href: "/dashboard?workspace=machines" },
  { label: "Workspace Scripts", href: "/dashboard?workspace=scripts" },
  { label: "Workspace Settings", href: "/dashboard?workspace=settings" },
];

const pageItems: MenuItem[] = [
  { label: "Profile", href: "/dashboard/profile" },
  { label: "Billing", href: "/dashboard/billing" },
  { label: "Charts", href: "/dashboard/charts" },
  { label: "Settings", href: "/dashboard/settings" },
  { label: "Support & Feedback", href: "/dashboard/support" },
  { label: "Homepage", href: "/" },
  { label: "Docs", href: "/docs" },
];

interface ProtectedUserMenuProps {
  compact?: boolean;
}

function isRouteActive(
  href: string,
  pathname: string,
  currentRoute: string,
): boolean {
  if (!href || href === "#") return false;
  if (href === "/dashboard?workspace=dashboard" && pathname === "/dashboard") {
    return true;
  }
  return href.includes("?") ? href === currentRoute : href === pathname;
}

export function ProtectedUserMenu({ compact = false }: ProtectedUserMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";
  const userInitial = userName.trim().charAt(0).toUpperCase() || "U";
  const isAdmin = session?.user?.role === "ADMIN";
  const currentRoute = searchParams.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname;

  const adminItems = useMemo<MenuItem[]>(
    () => [
      { label: "Admin Panel", href: "/admin" },
      { label: "Admin Orders", href: "/admin/orders" },
    ],
    [],
  );

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  const onNavigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="landing-hover-tab flex size-9 items-center justify-center rounded-full border border-white/25 bg-gradient-to-br from-[#ff6b4a] to-[#fbbf24] text-xs font-semibold text-white shadow-[0_10px_28px_-18px_rgba(251,146,60,0.7)] transition-colors dark:border-white/15"
      >
        {userInitial}
      </button>

      {open ? (
        <div
          className={`dashboard-dropdown-content absolute right-0 z-[150] rounded-xl border bg-white/95 p-2 shadow-[0_20px_42px_-26px_rgba(15,23,42,0.65)] backdrop-blur-xl dark:bg-black/75 ${
            compact ? "top-11 w-64" : "top-11 w-72"
          }`}
        >
          <div className="border-b border-white/20 px-2 pb-2 dark:border-white/10">
            <p className="text-sm font-semibold text-foreground">{userName}</p>
            {userEmail ? (
              <p className="mt-0.5 truncate font-mono text-[11px] text-foreground/55">
                {userEmail}
              </p>
            ) : null}
          </div>

          <div className="pt-2">
            <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground/45">
              Workspace
            </p>
            <div className="flex flex-col gap-0.5">
              {workspaceItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => onNavigate(item.href)}
                  className={`dashboard-dropdown-item w-full rounded-lg px-2.5 py-2 text-left text-sm transition-all ${
                    isRouteActive(item.href, pathname, currentRoute)
                      ? "bg-black/5 font-medium text-foreground dark:bg-white/10"
                      : "text-foreground/75 hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground/45">
              Pages
            </p>
            <div className="flex flex-col gap-0.5">
              {pageItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => onNavigate(item.href)}
                  className={`dashboard-dropdown-item w-full rounded-lg px-2.5 py-2 text-left text-sm transition-all ${
                    isRouteActive(item.href, pathname, currentRoute)
                      ? "bg-black/5 font-medium text-foreground dark:bg-white/10"
                      : "text-foreground/75 hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {isAdmin ? (
            <div className="mt-2 border-t border-white/20 pt-2 dark:border-white/10">
              <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground/45">
                Admin
              </p>
              <div className="flex flex-col gap-0.5">
                {adminItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => onNavigate(item.href)}
                    className={`dashboard-dropdown-item w-full rounded-lg px-2.5 py-2 text-left text-sm transition-all ${
                      isRouteActive(item.href, pathname, currentRoute)
                        ? "bg-black/5 font-medium text-foreground dark:bg-white/10"
                        : "text-foreground/75 hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-2 border-t border-white/20 pt-2 dark:border-white/10">
            <button
              onClick={() => {
                setOpen(false);
                void signOut({ callbackUrl: "/" });
              }}
              className="dashboard-dropdown-item w-full rounded-lg px-2.5 py-2 text-left text-sm font-medium text-rose-500 transition-all hover:bg-rose-500/10"
            >
              Sign out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
