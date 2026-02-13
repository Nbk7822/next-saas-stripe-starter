import {
  Eye,
  LockKeyhole,
  LucideIcon,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

import { BlurFade } from "@/components/ui/blur-fade";
import { MagicCard } from "@/components/ui/magic-card";

import { SectionShell } from "./section-shell";

interface ProofItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

const runtimeProof: ProofItem[] = [
  {
    title: "Isolated virtual machines",
    description:
      "Each agent run starts in a fresh VM boundary, keeping workloads separated by default.",
    icon: ShieldCheck,
  },
  {
    title: "Deterministic environments",
    description:
      "Pinned runtime images and repeatable setup make behavior predictable across teams.",
    icon: RotateCcw,
  },
  {
    title: "Auditable execution",
    description:
      "Traceable run history helps you inspect prompts, actions, outputs, and approvals.",
    icon: Eye,
  },
  {
    title: "Managed secret controls",
    description:
      "Scoped credentials reduce accidental exposure while still enabling agent productivity.",
    icon: LockKeyhole,
  },
];

export function RuntimeProofSection() {
  return (
    <SectionShell
      id="runtime-proof"
      eyebrow="Runtime Guarantees"
      title="Built for teams who need control, not just demos."
      description="LLMHub is designed for production-grade agent execution where security, reproducibility, and visibility are first-class requirements."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {runtimeProof.map((item, index) => {
          const Icon = item.icon;

          return (
            <BlurFade key={item.title} inView delay={index * 0.08}>
              <MagicCard
                className="h-full rounded-3xl border border-foreground/10 bg-background/60 p-px backdrop-blur-sm"
                gradientFrom="#f7f7f7"
                gradientTo="#d6def5"
                gradientOpacity={0.12}
                gradientSize={220}
              >
                <div className="h-full rounded-[1.4rem] bg-background/90 p-6 md:p-7">
                  <Icon className="size-5 text-foreground/70" />
                  <h3 className="mt-5 text-lg font-medium text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/65">
                    {item.description}
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
