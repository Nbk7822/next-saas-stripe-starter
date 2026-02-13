import { DashboardHeader } from "@/components/dashboard/header";
import { SkeletonSection } from "@/components/shared/section-skeleton";

export default function ProfileLoading() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <DashboardHeader
        heading="Profile"
        text="Edit your identity, contact details, and avatar."
      />
      <div className="landing-glass divide-y divide-white/15 rounded-2xl px-5 pb-2 dark:divide-white/10">
        <SkeletonSection />
        <SkeletonSection />
        <SkeletonSection />
      </div>
    </div>
  );
}
