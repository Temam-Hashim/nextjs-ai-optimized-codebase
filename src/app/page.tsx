import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { FEATURE_FLAGS, isFeatureEnabled } from "@/core/feature-flags";

export default function Home() {
  const buyerViewEnabled = isFeatureEnabled(FEATURE_FLAGS.BUYER_INVENTORY_VIEW);

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <span className="text-lg font-semibold">Safrico</span>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </header>
      <main className="container mx-auto flex flex-1 flex-col justify-center gap-8 px-6 py-16">
        <div className="max-w-2xl">
          <p className="mb-2 text-sm font-medium text-primary">Agribusiness inventory</p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Track crops. Plan harvests. Serve buyers.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Safrico helps farm managers track crop inventory, filter by type, and share read-only
            market summaries with buyers — built with an AI-optimized Next.js stack.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/register">Get started</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/login">Farm dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/api-docs">API docs</Link>
          </Button>
          {buyerViewEnabled && (
            <Button variant="secondary" asChild>
              <Link href="/inventory">Buyer market view</Link>
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
