"use client";

import Link from "next/link";
import { PublicExplorer } from "@/features/score/public-explorer";
import { MapPin, Star, Shield, TrendingUp, Users, Utensils } from "lucide-react";

export default function LandingPage() {
  return (
    <main>
      {/* Hero with gradient */}
      <section className="hero-gradient relative overflow-hidden border-b border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 md:flex-row md:items-end md:justify-between md:px-6 md:py-14">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-ks-amber">
              Arequipa · Perú
            </p>
            <h1 className="font-display text-3xl font-bold leading-[1.15] tracking-tight md:text-4xl lg:text-5xl">
              Descubre los{" "}
              <span className="hero-gradient-text">mejores lugares</span>
              <br />
              para comer en Arequipa
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Evaluaciones multi-criterio sin sesgo. Sabor, higiene, servicio y más — cada criterio tiene peso único en nuestro score KS.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/metodologia"
              className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition hover:border-primary/30 hover:text-foreground"
            >
              Metodología
            </Link>
            <Link
              href="/quiero-ser-mark"
              className="rounded-xl bg-gradient-to-r from-primary to-ks-amber px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition hover:shadow-lg hover:brightness-110"
            >
              Quiero ser MARK
            </Link>
          </div>
        </div>
      </section>

      {/* Public map explorer with search */}
      <PublicExplorer />

      {/* Feature strip - inspired by Airbnb/TripAdvisor */}
      <section className="border-t border-border">
        <div className="mx-auto grid max-w-7xl gap-px bg-border md:grid-cols-3">
          <article className="group bg-background px-6 py-7 transition hover:bg-card/50">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-ks-rose/15 transition group-hover:scale-110">
              <Utensils className="h-5 w-5 text-ks-rose" />
            </div>
            <h2 className="font-display text-base font-semibold">Evaluación Real</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Sabor, higiene, servicio, precio-valor, autenticidad y rapidez — cada criterio evaluado independientemente.
            </p>
          </article>
          <article className="group bg-background px-6 py-7 transition hover:bg-card/50">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-ks-amber/15 transition group-hover:scale-110">
              <Users className="h-5 w-5 text-ks-amber" />
            </div>
            <h2 className="font-display text-base font-semibold">MARKS Independientes</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Sin promoción pagada ni canjes. Solo evaluadores verificados con evidencia de experiencia gastronómica.
            </p>
          </article>
          <article className="group bg-background px-6 py-7 transition hover:bg-card/50">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-ks-emerald/15 transition group-hover:scale-110">
              <TrendingUp className="h-5 w-5 text-ks-emerald" />
            </div>
            <h2 className="font-display text-base font-semibold">Para Todos los Bolsillos</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Desde puestos callejeros hasta restaurantes premium. El KS Score no discrimina por precio.
            </p>
          </article>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-card/30">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-12 text-center md:px-6">
          <h2 className="font-display text-2xl font-bold md:text-3xl">
            ¿Conoces un lugar que merece ser evaluado?
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Regístrate y sugiere nuevos KS Points. Los evaluadores MARK verificarán tu recomendación.
          </p>
          <div className="flex gap-3">
            <Link
              href="/registro"
              className="rounded-xl bg-gradient-to-r from-primary to-ks-amber px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:shadow-lg hover:brightness-110"
            >
              Crear cuenta gratis
            </Link>
            <Link
              href="/sobre"
              className="rounded-xl border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition hover:border-primary/30 hover:text-foreground"
            >
              Saber más
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
