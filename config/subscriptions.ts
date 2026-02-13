import { PlansRow, SubscriptionPlan } from "types";
import { env } from "@/env.mjs";

export const pricingData: SubscriptionPlan[] = [
  {
    title: "Free",
    description: "Try out AI automation with limited resources",
    benefits: [
      "10 minutes of AI agent automation per month",
      "1 virtual machine and computer using agent",
      "Upload/download files from your personal machine",
      "One-click remote connection with no setup",
      "Community support",
      "Web search & browsing",
    ],
    limitations: [
      "Limited runtime quota",
      "Single machine slot",
      "No priority performance",
    ],
    prices: {
      monthly: 0,
      yearly: 0,
    },
    stripeIds: {
      monthly: null,
      yearly: null,
    },
  },
  {
    title: "Professional",
    description: "Professional-grade automation for demanding workflows",
    benefits: [
      "Unlimited AI agent automation usage",
      "1 virtual machine and computer using agent",
      "Upload/download files from your personal machine",
      "One-click remote connection with no setup",
      "Priority VM performance and faster processing",
      "Priority support with 24-hour response",
      "Unlimited projects",
      "Advanced web search and data extraction",
      "API access",
      "Custom workflows",
    ],
    limitations: ["No dedicated hardware pool", "No 1-hour support SLA"],
    prices: {
      monthly: 50,
      yearly: 500,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID,
    },
  },
  {
    title: "Enterprise",
    description:
      "Unrestricted automation with premium capabilities and priority processing",
    benefits: [
      "Unlimited premium AI automation usage",
      "1 virtual machine and computer using agent",
      "Upload/download files from your personal machine",
      "One-click remote connection with no setup",
      "Dedicated high-performance resources",
      "Premium support with 1-hour response",
      "Unlimited everything",
      "Early access to new features",
      "Custom integrations and workflows",
      "SSO authentication",
      "SLA guarantee",
    ],
    limitations: ["Contact sales required for provisioning"],
    prices: {
      monthly: 100,
      yearly: 1000,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID,
    },
  },
];

export const plansColumns = [
  "starter",
  "pro",
  "business",
  "enterprise",
] as const;

export const comparePlans: PlansRow[] = [
  {
    feature: "Access to Analytics",
    starter: true,
    pro: true,
    business: true,
    enterprise: "Custom",
    tooltip: "All plans include basic analytics for tracking performance.",
  },
  {
    feature: "Custom Branding",
    starter: null,
    pro: "500/mo",
    business: "1,500/mo",
    enterprise: "Unlimited",
    tooltip: "Custom branding is available from the Pro plan onwards.",
  },
  {
    feature: "Priority Support",
    starter: null,
    pro: "Email",
    business: "Email & Chat",
    enterprise: "24/7 Support",
  },
  {
    feature: "Advanced Reporting",
    starter: null,
    pro: null,
    business: true,
    enterprise: "Custom",
    tooltip:
      "Advanced reporting is available in Business and Enterprise plans.",
  },
  {
    feature: "Dedicated Manager",
    starter: null,
    pro: null,
    business: null,
    enterprise: true,
    tooltip: "Enterprise plan includes a dedicated account manager.",
  },
  {
    feature: "API Access",
    starter: "Limited",
    pro: "Standard",
    business: "Enhanced",
    enterprise: "Full",
  },
  {
    feature: "Monthly Webinars",
    starter: false,
    pro: true,
    business: true,
    enterprise: "Custom",
    tooltip: "Pro and higher plans include access to monthly webinars.",
  },
  {
    feature: "Custom Integrations",
    starter: false,
    pro: false,
    business: "Available",
    enterprise: "Available",
    tooltip:
      "Custom integrations are available in Business and Enterprise plans.",
  },
  {
    feature: "Roles and Permissions",
    starter: null,
    pro: "Basic",
    business: "Advanced",
    enterprise: "Advanced",
    tooltip:
      "User roles and permissions management improves with higher plans.",
  },
  {
    feature: "Onboarding Assistance",
    starter: false,
    pro: "Self-service",
    business: "Assisted",
    enterprise: "Full Service",
    tooltip: "Higher plans include more comprehensive onboarding assistance.",
  },
  // Add more rows as needed
];
