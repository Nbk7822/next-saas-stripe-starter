import {
  Activity,
  Boxes,
  Fingerprint,
  LucideIcon,
  Workflow,
} from "lucide-react";

import { BlurFade } from "@/components/ui/blur-fade";
import { MagicCard } from "@/components/ui/magic-card";

import { SectionShell } from "./section-shell";

interface BenefitItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

const benefits: BenefitItem[] = [
  {
    title: "Security-first execution plane",
    description:
      "Run agents away from developer laptops, with policy boundaries that are explicit and repeatable.",
    icon: Fingerprint,
  },
  {
    title: "Composable agent workflows",
    description:
      "Chain tasks across different agent roles without losing context between execution steps.",
    icon: Workflow,
  },
  {
    title: "Built-in observability",
    description:
      "Trace what happened, why it happened, and how to improve each run in one place.",
    icon: Activity,
  },
  {
    title: "Reusable runtime patterns",
    description:
      "Standardize proven runtime setups so teams can launch new agent use cases faster.",
    icon: Boxes,
  },
];

export function EcosystemBenefitsSection() {
  return (
    <SectionShell
      id="ecosystem"
      eyebrow="Why LLMHub"
      title="Why teams run agents inside the LLMHub ecosystem."
      description="You get a coordinated platform for secure execution, collaboration, and continuous improvement instead of scattered scripts and fragile local setups."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;

          return (
            <BlurFade key={benefit.title} inView delay={index * 0.08}>
              <MagicCard
                className="h-full rounded-3xl border border-foreground/10 bg-background/60 p-px"
                gradientFrom="#ffffff"
                gradientTo="#d4d8e5"
                gradientOpacity={0.12}
                gradientSize={240}
              >
                <div className="h-full rounded-[1.4rem] bg-background/90 p-6 md:p-7">
                  <Icon className="size-5 text-foreground/70" />
                  <h3 className="mt-5 text-xl font-medium text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/65">
                    {benefit.description}
                  </p>
                </div>
              </MagicCard>
            </BlurFade>
          );
        })}
      </div>
    </SectionShell>
  );
}
