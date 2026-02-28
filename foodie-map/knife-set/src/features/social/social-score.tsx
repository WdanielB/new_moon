import { useMemo, useState } from "react";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
} from "@/components/ui/map";
import {
  AREQUIPA_CENTER,
  initialRatingDraft,
  mockFoodSpots,
  type FoodSpot,
  type VenueCategory,
} from "@/data/mock-arequipa";
import {
  calculateFoodSpotScore,
  mergeRating,
  type RatingVector,
} from "@/lib/rating";

export type SocialViewMode = "mark" | "usuarios";

type RatingEvent = {
  id: string;
  placeId: string;
  placeName: string;
  score: number;
  timestamp: string;
};

const categoryColor: Record<VenueCategory, string> = {
  Restaurante: "bg-rose-400",
  "Café": "bg-amber-300",
  "Puesto callejero": "bg-emerald-400",
  Mercado: "bg-cyan-400",
};

const metricLabels: { key: keyof RatingVector; label: string }[] = [
  { key: "sabor", label: "Sabor" },
  { key: "servicio", label: "Servicio" },
  { key: "higiene", label: "Higiene" },
  { key: "precioValor", label: "Precio / Valor" },
  { key: "autenticidad", label: "Autenticidad" },
  { key: "rapidez", label: "Rapidez" },
];

