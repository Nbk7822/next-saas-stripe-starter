import { ReactNode } from "react";

import { cn } from "@/lib/utils";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

interface SectionShellProps {
  id?: string;
  eyebrow?: string;
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function SectionShell({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  contentClassName,
}: SectionShellProps) {
  return (
    <section id={id} className={cn("relative py-20 md:py-28", className)}>
      <MaxWidthWrapper>
        <div className="mx-auto max-w-5xl">
          <div className="max-w-3xl">
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/55">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="mt-4 text-pretty text-3xl font-semibold leading-tight text-foreground md:text-5xl md:leading-tight">
              {title}
            </h2>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-foreground/70 md:text-lg">
              {description}
            </p>
          </div>
          <div className={cn("mt-10 md:mt-12", contentClassName)}>
            {children}
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
