"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CROP_TYPE_LABELS } from "@/features/crops/labels";
import type { CropType } from "@/features/crops/schemas";

interface AlertItem {
  id: string;
  name: string;
  cropType: CropType;
  quantity: number;
  harvestDate: string;
  daysUntilHarvest: number;
}

export function HarvestAlerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/crops/alerts");
        if (response.ok) {
          const data = (await response.json()) as { items: AlertItem[] };
          setAlerts(data.items);
        }
      } finally {
        setLoaded(true);
      }
    }
    void load();
  }, []);

  if (!loaded || alerts.length === 0) {
    return null;
  }

  return (
    <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          Harvest alerts
        </CardTitle>
        <CardDescription>Crops harvesting within the next 7 days</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-background p-3 text-sm"
          >
            <div>
              <span className="font-medium">{alert.name}</span>
              <span className="mx-2 text-muted-foreground">·</span>
              <span>{CROP_TYPE_LABELS[alert.cropType]}</span>
              <span className="mx-2 text-muted-foreground">·</span>
              <span>{alert.quantity} kg</span>
            </div>
            <Badge variant={alert.daysUntilHarvest <= 2 ? "destructive" : "secondary"}>
              {alert.daysUntilHarvest === 0
                ? "Today"
                : `${alert.daysUntilHarvest} day${alert.daysUntilHarvest === 1 ? "" : "s"}`}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
