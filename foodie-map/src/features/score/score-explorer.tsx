"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
} from "@/components/ui/map";
import { AREQUIPA_CENTER } from "@/data/mock-arequipa";
import {
  createPlaceRequest,
  createReview,
  fetchPlaces,
  normalizePlaceForUi,
  type PlaceRecord,
} from "@/lib/ks-api";
import type { RatingVector } from "@/lib/rating";
import { PlaceCard, ScoreRing } from "./place-card";
import { Search, X, Plus, Star } from "lucide-react";

type Mode = "usuarios" | "mark";

const categoryColors: Record<string, string> = {
  Restaurante: "bg-ks-rose",
  "Café": "bg-ks-amber",
  "Puesto callejero": "bg-ks-emerald",
  Mercado: "bg-ks-cyan",
};

const metrics: { key: keyof RatingVector; label: string; icon: string }[] = [
  { key: "sabor", label: "Sabor", icon: "🍴" },
  { key: "servicio", label: "Servicio", icon: "🤝" },
  { key: "higiene", label: "Higiene", icon: "✨" },
  { key: "precioValor", label: "Precio/Valor", icon: "💰" },
  { key: "autenticidad", label: "Autenticidad", icon: "🌿" },
  { key: "rapidez", label: "Rapidez", icon: "⚡" },
];

const initialDraft: RatingVector = {
  sabor: 4.2,
  servicio: 4,
  higiene: 4,
  precioValor: 4,
  autenticidad: 4,
  rapidez: 3.8,
};

const categories = ["Restaurante", "Café", "Puesto callejero", "Mercado"];

