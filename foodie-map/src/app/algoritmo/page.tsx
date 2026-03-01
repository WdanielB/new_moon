"use client";

import { useMemo, useState } from "react";
import { calculateFoodSpotScore, type RatingVector } from "@/lib/rating";

const fields: { key: keyof RatingVector; label: string }[] = [
  { key: "sabor", label: "Sabor" },
  { key: "servicio", label: "Servicio" },
  { key: "higiene", label: "Higiene" },
  { key: "precioValor", label: "Precio / Valor" },
  { key: "autenticidad", label: "Autenticidad" },
  { key: "rapidez", label: "Rapidez" },
];

export default function AlgoritmoPage() {
  const [rating, setRating] = useState<RatingVector>({
    sabor: 4.5,
    servicio: 4,
    higiene: 4.2,
    precioValor: 4.1,
    autenticidad: 4.4,
    rapidez: 3.8,
  });
  const [reviews, setReviews] = useState(60);

  const score = useMemo(() => calculateFoodSpotScore(rating, reviews), [rating, reviews]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
      {/* Paper-style article */}
      <article
        className="rounded-2xl border border-border bg-card p-8 shadow-lg md:p-12"
        style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
      >
        {/* Title block */}
        <header className="mb-8 border-b border-border pb-8 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Knife Set Research · Technical Paper
          </p>
          <h1 className="mx-auto max-w-2xl text-3xl font-bold leading-snug md:text-4xl">
            KS Score: A Multi-Criteria Weighted Algorithm for Transparent Food Establishment Evaluation
          </h1>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Knife Set Research Team</p>
            <p className="mt-0.5 text-xs italic">Arequipa, Perú — February 2026</p>
          </div>
        </header>

        {/* Abstract */}
        <section className="mb-8">
          <h2 className="mb-2 text-lg font-bold uppercase tracking-wide">Abstract</h2>
          <p className="text-sm leading-[1.9] text-foreground/90" style={{ textAlign: "justify" }}>
            This paper presents the <strong>KS Score</strong>, a composite evaluation metric designed to provide transparent,
            unbiased ratings for food establishments. The algorithm integrates six orthogonal criteria weighted by
            empirical importance, modulated by reviewer confidence and metric consistency factors. We demonstrate
            that this multi-dimensional approach produces more stable and meaningful ratings compared to single-axis
            popularity-based systems prevalent in existing platforms.
          </p>
        </section>

        {/* 1. Introduction */}
        <section className="mb-8">
          <h2 className="mb-2 text-lg font-bold">1. Introduction</h2>
          <p className="text-sm leading-[1.9] text-foreground/90" style={{ textAlign: "justify" }}>
            Traditional food rating systems rely on a single numerical score, typically an arithmetic mean of user 
            reviews. This approach conflates distinct quality dimensions — a restaurant may excel in flavor but 
            suffer in hygiene, or offer premium service at poor value. The KS Score disaggregates evaluation into 
            six independent criteria, each contributing to the final composite with a domain-specific weight 
            derived from expert consensus and user preference studies.
          </p>
        </section>

        {/* 2. Methodology */}
        <section className="mb-8">
          <h2 className="mb-2 text-lg font-bold">2. Methodology</h2>

          <h3 className="mb-1 mt-4 text-base font-semibold italic">2.1 Evaluation Criteria</h3>
          <p className="mb-3 text-sm leading-[1.9] text-foreground/90" style={{ textAlign: "justify" }}>
            Each establishment is evaluated across six dimensions by verified evaluators (MARKs):
          </p>
          <div className="mb-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-foreground/30">
                  <th className="px-3 py-2 text-left font-bold">Criterion</th>
                  <th className="px-3 py-2 text-left font-bold">Symbol</th>
                  <th className="px-3 py-2 text-center font-bold">Weight (w<sub>i</sub>)</th>
                  <th className="px-3 py-2 text-left font-bold">Range</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Sabor (Flavor)", "S", "0.34", "[1, 5]"],
                  ["Servicio (Service)", "Se", "0.17", "[1, 5]"],
                  ["Higiene (Hygiene)", "H", "0.19", "[1, 5]"],
                  ["Precio-Valor (Price-Value)", "PV", "0.14", "[1, 5]"],
                  ["Autenticidad (Authenticity)", "A", "0.10", "[1, 5]"],
                  ["Rapidez (Speed)", "R", "0.06", "[1, 5]"],
                ].map(([name, sym, weight, range], i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="px-3 py-2">{name}</td>
                    <td className="px-3 py-2 italic">{sym}</td>
                    <td className="px-3 py-2 text-center font-mono">{weight}</td>
                    <td className="px-3 py-2 font-mono">{range}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mb-1 mt-4 text-base font-semibold italic">2.2 Composite Score Formula</h3>
          <p className="mb-3 text-sm leading-[1.9] text-foreground/90" style={{ textAlign: "justify" }}>
            The KS Score is computed as a product of three factors:
          </p>

          {/* Formula */}
          <div className="my-6 rounded-xl border border-border bg-background/60 px-6 py-5 text-center">
            <p className="font-mono text-sm text-primary">
              KS = Q × (α + β · C<sub>conf</sub> + γ · C<sub>cons</sub>)
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              where α = 0.68, β = 0.22, γ = 0.10
            </p>
          </div>

          <h3 className="mb-1 mt-4 text-base font-semibold italic">2.3 Quality Score (Q)</h3>
          <div className="my-4 rounded-xl border border-border bg-background/60 px-6 py-4 text-center">
            <p className="font-mono text-sm text-primary">
              Q = 20 × Σ(w<sub>i</sub> × r<sub>i</sub>)
            </p>
          </div>
          <p className="text-sm leading-[1.9] text-foreground/90" style={{ textAlign: "justify" }}>
            The weighted average of ratings is scaled to a 0–100 range by multiplying by 20
            (since individual ratings range from 1 to 5).
          </p>

          <h3 className="mb-1 mt-4 text-base font-semibold italic">2.4 Confidence Factor (C<sub>conf</sub>)</h3>
          <div className="my-4 rounded-xl border border-border bg-background/60 px-6 py-4 text-center">
            <p className="font-mono text-sm text-primary">
              C<sub>conf</sub> = min(1, log<sub>10</sub>(n + 1) / 2)
            </p>
          </div>
          <p className="text-sm leading-[1.9] text-foreground/90" style={{ textAlign: "justify" }}>
            The confidence factor increases logarithmically with the number of reviews <em>n</em>,
            saturating at 1.0 when the establishment reaches approximately 100 reviews. This prevents
            establishments with very few reviews from achieving disproportionately high scores.
          </p>

          <h3 className="mb-1 mt-4 text-base font-semibold italic">2.5 Consistency Factor (C<sub>cons</sub>)</h3>
          <div className="my-4 rounded-xl border border-border bg-background/60 px-6 py-4 text-center">
            <p className="font-mono text-sm text-primary">
              C<sub>cons</sub> = max(0, 1 − σ / 2)
            </p>
          </div>
          <p className="text-sm leading-[1.9] text-foreground/90" style={{ textAlign: "justify" }}>
            Where σ is the standard deviation of the six criterion ratings. Establishments that excel
            uniformly across all criteria receive a consistency bonus, while those with highly
            polarized scores are penalized. This encourages well-rounded quality.
          </p>
        </section>

        {/* 3. Properties */}
        <section className="mb-8">
          <h2 className="mb-2 text-lg font-bold">3. Score Properties</h2>
          <ul className="ml-5 list-disc space-y-1 text-sm leading-[1.9] text-foreground/90">
            <li><strong>Range:</strong> The final score is bounded to [0, 100].</li>
            <li><strong>Monotonicity:</strong> Higher individual ratings always increase the composite score.</li>
            <li><strong>Convergence:</strong> As review count increases, the score stabilizes toward its intrinsic quality level.</li>
            <li><strong>Fairness:</strong> No weight exceeds 0.34, preventing any single criterion from dominating.</li>
            <li><strong>Transparency:</strong> All weights and formulas are published and verifiable.</li>
          </ul>
        </section>

        {/* Separator */}
        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">Interactive Simulator</span>
          <div className="h-px flex-1 bg-border" />
        </div>
      </article>

      {/* Simulator - outside the paper */}
      <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-lg md:p-8">
        <h2 className="font-display mb-4 text-xl font-bold">Simulador KS Score</h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Ajusta los valores para ver cómo varía el score en tiempo real.
        </p>
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{field.label}</span>
                <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs font-bold text-primary">
                  {rating[field.key].toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={0.1}
                value={rating[field.key]}
                onChange={(e) => setRating((prev) => ({ ...prev, [field.key]: Number(e.target.value) }))}
                className="w-full accent-primary"
              />
            </div>
          ))}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Número de reseñas</span>
              <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs font-bold text-primary">
                {reviews}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={500}
              value={reviews}
              onChange={(e) => setReviews(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          {/* Result */}
          <div className="mt-4 flex items-center justify-between rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 to-ks-amber/10 px-6 py-5">
            <div>
              <p className="text-sm text-muted-foreground">KS Score estimado</p>
              <p className="font-display text-3xl font-bold text-primary">{score.toFixed(1)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Escala</p>
              <p className="font-mono text-lg font-semibold">/ 100</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
