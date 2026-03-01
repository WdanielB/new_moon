"use client";

import { RequireAuth } from "@/components/route-guards";
import { ScoreExplorer } from "@/features/score/score-explorer";

export default function UsuariosAppPage() {
  return (
    <RequireAuth>
      <main>
        <div className="mx-auto max-w-7xl px-4 pt-6 md:px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Knife Set App</p>
          <h1 className="text-2xl font-semibold">Vista Usuarios</h1>
          <p className="text-sm text-muted-foreground">Explora y busca KS Points por calificación y características.</p>
        </div>
        <ScoreExplorer mode="usuarios" />
      </main>
    </RequireAuth>
  );
}