export function ScoreExplorer({ mode }: { mode: Mode }) {
  const [places, setPlaces] = useState<ReturnType<typeof normalizePlaceForUi>[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const [ratingDraft, setRatingDraft] = useState<RatingVector>(initialDraft);
  const [reviewComment, setReviewComment] = useState("");

  const [requestForm, setRequestForm] = useState({
    name: "",
    category: "Restaurante",
    district: "Cercado",
    address: "",
    lat: -16.4,
    lng: -71.53,
    price_level: 2,
    notes: "",
  });

  const loadPlaces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const rows = await fetchPlaces();
      const normalized = (rows as PlaceRecord[]).map(normalizePlaceForUi);
      setPlaces(normalized);
      if (normalized.length > 0) {
        setSelected((prev) => prev || normalized[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando places");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPlaces();
  }, [loadPlaces]);

  const filtered = useMemo(
    () =>
      places
        .filter((p) => {
          if (!search) return true;
          const q = search.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.district.toLowerCase().includes(q) ||
            p.address.toLowerCase().includes(q)
          );
        })
        .filter((p) => (category === "all" ? true : p.category === category))
        .sort((a, b) => b.ksScore - a.ksScore),
    [places, search, category],
  );

  const selectedPlace = filtered.find((p) => p.id === selected) ?? filtered[0];

  const handleSubmitReview = async () => {
    if (!selectedPlace) return;
    try {
      await createReview(selectedPlace.id, ratingDraft, reviewComment || "Evaluación KS.");
      setReviewComment("");
      setSubmitSuccess("Review publicada correctamente");
      setTimeout(() => setSubmitSuccess(null), 3000);
      await loadPlaces();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar review");
    }
  };

  const handleRequestPoint = async () => {
    try {
      await createPlaceRequest({
        ...requestForm,
        lat: Number(requestForm.lat),
        lng: Number(requestForm.lng),
        price_level: Number(requestForm.price_level),
      });
      setRequestForm({
        name: "",
        category: "Restaurante",
        district: "Cercado",
        address: "",
        lat: -16.4,
        lng: -71.53,
        price_level: 2,
        notes: "",
      });
      setShowRequestForm(false);
      setSubmitSuccess("Solicitud enviada correctamente");
      setTimeout(() => setSubmitSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear solicitud");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm">Cargando KS Points...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 md:gap-5 md:px-6 md:py-6 xl:grid-cols-[1.1fr_0.9fr]">
      {/* Left column: map + filters */}
      <section className="space-y-3">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <Map
            className="h-[48dvh] min-h-[340px] w-full"
            theme="dark"
            center={AREQUIPA_CENTER}
            zoom={12.5}
          >
            {filtered.map((place) => (
              <MapMarker key={place.id} longitude={place.lng} latitude={place.lat}>
                <MarkerContent>
                  <button
                    type="button"
                    onClick={() => setSelected(place.id)}
                    className={`group relative transition-transform hover:scale-125 ${
                      selected === place.id ? "scale-125 z-10" : ""
                    }`}
                  >
                    <span
                      className={`block h-3.5 w-3.5 rounded-full border-2 border-background shadow-lg ${
                        categoryColors[place.category] ?? "bg-muted-foreground"
                      } ${selected === place.id ? "ring-2 ring-primary ring-offset-1 ring-offset-background" : ""}`}
                    />
                    {selected === place.id && (
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-card px-2 py-0.5 text-[10px] font-semibold shadow-lg border border-border">
                        {place.name}
                      </span>
                    )}
                  </button>
                </MarkerContent>
                <MarkerPopup>
                  <div className="rounded-lg border border-border bg-card p-3 shadow-xl min-w-[180px]">
                    <p className="font-semibold text-sm">{place.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{place.category} · {place.district}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <ScoreRing score={place.ksScore} size={32} />
                      <p className="text-xs font-medium text-primary">KS {place.ksScore.toFixed(1)}</p>
                    </div>
                  </div>
                </MarkerPopup>
              </MapMarker>
            ))}
            <MapControls position="top-right" showZoom showCompass showLocate showFullscreen />
          </Map>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-8 text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Buscar por nombre o distrito..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <select
            className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary/40 focus:outline-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">Todas</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Selected place detail */}
        {selectedPlace && (
          <PlaceCard
            name={selectedPlace.name}
            category={selectedPlace.category}
            district={selectedPlace.district}
            address={selectedPlace.address}
            ksScore={selectedPlace.ksScore}
            reviewCount={selectedPlace.reviewCount}
            priceLevel={selectedPlace.price_level}
            selected
            rank={filtered.indexOf(selectedPlace) + 1}
          />
        )}

        {/* Success toast */}
        {submitSuccess && (
          <div className="rounded-lg border border-ks-emerald/30 bg-ks-emerald/10 px-4 py-2.5 text-sm text-ks-emerald">
            {submitSuccess}
          </div>
        )}
      </section>

      {/* Right column: ranking + actions */}
      <section className="flex flex-col gap-4">
        {/* Ranking list */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold">Ranking KS</h3>
            <span className="text-[11px] text-muted-foreground">{filtered.length} lugares</span>
          </div>
          <div className="flex flex-col gap-0.5 overflow-y-auto p-1.5" style={{ maxHeight: mode === "mark" ? "28vh" : "45vh" }}>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
                <Search className="h-6 w-6 opacity-40" />
                <p className="text-sm">Sin resultados</p>
              </div>
            ) : (
              filtered.map((place, i) => (
                <PlaceCard
                  key={place.id}
                  name={place.name}
                  category={place.category}
                  district={place.district}
                  address={place.address}
                  ksScore={place.ksScore}
                  reviewCount={place.reviewCount}
                  priceLevel={place.price_level}
                  selected={place.id === selected}
                  rank={i + 1}
                  compact
                  onClick={() => setSelected(place.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* MARK review form */}
        {mode === "mark" && selectedPlace && (
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Star className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Calificar &ldquo;{selectedPlace.name}&rdquo;</h3>
            </div>
            <div className="space-y-3 p-4">
              {metrics.map((m) => (
                <div key={m.key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5">
                      <span>{m.icon}</span>
                      <span>{m.label}</span>
                    </span>
                    <span className="tabular-nums font-semibold text-primary">{ratingDraft[m.key].toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={0.1}
                    value={ratingDraft[m.key]}
                    onChange={(e) =>
                      setRatingDraft((prev) => ({ ...prev, [m.key]: Number(e.target.value) }))
                    }
                    className="w-full accent-primary"
                  />
                </div>
              ))}
              <textarea
                className="h-16 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Comentario de evaluación (opcional)"
              />
              <button
                type="button"
                onClick={() => void handleSubmitReview()}
                className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Publicar evaluación
              </button>
            </div>
          </div>
        )}

        {/* Request new point toggle */}
        <button
          type="button"
          onClick={() => setShowRequestForm(!showRequestForm)}
          className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm transition ${
            showRequestForm
              ? "border-primary/30 bg-primary/5 text-primary"
              : "border-border bg-card text-muted-foreground hover:text-foreground"
          }`}
        >
          <Plus className="h-4 w-4" />
          <span className="font-medium">Solicitar nuevo KS Point</span>
        </button>

        {showRequestForm && (
          <div className="space-y-2.5 rounded-xl border border-border bg-card p-4">
            <input
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none"
              placeholder="Nombre del lugar"
              value={requestForm.name}
              onChange={(e) => setRequestForm((p) => ({ ...p, name: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary/40 focus:outline-none"
                value={requestForm.category}
                onChange={(e) => setRequestForm((p) => ({ ...p, category: e.target.value }))}
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <input
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none"
                placeholder="Distrito"
                value={requestForm.district}
                onChange={(e) => setRequestForm((p) => ({ ...p, district: e.target.value }))}
              />
            </div>
            <input
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none"
              placeholder="Dirección"
              value={requestForm.address}
              onChange={(e) => setRequestForm((p) => ({ ...p, address: e.target.value }))}
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                step="0.0001"
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none"
                placeholder="Lat"
                value={requestForm.lat}
                onChange={(e) => setRequestForm((p) => ({ ...p, lat: Number(e.target.value) }))}
              />
              <input
                type="number"
                step="0.0001"
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none"
                placeholder="Lng"
                value={requestForm.lng}
                onChange={(e) => setRequestForm((p) => ({ ...p, lng: Number(e.target.value) }))}
              />
              <select
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary/40 focus:outline-none"
                value={requestForm.price_level}
                onChange={(e) => setRequestForm((p) => ({ ...p, price_level: Number(e.target.value) }))}
              >
                <option value={1}>$ Bajo</option>
                <option value={2}>$$ Medio</option>
                <option value={3}>$$$ Alto</option>
                <option value={4}>$$$$ Premium</option>
              </select>
            </div>
            <textarea
              className="h-16 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none"
              placeholder="Notas adicionales"
              value={requestForm.notes}
              onChange={(e) => setRequestForm((p) => ({ ...p, notes: e.target.value }))}
            />
            <button
              type="button"
              onClick={() => void handleRequestPoint()}
              className="w-full rounded-lg border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/20"
            >
              Enviar solicitud
            </button>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
      </section>
    </div>
  );
}
