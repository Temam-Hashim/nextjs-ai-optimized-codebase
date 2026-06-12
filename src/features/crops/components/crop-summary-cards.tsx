"use client";

import { useEffect, useState } from "react";

import { StatCard } from "@/components/safrico/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { CROP_TYPE_LABELS } from "@/features/crops/labels";
import type { CropType } from "@/features/crops/schemas";
import { useGsapStagger } from "@/hooks/use-gsap-stagger";

interface SummaryItem {
  cropType: CropType;
  totalQuantity: number;
  cropCount: number;
}

export function CropSummaryCards() {
  const gridRef = useGsapStagger<HTMLDivElement>({ delay: 0.05 });
  const [items, setItems] = useState<SummaryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/crops/summary");
        if (response.ok) {
          const data = (await response.json()) as { items: SummaryItem[] };
          setItems(data.items);
        }
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  const totalKg = items.reduce((sum, item) => sum + item.totalQuantity, 0);

  return (
    <div ref={gridRef} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total inventory"
        description="All crop types"
        value={`${totalKg.toLocaleString()} kg`}
        accent="green"
      />
      {items.map((item) => (
        <StatCard
          key={item.cropType}
          title={CROP_TYPE_LABELS[item.cropType]}
          description={`${item.cropCount} crop${item.cropCount === 1 ? "" : "s"}`}
          value={`${item.totalQuantity.toLocaleString()} kg`}
        />
      ))}
    </div>
  );
}
