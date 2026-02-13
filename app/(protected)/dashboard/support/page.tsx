import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { SupportFeedbackForms } from "@/components/dashboard/support-feedback-forms";

export const metadata = constructMetadata({
  title: "Support & Feedback – LLMHub",
  description: "Send support requests and product feedback directly to LLMHub.",
});

export default async function SupportPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <DashboardHeader
        heading="Support & Feedback"
        text="Get help quickly and send product feedback directly to the founders."
      />
      <SupportFeedbackForms />
    </div>
  );
}
