import { redirect } from "next/navigation";

import { sidebarLinks } from "@/config/dashboard";
import { getCurrentUser } from "@/lib/session";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { ProtectedRouteTransition } from "@/components/layout/protected-route-transition";
import GradientBlinds from "@/components/reactbits/gradient-blinds";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  const filteredLinks = sidebarLinks.map((section) => ({
    ...section,
    items: section.items.filter(
      ({ authorizeOnly }) => !authorizeOnly || authorizeOnly === user.role,
    ),
  }));

  return (
    <div className="dashboard-theme relative flex min-h-screen w-full overflow-x-clip font-geist">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <GradientBlinds
          className="absolute inset-0 opacity-45"
          gradientColors={["#f7f8fb", "#edf0f6", "#e3e7ef"]}
          angle={12}
          noise={0.02}
          blindCount={14}
          blindMinWidth={92}
          mouseDampening={0.16}
          mirrorGradient
          spotlightRadius={0.22}
          spotlightSoftness={1.5}
          spotlightOpacity={0.33}
          distortAmount={0.1}
          shineDirection="left"
          mixBlendMode="normal"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.62),transparent_56%)]" />
        <div className="bg-background/82 absolute inset-0" />
      </div>

      <DashboardSidebar links={filteredLinks} />

      <main className="relative z-10 flex-1">
        <ProtectedRouteTransition>{children}</ProtectedRouteTransition>
      </main>
    </div>
  );
}
