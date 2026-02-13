"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Github,
  Instagram,
  Linkedin,
  Sparkles,
  Youtube,
} from "lucide-react";

import { BlurFade } from "@/components/ui/blur-fade";
import { MagicCard } from "@/components/ui/magic-card";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

type SocialIconProps = {
  className?: string;
};

const XBrandIcon = ({ className }: SocialIconProps) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
    className={className}
    fill="currentColor"
  >
    <path d="M18.901 1.154h3.68l-8.042 9.191L24 22.846h-7.406l-5.8-7.584-6.633 7.584H.48l8.6-9.83L0 1.154h7.594l5.243 6.932zM17.61 20.644h2.038L6.486 3.24H4.298z" />
  </svg>
);

const RedditBrandIcon = ({ className }: SocialIconProps) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
    className={className}
    fill="currentColor"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="9" cy="12" r="1.25" fill="white" />
    <circle cx="15" cy="12" r="1.25" fill="white" />
    <path
      d="M8 15c1 .9 2.3 1.4 4 1.4s3-.5 4-1.4"
      stroke="white"
      strokeWidth="1.6"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="18.7" cy="8.2" r="1.4" fill="white" />
    <path
      d="M13.1 8.4l3.3-.2"
      stroke="white"
      strokeWidth="1.4"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

const socials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/llmhub.dev/",
    icon: Instagram,
    iconClassName: "text-[#E4405F]",
  },
  {
    label: "X",
    href: "https://x.com/llmhub_dev",
    icon: XBrandIcon,
    iconClassName: "text-black dark:text-white",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/llmhub/",
    icon: Linkedin,
    iconClassName: "text-[#0A66C2]",
  },
  {
    label: "GitHub",
    href: "https://github.com/LLmHub-dev",
    icon: Github,
    iconClassName: "text-[#171515] dark:text-white",
  },
  {
    label: "Reddit",
    href: "https://www.reddit.com/r/LLMHub_agents/",
    icon: RedditBrandIcon,
    iconClassName: "text-[#FF4500]",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@LLMHub-dev",
    icon: Youtube,
    iconClassName: "text-[#FF0000]",
  },
];

const reviews = [
  {
    quote:
      "LLMHub replaced our brittle local scripts with repeatable VM runs the whole team can trust.",
    author: "Product Lead",
    company: "AI Automation Studio",
  },
  {
    quote:
      "The biggest win is control. We can run agents fast while keeping execution isolated and auditable.",
    author: "Engineering Manager",
    company: "Workflow Systems",
  },
  {
    quote:
      "From prototype to production, agent workflows feel clean, deterministic, and easier to operate.",
    author: "Founder",
    company: "Ops-first Startup",
  },
];

const features = [
  {
    title: "Isolated Virtual Machines",
    body: "Spin up clean, isolated execution space on demand. No local setup, no environment drift, no hidden machine state.",
  },
  {
    title: "Automatic VM Switching",
    body: "Move between task contexts without friction. Workloads transition across runtime states while your flow stays uninterrupted.",
  },
  {
    title: "Storage Provided",
    body: "Keep files, projects, and session artifacts persistent across runs so your agent workflows remain continuous.",
  },
  {
    title: "Unlimited Requests",
    body: "Run as many AI actions as your plan allows in-session, with a system designed for sustained, high-frequency automation.",
  },
  {
    title: "Unlimited Web Search",
    body: "Browse, extract, and analyze internet data at scale with always-on research capability inside the same runtime.",
  },
];

interface PricingPlan {
  name: string;
  subtitle: string;
  price: string;
  period: string;
  usage: string;
  usageLabel: string;
  cta: string;
  popular?: boolean;
  features: string[];
}

const plans: PricingPlan[] = [
  {
    name: "Free",
    subtitle: "Try out AI automation with limited resources",
    price: "$0",
    period: "/forever",
    usage: "10 minutes",
    usageLabel: "AI agent automation per month",
    cta: "Start Free",
    features: [
      "1 virtual machine and computer using agent",
      "Upload/download files from your personal machine",
      "One-click remote connection - no setup required",
      "Community support",
      "Web search & browsing",
    ],
  },
  {
    name: "Professional",
    subtitle: "Professional-grade automation for demanding workflows",
    price: "$50",
    period: "/per month",
    usage: "Unlimited Usage*",
    usageLabel: "AI agent automation per month",
    cta: "Go Professional",
    popular: true,
    features: [
      "1 virtual machine and computer using agent",
      "Upload/download files from your personal machine",
      "One-click remote connection - no setup required",
      "Priority VM performance & faster processing",
      "Priority support with 24hr response",
      "Unlimited projects",
      "Advanced web search & data extraction",
      "API access",
      "Custom workflows",
    ],
  },
  {
    name: "Enterprise",
    subtitle:
      "Unrestricted automation with premium capabilities and priority processing",
    price: "$100",
    period: "/per month",
    usage: "Unlimited Premium*",
    usageLabel: "AI agent automation per month",
    cta: "Get Enterprise",
    features: [
      "1 virtual machine and computer using agent",
      "Upload/download files from your personal machine",
      "One-click remote connection - no setup required",
      "Dedicated high-performance resources",
      "Premium support with 1hr response",
      "Unlimited everything",
      "Early access to new features",
      "Custom integrations & workflows",
      "SSO authentication",
      "SLA guarantee",
    ],
  },
];

