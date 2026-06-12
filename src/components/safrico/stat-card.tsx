"use client";

import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  description?: string;
  value: string | number;
  icon?: LucideIcon;
  href?: string;
  linkLabel?: string;
  accent?: "default" | "amber" | "green";
}

const accentStyles = {
  default: "from-primary/10 to-primary/5",
  amber: "from-amber-500/15 to-amber-500/5",
  green: "from-emerald-500/15 to-emerald-500/5",
};

export function StatCard({
  title,
  description,
  value,
  icon: Icon,
  href,
  linkLabel,
  accent = "default",
}: StatCardProps) {
  return (
    <Card
      data-animate-item
      className={cn(
        "overflow-hidden border-border/60 bg-gradient-to-br shadow-sm transition-shadow hover:shadow-md",
        accentStyles[accent],
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {Icon && (
          <div className="rounded-lg bg-background/80 p-2 shadow-sm">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        {href && linkLabel && (
          <a
            href={href}
            className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
          >
            {linkLabel} →
          </a>
        )}
      </CardContent>
    </Card>
  );
}
