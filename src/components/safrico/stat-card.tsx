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

const iconAccentStyles = {
  default: "text-primary",
  amber: "text-amber-600",
  green: "text-primary",
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
      className="safrico-panel overflow-hidden transition-shadow hover:shadow-md"
    >
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {Icon && (
          <div className="rounded-md bg-muted p-2">
            <Icon className={cn("h-4 w-4", iconAccentStyles[accent])} />
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
