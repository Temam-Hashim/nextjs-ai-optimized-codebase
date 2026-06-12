"use client";

import { useGsapFadeIn } from "@/hooks/use-gsap-stagger";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, badge, action }: PageHeaderProps) {
  const ref = useGsapFadeIn<HTMLDivElement>();

  return (
    <div ref={ref} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {badge && (
          <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {badge}
          </span>
        )}
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}
