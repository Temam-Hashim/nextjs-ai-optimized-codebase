"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CROP_TYPE_LABELS } from "@/features/crops/labels";
import type { CropType } from "@/features/crops/schemas";

interface SummaryItem {
  cropType: CropType;
  totalQuantity: number;
  cropCount: number;
}

export function CropSummaryCards() {
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total inventory</CardTitle>
          <CardDescription>All crop types</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalKg.toLocaleString()} kg</p>
        </CardContent>
      </Card>
      {items.map((item) => (
        <Card key={item.cropType}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{CROP_TYPE_LABELS[item.cropType]}</CardTitle>
            <CardDescription>{item.cropCount} crop{item.cropCount === 1 ? "" : "s"}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{item.totalQuantity.toLocaleString()} kg</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
