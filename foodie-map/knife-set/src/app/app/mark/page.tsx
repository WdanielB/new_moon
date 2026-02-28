"use client";

import { RequireRole } from "@/components/route-guards";
import { ScoreExplorer } from "@/features/score/score-explorer";

export default function MarkAppPage() {
  return (
    <RequireRole role="mark">
      <main>
        <div className="mx-auto max-w-7xl px-4 pt-6 md:px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Knife Set App</p>
          <h1 className="text-2xl font-semibold">Vista MARK</h1>
          <p className="text-sm text-muted-foreground">Califica points y mejora el score KS con criterio técnico.</p>
        </div>
        <ScoreExplorer mode="mark" />
      </main>
    </RequireRole>
  );
}
