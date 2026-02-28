"use client";

import Link from "next/link";
import { PublicExplorer } from "@/features/score/public-explorer";

export default function LandingPage() {
  return (
    <main>
      {/* Hero */}
      <section className="border-b border-border bg-card/50">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-5 md:flex-row md:items-end md:justify-between md:px-6">
          <div>
            <h1 className="text-xl font-bold leading-tight md:text-2xl">
              Descubre los mejores lugares para comer en Arequipa
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Evaluaciones multi-criterio sin sesgo. Busca por nombre, categoría o distrito.
            </p>
          </div>
          <div className="mt-3 flex shrink-0 items-center gap-2 md:mt-0">
            <Link
              href="/metodologia"
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-primary/30 hover:text-foreground"
            >
              Metodología
            </Link>
            <Link
              href="/quiero-ser-mark"
              className="rounded-lg bg-primary/15 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/25"
            >
              Quiero ser MARK
            </Link>
          </div>
        </div>
      </section>

      {/* Public map explorer with search */}
      <PublicExplorer />

      {/* Feature strip */}
      <section className="border-t border-border">
        <div className="mx-auto grid max-w-7xl gap-px bg-border md:grid-cols-3">
          <article className="bg-background px-5 py-5">
            <h2 className="text-sm font-semibold">Evaluación real</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Sabor, higiene, servicio, precio-valor, autenticidad y rapidez — cada criterio tiene peso único.
            </p>
          </article>
          <article className="bg-background px-5 py-5">
            <h2 className="text-sm font-semibold">MARKS independientes</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Sin promoción pagada ni canjes. Solo evidencia de experiencia gastronómica.
            </p>
          </article>
          <article className="bg-background px-5 py-5">
            <h2 className="text-sm font-semibold">Para todos los bolsillos</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Desde puestos callejeros hasta restaurantes premium. El KS Score no discrimina por precio.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
