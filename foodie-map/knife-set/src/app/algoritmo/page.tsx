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
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-6">
      <section className="rounded-xl border border-border bg-card p-5">
        <h1 className="text-2xl font-semibold">Algoritmo KS</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          El score KS combina calidad ponderada + confianza por volumen de reseñas + consistencia de métricas.
          Se actualiza de forma continua para reducir sesgos y mejorar recomendación para diferentes exigencias.
        </p>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-3 text-lg font-semibold">Simulador</h2>
        <div className="space-y-3">
          {fields.map((field) => (
            <div key={field.key} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>{field.label}</span>
                <span className="text-primary">{rating[field.key].toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={0.1}
                value={rating[field.key]}
                onChange={(event) => setRating((prev) => ({ ...prev, [field.key]: Number(event.target.value) }))}
                className="w-full accent-primary"
              />
            </div>
          ))}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span>Reseñas</span>
              <span className="text-primary">{reviews}</span>
            </div>
            <input type="range" min={1} max={500} value={reviews} onChange={(event) => setReviews(Number(event.target.value))} className="w-full accent-primary" />
          </div>
          <div className="rounded-lg border border-border bg-background/40 p-3 text-sm">
            Score KS estimado: <span className="font-semibold text-primary">{score.toFixed(1)} / 100</span>
          </div>
        </div>
      </section>
    </main>
  );
}
