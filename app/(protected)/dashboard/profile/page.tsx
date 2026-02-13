import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DeleteAccountSection } from "@/components/dashboard/delete-account";
import { DashboardHeader } from "@/components/dashboard/header";
import { ProfileEditorForm } from "@/components/forms/profile-editor-form";

export const metadata = constructMetadata({
  title: "Profile – LLMHub",
  description: "Manage your personal profile details and account identity.",
});

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <DashboardHeader
        heading="Profile"
        text="Edit your identity, contact details, and avatar."
      />

      <ProfileEditorForm
        user={{
          id: user.id,
          name: user.name || "",
          email: user.email || "",
          image: user.image || "",
          role: user.role,
        }}
      />

      <div className="landing-glass rounded-2xl border-white/20 px-5 py-2 dark:border-white/10">
        <DeleteAccountSection />
      </div>
    </div>
  );
}
