"use client";

import { FolderKanban, Leaf, Store, User } from "lucide-react";

import { PageHeader } from "@/components/safrico/page-header";
import { StatCard } from "@/components/safrico/stat-card";
import { HarvestAlerts } from "@/features/crops/components/harvest-alerts";
import { CropSummaryCards } from "@/features/crops/components/crop-summary-cards";
import { useGsapStagger } from "@/hooks/use-gsap-stagger";

interface DashboardOverviewProps {
  userEmail: string;
  userId: string;
  lastSignIn: string | null;
  cropCount: number;
  projectCount: number;
  buyerViewEnabled: boolean;
}

export function DashboardOverview({
  userEmail,
  userId,
  lastSignIn,
  cropCount,
  projectCount,
  buyerViewEnabled,
}: DashboardOverviewProps) {
  const gridRef = useGsapStagger<HTMLDivElement>({ delay: 0.15 });

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Operations dashboard"
        description="Real-time crop inventory, harvest planning, and market visibility for your agribusiness."
        badge="Farm manager"
      />

      <HarvestAlerts />

      <CropSummaryCards />

      <div ref={gridRef} className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Account"
          description={userEmail}
          value={userId.slice(0, 8) + "…"}
          icon={User}
          accent="green"
        />
        <StatCard
          title="Crop inventory"
          description="Active listings"
          value={cropCount}
          icon={Leaf}
          href="/dashboard/crops"
          linkLabel="Manage crops"
          accent="green"
        />
        <StatCard
          title="Projects"
          description="Farm initiatives"
          value={projectCount}
          icon={FolderKanban}
          href="/dashboard/projects"
          linkLabel="Manage projects"
        />
        {buyerViewEnabled && (
          <StatCard
            title="Marketplace"
            description="Buyer read-only view"
            value="Live"
            icon={Store}
            href="/inventory"
            linkLabel="View market"
            accent="amber"
          />
        )}
      </div>

      <div
        data-animate-item
        className="safrico-panel rounded-xl p-6 text-sm text-muted-foreground"
      >
        Last sign in:{" "}
        <span className="font-medium text-foreground">
          {lastSignIn ? new Date(lastSignIn).toLocaleString() : "N/A"}
        </span>
      </div>
    </div>
  );
}
