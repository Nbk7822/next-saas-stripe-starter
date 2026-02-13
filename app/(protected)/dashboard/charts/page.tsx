import { constructMetadata } from "@/lib/utils";
import { AiVmAnalyticsDashboard } from "@/components/charts/ai-vm-analytics-dashboard";
import { DashboardHeader } from "@/components/dashboard/header";

export const metadata = constructMetadata({
  title: "AI Runtime Charts – LLMHub",
  description:
    "Analytics for agent throughput, VM usage, execution quality, and spend.",
});

export default function ChartsPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6">
      <DashboardHeader
        heading="AI & VM Analytics"
        text="Track runtime throughput, agent quality, token usage, and infrastructure spend."
      />
      <AiVmAnalyticsDashboard />
    </div>
  );
}
