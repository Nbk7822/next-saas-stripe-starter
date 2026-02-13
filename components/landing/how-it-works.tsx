import { ArrowUpRight } from "lucide-react";

import { BlurFade } from "@/components/ui/blur-fade";
import { MagicCard } from "@/components/ui/magic-card";

import { SectionShell } from "./section-shell";

const steps = [
  {
    title: "Choose your agent",
    description:
      "Pick a workflow template or define your own prompt, tools, and policy boundaries.",
  },
  {
    title: "Run it inside a VM",
    description:
      "Launch execution in a managed virtual machine with scoped network and secret access.",
  },
  {
    title: "Review, approve, ship",
    description:
      "Inspect outputs and traces, then hand off results to your product, ops, or support flow.",
  },
];

export function HowItWorksSection() {
  return (
    <SectionShell
      id="how-it-works"
      eyebrow="How It Works"
      title="A simple flow for complex agent work."
      description="From first prompt to final output, each run follows a clear lifecycle that your entire team can understand and trust."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <BlurFade key={step.title} inView delay={index * 0.08}>
            <MagicCard
              className="h-full rounded-3xl border border-foreground/10 bg-background/55 p-px"
              gradientFrom="#ffffff"
              gradientTo="#ced9ff"
              gradientOpacity={0.1}
              gradientSize={200}
            >
              <div className="flex h-full flex-col rounded-[1.4rem] bg-background/90 p-6">
                <span className="inline-flex w-fit items-center rounded-full border border-foreground/15 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-foreground/65">
                  STEP {index + 1}
                </span>
                <h3 className="mt-5 text-lg font-medium text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/65">
                  {step.description}
                </p>
                <ArrowUpRight className="mt-6 size-4 text-foreground/40" />
              </div>
            </MagicCard>
          </BlurFade>
        ))}
      </div>
    </SectionShell>
  );
}
