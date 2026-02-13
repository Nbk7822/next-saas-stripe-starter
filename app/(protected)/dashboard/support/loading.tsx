import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function SupportLoading() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <DashboardHeader
        heading="Support & Feedback"
        text="Get help quickly and send product feedback directly to the founders."
      />
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Skeleton className="h-[360px] rounded-2xl" />
        <div className="grid gap-5">
          <Skeleton className="h-[250px] rounded-2xl" />
          <Skeleton className="h-[250px] rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
