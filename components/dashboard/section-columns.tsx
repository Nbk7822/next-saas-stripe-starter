import React from "react";

interface SectionColumnsType {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function SectionColumns({
  title,
  description,
  children,
}: SectionColumnsType) {
  return (
    <div className="grid grid-cols-1 gap-x-10 gap-y-4 border-b border-white/15 py-8 last:border-b-0 dark:border-white/10 md:grid-cols-10">
      <div className="col-span-4 space-y-1.5">
        <h2 className="font-sans text-lg font-semibold uppercase leading-none tracking-[0.06em]">
          {title}
        </h2>
        <p className="text-balance text-sm text-foreground/65">{description}</p>
      </div>
      <div className="col-span-6">{children}</div>
    </div>
  );
}
