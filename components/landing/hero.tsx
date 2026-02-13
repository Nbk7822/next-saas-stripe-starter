"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Server,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { BlurFade } from "@/components/ui/blur-fade";
import { MagicCard } from "@/components/ui/magic-card";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

const trustPoints = [
  "Isolated VM per run",
  "Deterministic runtime snapshots",
  "Audit-ready execution logs",
];

export function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden pb-16 pt-20 md:pb-24 md:pt-28">
      <MaxWidthWrapper>
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
            <div>
              <BlurFade delay={0.05}>
                <div className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/60 px-4 py-1.5 backdrop-blur-sm">
                  <Sparkles className="size-3.5 text-foreground/60" />
                  <AnimatedShinyText
                    className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-foreground/70"
                    shimmerWidth={140}
                  >
                    llmhub.dev • isolated agent runtime
                  </AnimatedShinyText>
                </div>
              </BlurFade>

              <BlurFade delay={0.15} className="mt-7">
                <h1 className="max-w-2xl text-pretty text-4xl font-semibold leading-[1.05] text-foreground md:text-6xl md:leading-[1.03]">
                  Run autonomous agents on isolated virtual machines, directly
                  in your browser.
                </h1>
              </BlurFade>

              <BlurFade delay={0.22}>
                <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-foreground/70 md:text-lg">
                  LLMHub gives every agent a controlled environment with
                  built-in observability and clean handoff flows, so your team
                  can ship faster without local-machine chaos.
                </p>
              </BlurFade>

              <BlurFade delay={0.3}>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <ShimmerButton
                    onClick={() => router.push("/register")}
                    className="h-11 gap-2 bg-foreground px-6 text-sm font-medium text-background"
                    shimmerColor="rgba(255,255,255,0.95)"
                    background="hsl(var(--foreground))"
                  >
                    Test the product
                    <ArrowRight className="size-4" />
                  </ShimmerButton>

                  <Link
                    href="#how-it-works"
                    className="inline-flex h-11 items-center rounded-full border border-foreground/15 bg-background/55 px-5 text-sm font-medium text-foreground/80 transition-colors hover:bg-background/75"
                  >
                    See how it works
                  </Link>
                </div>
              </BlurFade>

              <BlurFade delay={0.38}>
                <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-foreground/65">
                  {trustPoints.map((point) => (
                    <li key={point} className="inline-flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-foreground/65" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </BlurFade>
            </div>

            <BlurFade delay={0.2} className="lg:justify-self-end">
              <MagicCard
                className="rounded-[1.75rem] border border-white/15 bg-white/10 p-px shadow-[0_40px_120px_-40px_rgba(30,30,30,0.5)]"
                gradientFrom="#ffffff"
                gradientTo="#bfc7ff"
                gradientOpacity={0.18}
                gradientSize={240}
              >
                <div className="rounded-[1.68rem] border border-white/10 bg-[#050507]/90 p-5 text-sm text-white backdrop-blur-xl md:p-6">
                  <div className="mb-5 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
                    <Server className="size-3.5" />
                    active runtime
                  </div>

                  <div className="space-y-2.5 font-mono text-[12px] text-white/80 md:text-[13px]">
                    <p className="text-white/95">
                      $ launch agent: support-copilot
                    </p>
                    <p className="text-white/70">
                      ↳ vm image: ubuntu-24-secure
                    </p>
                    <p className="text-white/70">
                      ↳ policy: network-restricted
                    </p>
                    <p className="text-white/70">
                      ↳ secret scope: customer-support
                    </p>
                    <p className="text-emerald-300">
                      ✓ environment sealed • logs streaming • task active
                    </p>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-2 text-[11px] text-white/65">
                    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      Deterministic setup
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      Human approval gates
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      Full replayability
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      Policy-safe access
                    </div>
                  </div>

                  <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/70">
                    <ShieldCheck className="size-3.5" />
                    managed isolation by default
                  </div>
                </div>
              </MagicCard>
            </BlurFade>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
