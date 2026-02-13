import { Check } from "lucide-react";

import { BlurFade } from "@/components/ui/blur-fade";
import { MagicCard } from "@/components/ui/magic-card";

import { SectionShell } from "./section-shell";

const useCases = [
  {
    title: "Research & content ops",
    summary:
      "Launch multi-step research agents that gather, summarize, and package insights.",
    workflows: ["source crawling", "citation extraction", "brief assembly"],
  },
  {
    title: "Customer support copilots",
    summary:
      "Run support agents with strict policy controls before responses reach users.",
    workflows: ["ticket triage", "response drafting", "knowledge sync"],
  },
  {
    title: "QA and release validation",
    summary:
      "Execute testing agents in clean environments to reduce flaky local results.",
    workflows: ["regression checks", "UI snapshots", "release gates"],
  },
  {
    title: "Growth and ops automation",
    summary:
      "Automate repetitive analysis and workflow orchestration with clear human checkpoints.",
    workflows: ["funnel analysis", "campaign ops", "report generation"],
  },
];

export function UseCasesSection() {
  return (
    <SectionShell
      id="use-cases"
      eyebrow="Use Cases"
      title="Common agent workflows teams run on LLMHub."
      description="Start with practical workloads your team already handles, then expand with confidence as your runbook matures."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {useCases.map((useCase, index) => (
          <BlurFade key={useCase.title} inView delay={index * 0.08}>
            <MagicCard
              className="h-full rounded-3xl border border-foreground/10 bg-background/60 p-px"
              gradientFrom="#f5f8ff"
              gradientTo="#dae0ff"
              gradientOpacity={0.1}
              gradientSize={220}
            >
              <div className="h-full rounded-[1.4rem] bg-background/90 p-6">
                <h3 className="text-lg font-medium text-foreground">
                  {useCase.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/65">
                  {useCase.summary}
                </p>
                <ul className="mt-5 space-y-2 text-xs uppercase tracking-[0.15em] text-foreground/55">
                  {useCase.workflows.map((workflow) => (
                    <li
                      key={workflow}
                      className="inline-flex items-center gap-2"
                    >
                      <Check className="size-3.5" />
                      {workflow}
                    </li>
                  ))}
                </ul>
              </div>
            </MagicCard>
          </BlurFade>
        ))}
      </div>
    </SectionShell>
  );
}
