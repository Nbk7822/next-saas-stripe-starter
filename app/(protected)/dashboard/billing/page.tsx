import Link from "next/link";
import { redirect } from "next/navigation";

import { pricingData } from "@/config/subscriptions";
import { getCurrentUser } from "@/lib/session";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { constructMetadata, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/header";
import { BillingFormButton } from "@/components/forms/billing-form-button";
import { BillingInfo } from "@/components/pricing/billing-info";

export const metadata = constructMetadata({
  title: "Billing – LLMHub",
  description: "Manage plans, payment access, and runtime billing for LLMHub.",
});

const billingHighlights = [
  {
    label: "Billing Provider",
    value: "Stripe",
    detail: "Secure checkout and managed subscription lifecycle",
  },
  {
    label: "Usage Metering",
    value: "VM + Agent Runtime",
    detail: "Costs track active compute and automation activity",
  },
  {
    label: "Invoice Access",
    value: "Customer Portal",
    detail: "Download receipts, update card, and manage renewals",
  },
];

export default async function BillingPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  const userSubscriptionPlan = await getUserSubscriptionPlan(user.id);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6">
      <DashboardHeader
        heading="Billing"
        text="Manage subscription, payment operations, and plan upgrades."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {billingHighlights.map((item) => (
          <Card key={item.label} className="dashboard-card landing-hover-box">
            <CardHeader className="pb-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/55">
                {item.label}
              </p>
              <CardTitle className="font-heading text-xl">
                {item.value}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/65">{item.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <BillingInfo userSubscriptionPlan={userSubscriptionPlan} />

      <section className="landing-glass landing-hover-box rounded-2xl border-white/20 p-5 dark:border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/55">
              Current Subscription
            </p>
            <h2 className="mt-1 font-heading text-2xl">
              {userSubscriptionPlan.title}
            </h2>
            {userSubscriptionPlan.isPaid ? (
              <p className="mt-1 text-sm text-foreground/65">
                Renews on{" "}
                <span className="font-medium text-foreground/80">
                  {formatDate(userSubscriptionPlan.stripeCurrentPeriodEnd)}
                </span>
              </p>
            ) : (
              <p className="mt-1 text-sm text-foreground/65">
                Free tier active. Upgrade when you need higher runtime capacity.
              </p>
            )}
          </div>
          <Badge className="dashboard-badge rounded-full px-3 py-1 text-xs">
            {userSubscriptionPlan.interval
              ? `Billed ${userSubscriptionPlan.interval}ly`
              : "No recurring billing"}
          </Badge>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {pricingData.map((offer) => {
          const isCurrentPlan = userSubscriptionPlan.title === offer.title;
          const isFree = offer.prices.monthly === 0;

          return (
            <Card
              key={offer.title}
              className="dashboard-card landing-hover-box flex h-full flex-col border-white/20 dark:border-white/10"
            >
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="font-heading text-2xl">
                    {offer.title}
                  </CardTitle>
                  {isCurrentPlan ? (
                    <Badge className="dashboard-badge rounded-full">
                      Current
                    </Badge>
                  ) : null}
                </div>
                <p className="text-sm text-foreground/70">
                  {offer.description}
                </p>
                <div className="pt-2">
                  <p className="font-heading text-4xl">
                    ${offer.prices.monthly}
                    <span className="ml-1 font-geist text-base text-foreground/55">
                      /month
                    </span>
                  </p>
                </div>
              </CardHeader>

              <CardContent className="flex h-full flex-col">
                <ul className="space-y-2 text-sm text-foreground/70">
                  {offer.benefits.slice(0, 6).map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2">
                      <span className="mt-1 size-1.5 rounded-full bg-foreground/50" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5">
                  {isFree ? (
                    <Link
                      href="/dashboard?workspace=dashboard"
                      className="dashboard-btn inline-flex w-full items-center justify-center rounded-xl border border-white/25 bg-white/70 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-white/85 dark:border-white/15 dark:bg-black/30 dark:hover:bg-black/40"
                    >
                      Continue on Free
                    </Link>
                  ) : (
                    <BillingFormButton
                      offer={offer}
                      subscriptionPlan={userSubscriptionPlan}
                      year={false}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
