import { SidebarNavItem, SiteConfig } from "types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "LLMHub",
  description:
    "Run AI agents on isolated virtual machines directly in your browser. LLMHub gives teams a secure, deterministic, and observable execution platform.",
  url: site_url,
  ogImage: `${site_url}/_static/og.jpg`,
  links: {
    twitter: "https://x.com/llmhubdev",
    github: "https://github.com/llmhub-dev",
  },
  mailSupport: "support@llmhub.dev",
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Platform",
    items: [
      { title: "How It Works", href: "/#how-it-works" },
      { title: "Ecosystem", href: "/#ecosystem" },
      { title: "Use Cases", href: "/#use-cases" },
      { title: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Resources",
    items: [
      { title: "Documentation", href: "/docs" },
      { title: "Blog", href: "/blog" },
      { title: "Privacy", href: "/privacy" },
      { title: "Terms", href: "/terms" },
    ],
  },
  {
    title: "Company",
    items: [
      { title: "Contact", href: `mailto:${siteConfig.mailSupport}` },
      { title: "Status", href: "#" },
      { title: "Security", href: "/#runtime-proof" },
      { title: "Register", href: "/register" },
    ],
  },
];
