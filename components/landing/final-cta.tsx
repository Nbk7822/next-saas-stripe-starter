"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { BlurFade } from "@/components/ui/blur-fade";
import { MagicCard } from "@/components/ui/magic-card";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export function FinalCtaSection() {
  const router = useRouter();

  return (
    <section className="relative pb-24 pt-8 md:pb-32">
      <MaxWidthWrapper>
        <div className="mx-auto max-w-5xl">
          <BlurFade inView>
            <MagicCard
              className="rounded-[2rem] border border-foreground/10 bg-background/60 p-px"
              gradientFrom="#ffffff"
              gradientTo="#d5ddfb"
              gradientOpacity={0.12}
              gradientSize={280}
            >
              <div className="rounded-[1.95rem] bg-background/90 px-6 py-12 text-center md:px-10 md:py-16">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground/55">
                  Start Now
                </p>
                <h2 className="mx-auto mt-4 max-w-3xl text-pretty text-3xl font-semibold leading-tight text-foreground md:text-5xl md:leading-tight">
                  Give your agents a secure execution home.
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-foreground/65 md:text-lg">
                  Move from brittle local scripts to a reliable VM-native agent
                  platform your team can operate with confidence.
                </p>

                <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
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
                    href="/pricing"
                    className="inline-flex h-11 items-center rounded-full border border-foreground/15 bg-background/55 px-5 text-sm font-medium text-foreground/80 transition-colors hover:bg-background/75"
                  >
                    View pricing
                  </Link>

                  <Link
                    href="/docs"
                    className="inline-flex h-11 items-center rounded-full border border-foreground/15 bg-background/55 px-5 text-sm font-medium text-foreground/80 transition-colors hover:bg-background/75"
                  >
                    Documentation
                  </Link>
                </div>
              </div>
            </MagicCard>
          </BlurFade>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
