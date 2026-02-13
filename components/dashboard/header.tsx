import { ProtectedUserMenu } from "@/components/layout/protected-user-menu";

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({
  heading,
  text,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="landing-glass landing-hover-box flex items-center justify-between rounded-2xl border-white/20 px-5 py-4 dark:border-white/10">
      <div className="grid gap-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
          {heading}
        </h1>
        {text && (
          <p className="font-geist text-base text-foreground/70">{text}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {children}
        <ProtectedUserMenu compact />
      </div>
    </div>
  );
}
