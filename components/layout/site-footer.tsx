import * as React from "react";
import Link from "next/link";

import { footerLinks, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/layout/mode-toggle";

import { NewsletterForm } from "../forms/newsletter-form";
import { Icons } from "../shared/icons";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn("border-t", className)}>
      <div className="container grid max-w-6xl grid-cols-2 gap-6 py-14 md:grid-cols-5">
        {footerLinks.map((section) => (
          <div key={section.title}>
            <span className="text-sm font-medium text-foreground">
              {section.title}
            </span>
            <ul className="mt-4 list-inside space-y-3">
              {section.items?.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="col-span-full flex flex-col items-end sm:col-span-1 md:col-span-2">
          <p className="mb-3 text-sm font-medium text-foreground">
            Product updates
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t py-4">
        <div className="container flex max-w-6xl flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <p className="text-left text-sm text-muted-foreground">
            <span className="font-medium text-foreground">LLMHub</span> helps
            teams run AI agents on isolated virtual machines with deterministic
            execution, auditable runs, and secure controls.
            <span className="mx-2">·</span>
            <Link
              href={`mailto:${siteConfig.mailSupport}`}
              className="font-medium underline underline-offset-4"
            >
              {siteConfig.mailSupport}
            </Link>
          </p>

          <div className="flex items-center gap-3">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              <Icons.gitHub className="size-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <ModeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
