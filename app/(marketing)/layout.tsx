import { NavMobile } from "@/components/layout/mobile-nav";
import { NavBar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import GradientBlinds from "@/components/reactbits/gradient-blinds";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
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
          spotlightRadius={0.28}
          spotlightSoftness={1.5}
          spotlightOpacity={0.35}
          distortAmount={0.1}
          shineDirection="left"
          mixBlendMode="normal"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.62),transparent_56%)]" />
        <div className="bg-background/82 absolute inset-0" />
      </div>

      <NavMobile />
      <NavBar scroll={true} />
      <main className="relative z-10 flex-1">{children}</main>
      <SiteFooter className="relative z-10 border-white/10 bg-background/55 backdrop-blur-xl" />
    </div>
  );
}