const sectionTitleClass =
  "text-[11px] font-semibold tracking-[0.22em] text-foreground/55";

export function LlmhubProfileLayout() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const ensurePlaying = () => {
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.playsInline = true;
      const playPromise = video.play();
      if (playPromise) {
        playPromise.catch(() => {
          // Autoplay might be blocked by browser policy.
        });
      }
    };

    const playFromStart = () => {
      video.currentTime = 0;
      ensurePlaying();
    };

    const onCanPlay = () => {
      ensurePlaying();
    };

    const onVisibilityChange = () => {
      if (!document.hidden) {
        ensurePlaying();
      }
    };

    const onFocus = () => {
      ensurePlaying();
    };

    video.addEventListener("loadeddata", onCanPlay);
    video.addEventListener("canplay", onCanPlay);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("focus", onFocus);

    playFromStart();
    const rafAttempt = window.requestAnimationFrame(ensurePlaying);
    const delayedAttempt = window.setTimeout(ensurePlaying, 450);
    const keepAlive = window.setInterval(() => {
      if (!document.hidden && video.paused) {
        ensurePlaying();
      }
    }, 5000);

    return () => {
      window.cancelAnimationFrame(rafAttempt);
      window.clearTimeout(delayedAttempt);
      window.clearInterval(keepAlive);
      video.removeEventListener("loadeddata", onCanPlay);
      video.removeEventListener("canplay", onCanPlay);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("focus", onFocus);
      video.pause();
    };
  }, []);

  return (
    <section id="top" className="relative py-10 md:py-14">
      <MaxWidthWrapper className="font-geist">
        <div className="mx-auto max-w-[1220px] space-y-5">
          <BlurFade inView>
            <section
              id="open-source"
              className="landing-glass landing-hover-box rounded-3xl"
            >
              <div className="grid xl:grid-cols-[1fr_3fr]">
                <div className="border-foreground/12 border-b p-6 md:p-7 xl:border-b-0 xl:border-r">
                  <p className={sectionTitleClass}>Open source</p>
                  <h2 className="mt-3 font-sans text-3xl font-bold leading-[1.05] text-foreground md:text-4xl">
                    We are open source!!
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-foreground/65">
                    Build with us in public. Star, fork, and contribute to our
                    open computer use project.
                  </p>
                  <Link
                    href="https://github.com/LLmHub-dev/open-computer-use"
                    target="_blank"
                    rel="noreferrer"
                    className="landing-hover-tab mt-6 inline-flex items-center gap-2 rounded-2xl border border-foreground/15 bg-background/80 px-4 py-3 text-sm font-semibold tracking-[0.08em] text-foreground/85 transition-colors hover:border-foreground/35"
                  >
                    <Github className="size-4" />
                    We are Open Source!!
                    <ArrowUpRight className="size-4" />
                  </Link>
                </div>

                <div className="landing-hover-box p-2 md:p-3">
                  <video
                    ref={videoRef}
                    className="pointer-events-none h-[220px] w-full select-none rounded-[1.4rem] border border-foreground/15 bg-black object-cover md:h-[340px]"
                    autoPlay
                    muted
                    loop
                    playsInline
                    disablePictureInPicture
                    preload="auto"
                  >
                    <source src="/landingvid-web.m4v" type="video/mp4" />
                    <source src="/landingvid.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
            </section>
          </BlurFade>

          <BlurFade inView delay={0.08}>
            <section
              id="features"
              className="landing-glass landing-hover-box rounded-3xl p-6 md:p-7"
            >
              <p className={sectionTitleClass}>Features</p>
              <h2 className="mt-3 font-sans text-3xl font-bold leading-[1.05] text-foreground md:text-5xl">
                Engineered for continuous agent work.
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {features.map((feature, index) => (
                  <div
                    key={feature.title}
                    className="landing-hover-box border-foreground/12 rounded-3xl border bg-background/70 p-5"
                  >
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-foreground/45">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-4 font-sans text-2xl font-bold leading-tight text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-foreground/68 mt-3 text-sm leading-relaxed">
                      {feature.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </BlurFade>

          <BlurFade inView delay={0.14}>
            <section
              id="reviews"
              className="landing-glass landing-hover-box rounded-3xl"
            >
              <div className="grid xl:grid-cols-[3fr_1fr]">
                <div className="p-6 md:p-7">
                  <p className={sectionTitleClass}>Reviews</p>
                  <h2 className="mt-3 font-sans text-3xl font-bold leading-[1.05] text-foreground md:text-5xl">
                    What builders say.
                  </h2>

                  <div className="mt-6 grid gap-4 lg:grid-cols-2">
                    {reviews.map((review) => (
                      <MagicCard
                        key={review.author + review.company}
                        className="landing-hover-box h-full rounded-3xl border border-foreground/10 bg-background/75 p-px"
                        gradientColor="#8B7CFF"
                        gradientFrom="#9787ff"
                        gradientTo="#6a5cff"
                        gradientOpacity={0.1}
                        gradientSize={210}
                      >
                        <article className="flex h-full flex-col rounded-[1.4rem] bg-background/95 p-5">
                          <p className="font-sans text-lg font-semibold leading-snug text-foreground md:text-xl">
                            {review.quote}
                          </p>
                          <div className="mt-5 border-t border-foreground/10 pt-4">
                            <p className="font-mono text-xs uppercase tracking-[0.14em] text-foreground/55">
                              {review.author}
                            </p>
                            <p className="text-foreground/68 mt-1 text-sm">
                              {review.company}
                            </p>
                          </div>
                        </article>
                      </MagicCard>
                    ))}
                  </div>
                </div>

                <aside
                  id="social-links"
                  className="border-foreground/12 border-t p-6 md:p-7 xl:border-l xl:border-t-0"
                >
                  <h3 className={sectionTitleClass}>Social links</h3>
                  <div className="mt-4 grid gap-3">
                    {socials.map((social) => {
                      const Icon = social.icon;

                      return (
                        <Link
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noreferrer"
                          className="landing-hover-tab group flex h-16 items-center justify-between rounded-2xl border border-foreground/15 bg-background/80 px-4 text-foreground/85 transition-colors hover:border-foreground/35"
                        >
                          <span className="inline-flex items-center gap-2.5 text-sm font-medium tracking-[0.12em]">
                            <Icon
                              className={`size-4 shrink-0 ${social.iconClassName}`}
                            />
                            {social.label}
                          </span>
                          <ArrowUpRight className="size-4 text-foreground/45 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </Link>
                      );
                    })}
                  </div>
                </aside>
              </div>
            </section>
          </BlurFade>

          <BlurFade inView delay={0.2}>
            <section
              id="pricing"
              className="landing-glass landing-hover-box rounded-3xl p-6 md:p-7"
            >
              <p className={sectionTitleClass}>Pricing</p>
              <h2 className="mt-3 font-sans text-3xl font-bold leading-[1.05] text-foreground md:text-5xl">
                Pick your automation tier.
              </h2>

              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {plans.map((plan) => (
                  <MagicCard
                    key={plan.name}
                    className="landing-hover-box h-full rounded-3xl border border-foreground/10 bg-background/75 p-px"
                    gradientColor="#8B7CFF"
                    gradientFrom="#9787ff"
                    gradientTo="#6a5cff"
                    gradientOpacity={plan.popular ? 0.24 : 0.12}
                    gradientSize={230}
                  >
                    <article className="relative flex h-full flex-col rounded-[1.4rem] bg-background/95 p-5">
                      {plan.popular ? (
                        <span className="mb-4 inline-flex w-fit items-center gap-1 rounded-full border border-violet-400/35 bg-violet-500/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-violet-700 dark:text-violet-300">
                          <Sparkles className="size-3.5" />
                          Most Popular
                        </span>
                      ) : null}

                      <h3 className="font-sans text-2xl font-bold text-foreground">
                        {plan.name}
                      </h3>
                      <p className="mt-2 min-h-[56px] text-sm leading-relaxed text-foreground/65">
                        {plan.subtitle}
                      </p>

                      <div className="mt-5">
                        <div className="flex items-end gap-2">
                          <span className="font-sans text-4xl font-bold leading-none text-foreground">
                            {plan.price}
                          </span>
                          <span className="pb-1 text-sm text-foreground/65">
                            {plan.period}
                          </span>
                        </div>

                        <p className="mt-3 font-mono text-sm uppercase tracking-[0.12em] text-foreground/70">
                          {plan.usage}
                        </p>
                        <p className="mt-1 text-sm text-foreground/60">
                          {plan.usageLabel}
                        </p>
                      </div>

                      <ul className="mt-5 flex-1 space-y-2.5">
                        {plan.features.map((feature) => (
                          <li
                            key={feature}
                            className="text-foreground/72 flex items-start gap-2.5 text-sm"
                          >
                            <Check className="mt-px size-4 shrink-0 text-foreground/60" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Link
                        href="/register"
                        className="landing-hover-tab mt-6 inline-flex items-center justify-center gap-2 rounded-2xl border border-foreground/15 bg-foreground px-4 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90"
                      >
                        {plan.cta}
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </article>
                  </MagicCard>
                ))}
              </div>
            </section>
          </BlurFade>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
