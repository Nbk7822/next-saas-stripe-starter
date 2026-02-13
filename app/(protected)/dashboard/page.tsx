import { constructMetadata } from "@/lib/utils";
import LLMHubDashboard from "@/components/dashboard/llmhub-dashboard";

export const metadata = constructMetadata({
  title: "Dashboard – LLMHub",
  description: "Run and automate virtual machines with AI agents.",
});

export default function DashboardPage() {
  return <LLMHubDashboard />;
}