export function SocialScore({ view }: { view: SocialViewMode }) {
  const [spots, setSpots] = useState<FoodSpot[]>(mockFoodSpots);
  const [selectedSpotId, setSelectedSpotId] = useState<string>(mockFoodSpots[0].id);
  const [draftRating, setDraftRating] = useState<RatingVector>(initialRatingDraft);
  const [events, setEvents] = useState<RatingEvent[]>([]);

  const rankedSpots = useMemo(
    () =>
      [...spots]
        .map((spot) => ({
          ...spot,
          score: calculateFoodSpotScore(spot.rating, spot.reviewCount),
        }))
        .sort((a, b) => b.score - a.score),
    [spots],
  );

  const selectedSpot = spots.find((spot) => spot.id === selectedSpotId) ?? spots[0];
  const selectedSpotRank =
    rankedSpots.findIndex((spot) => spot.id === selectedSpot.id) + 1;

  const handleMetricChange = (key: keyof RatingVector, value: number) => {
    setDraftRating((previous) => ({ ...previous, [key]: value }));
  };

  const submitRating = () => {
    setSpots((previous) =>
      previous.map((spot) => {
        if (spot.id !== selectedSpot.id) {
          return spot;
        }

        return {
          ...spot,
          rating: mergeRating(spot.rating, draftRating, spot.reviewCount),
          reviewCount: spot.reviewCount + 1,
        };
      }),
    );

    const projectedCount = selectedSpot.reviewCount + 1;
    const projectedScore = calculateFoodSpotScore(draftRating, projectedCount);

    setEvents((previous) =>
      [
        {
          id: `${selectedSpot.id}-${Date.now()}`,
          placeId: selectedSpot.id,
          placeName: selectedSpot.name,
          score: projectedScore,
          timestamp: new Date().toLocaleTimeString("es-PE", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        ...previous,
      ].slice(0, 6),
    );
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 md:gap-6 md:px-6 md:py-6 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-4 rounded-xl border border-border bg-card p-3 md:p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold md:text-lg">Mapa de lugares</h2>
          <span className="text-xs text-muted-foreground">Datos mock en Arequipa</span>
        </div>

        <Map
          className="h-[45dvh] min-h-[340px] w-full overflow-hidden rounded-lg border border-border"
          theme="dark"
          center={AREQUIPA_CENTER}
          zoom={12.1}
        >
          {rankedSpots.map((spot) => (
            <MapMarker key={spot.id} longitude={spot.lng} latitude={spot.lat}>
              <MarkerContent>
                <button
                  type="button"
                  onClick={() => setSelectedSpotId(spot.id)}
                  className={`h-4 w-4 rounded-full border-2 border-background shadow-md transition-transform hover:scale-110 ${
                    categoryColor[spot.category]
                  } ${selectedSpotId === spot.id ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}
                  aria-label={`Seleccionar ${spot.name}`}
                />
              </MarkerContent>
              <MarkerPopup>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">{spot.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {spot.category} · {spot.district}
                  </p>
                  <p className="text-xs text-primary">Puntaje: {spot.score.toFixed(1)}/100</p>
                </div>
              </MarkerPopup>
            </MapMarker>
          ))}

          <MapControls
            position="top-right"
            showZoom
            showCompass
            showLocate
            showFullscreen
          />
        </Map>

        <div className="rounded-lg border border-border bg-background/50 p-3">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Lugar activo</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="text-base font-semibold">{selectedSpot.name}</h3>
            <span className="text-xs text-muted-foreground">#{selectedSpotRank} del ranking</span>
            <span className="text-xs text-primary">
              {calculateFoodSpotScore(selectedSpot.rating, selectedSpot.reviewCount).toFixed(1)}/100
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{selectedSpot.address}</p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="mb-3 text-base font-semibold md:text-lg">Top locales</h2>
          <div className="space-y-2">
            {rankedSpots.map((spot, index) => (
              <button
                key={spot.id}
                type="button"
                onClick={() => setSelectedSpotId(spot.id)}
                className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition ${
                  selectedSpotId === spot.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-background/40 hover:bg-muted/60"
                }`}
              >
                <div>
                  <p className="text-sm font-medium">
                    {index + 1}. {spot.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {spot.category} · {spot.reviewCount} reseñas
                  </p>
                </div>
                <p className="text-sm font-semibold text-primary">{spot.score.toFixed(1)}</p>
              </button>
            ))}
          </div>
        </div>

        {view === "mark" ? (
          <div className="space-y-4 rounded-xl border border-border bg-card p-4">
            <h2 className="text-base font-semibold md:text-lg">Panel de Mark</h2>
            <p className="text-sm text-muted-foreground">
              Califica con el algoritmo ponderado para sabor, higiene, servicio y valor.
            </p>

            <div className="space-y-3">
              {metricLabels.map((metric) => (
                <div key={metric.key} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <label htmlFor={metric.key}>{metric.label}</label>
                    <span className="text-primary">{draftRating[metric.key].toFixed(1)}</span>
                  </div>
                  <input
                    id={metric.key}
                    type="range"
                    min={1}
                    max={5}
                    step={0.1}
                    value={draftRating[metric.key]}
                    onChange={(event) =>
                      handleMetricChange(metric.key, Number(event.target.value))
                    }
                    className="w-full accent-primary"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={submitRating}
              className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Publicar calificación para {selectedSpot.name}
            </button>

            <div className="space-y-2 border-t border-border pt-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Últimas calificaciones
              </p>
              {events.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aún no hay publicaciones nuevas.</p>
              ) : (
                events.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-md border border-border bg-background/50 px-3 py-2"
                  >
                    <p className="text-sm font-medium">{event.placeName}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.timestamp} · Puntaje calculado {event.score.toFixed(1)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4 rounded-xl border border-border bg-card p-4">
            <h2 className="text-base font-semibold md:text-lg">Perfil del lugar</h2>
            <p className="text-sm text-muted-foreground">
              Vista pública para usuarios que buscan dónde comer o tomar café.
            </p>

            <div className="rounded-lg border border-border bg-background/50 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-semibold">{selectedSpot.name}</h3>
                <p className="text-sm font-semibold text-primary">
                  {calculateFoodSpotScore(selectedSpot.rating, selectedSpot.reviewCount).toFixed(1)}
                  {" "}/ 100
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedSpot.category} · {selectedSpot.district}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{selectedSpot.address}</p>
            </div>

            <div className="space-y-2">
              {metricLabels.map((metric) => (
                <div key={metric.key} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{metric.label}</span>
                    <span>{selectedSpot.rating[metric.key].toFixed(1)} / 5</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${(selectedSpot.rating[metric.key] / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
