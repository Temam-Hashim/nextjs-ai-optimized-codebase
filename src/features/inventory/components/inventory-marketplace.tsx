"use client";

import { Package, TrendingUp } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/safrico/page-header";
import { StatCard } from "@/components/safrico/stat-card";
import { Button } from "@/components/ui/button";
import { CROP_TYPE_LABELS } from "@/features/crops/labels";
import type { CropType } from "@/features/crops/schemas";
import { useGsapStagger } from "@/hooks/use-gsap-stagger";

interface SummaryRow {
  cropType: CropType;
  totalQuantity: number;
  cropCount: number;
}

interface InventoryMarketplaceProps {
  summary: SummaryRow[];
  totalKg: number;
}

export function InventoryMarketplace({ summary, totalKg }: InventoryMarketplaceProps) {
  const gridRef = useGsapStagger<HTMLDivElement>({ delay: 0.1 });

  return (
    <div className="safrico-page-bg min-h-screen">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package className="h-5 w-5 text-primary" />
            Safrico Market
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/api-docs">API</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/login">Farm login</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto flex flex-col gap-8 px-4 py-10 lg:px-8">
        <PageHeader
          badge="Buyer view · Read only"
          title="Regional crop marketplace"
          description="Aggregated availability across Safrico partner farms. No farm identities or owner data exposed."
        />

        <div ref={gridRef} className="grid gap-5 lg:grid-cols-4">
          <StatCard
            title="Total available"
            description="All crop categories"
            value={`${totalKg.toLocaleString()} kg`}
            icon={TrendingUp}
            accent="green"
          />
          {summary.map((row) => (
            <StatCard
              key={row.cropType}
              title={CROP_TYPE_LABELS[row.cropType]}
              description={`${row.cropCount} listing${row.cropCount === 1 ? "" : "s"}`}
              value={`${row.totalQuantity.toLocaleString()} kg`}
              accent="default"
            />
          ))}
        </div>

        {summary.length === 0 && (
          <p
            data-animate-item
            className="safrico-panel rounded-xl border-dashed p-12 text-center text-muted-foreground"
          >
            No inventory published yet. Check back after farms update their stock.
          </p>
        )}
      </main>
    </div>
  );
}
