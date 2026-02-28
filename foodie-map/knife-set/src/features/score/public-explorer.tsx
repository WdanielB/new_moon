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
import { fetchPlaces, normalizePlaceForUi, type PlaceRecord } from "@/lib/ks-api";
import { PlaceCard, ScoreRing } from "./place-card";
import { Search, SlidersHorizontal, X, MapPin } from "lucide-react";

const categoryColors: Record<string, string> = {
  Restaurante: "bg-ks-rose",
  "Café": "bg-ks-amber",
  "Puesto callejero": "bg-ks-emerald",
  Mercado: "bg-ks-cyan",
};

const categories = ["Restaurante", "Café", "Puesto callejero", "Mercado"];
const priceLabels = ["", "Bajo", "Medio", "Alto", "Premium"];

export function PublicExplorer() {
  const [places, setPlaces] = useState<ReturnType<typeof normalizePlaceForUi>[]>([]);
  const [selected, setSelected] = useState("");
  const [search, setSearch] = useState("");
  const [activeCats, setActiveCats] = useState<Set<string>>(new Set());
  const [priceRange, setPriceRange] = useState<[number, number]>([1, 4]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlaces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const rows = await fetchPlaces();
      const normalized = (rows as PlaceRecord[]).map(normalizePlaceForUi);
      setPlaces(normalized);
      if (normalized.length > 0 && !selected) {
        setSelected(normalized[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando datos");
    } finally {
      setLoading(false);
    }
  }, [selected]);

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
            p.address.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
          );
        })
        .filter((p) => (activeCats.size === 0 ? true : activeCats.has(p.category)))
        .filter((p) => p.price_level >= priceRange[0] && p.price_level <= priceRange[1])
        .sort((a, b) => b.ksScore - a.ksScore),
    [places, search, activeCats, priceRange],
  );

  const selectedPlace = filtered.find((p) => p.id === selected) ?? filtered[0];

  const toggleCat = (cat: string) => {
    setActiveCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm">Cargando KS Points...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-6">
      {/* Search bar */}
      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar restaurante, café, distrito..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-9 text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex h-10 items-center gap-1.5 rounded-lg border px-3 text-sm transition ${
            showFilters || activeCats.size > 0
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border bg-card text-muted-foreground hover:text-foreground"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filtros</span>
          {activeCats.size > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {activeCats.size}
            </span>
          )}
        </button>
      </div>

      {/* Filter chips */}
      {showFilters && (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-3">
          <span className="text-xs font-medium text-muted-foreground">Categoría:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCat(cat)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                activeCats.has(cat)
                  ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="mx-1 h-4 w-px bg-border" />
          <span className="text-xs font-medium text-muted-foreground">Precio:</span>
          {[1, 2, 3, 4].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setPriceRange(([min, max]) => {
                  if (min === p && max === p) return [1, 4];
                  if (p < min) return [p, max];
                  if (p > max) return [min, p];
                  return [p, p];
                });
              }}
              className={`rounded-md px-2 py-1 text-xs font-medium transition ${
                p >= priceRange[0] && p <= priceRange[1]
                  ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {"$".repeat(p)}
            </button>
          ))}
          {(activeCats.size > 0 || priceRange[0] !== 1 || priceRange[1] !== 4) && (
            <button
              type="button"
              onClick={() => {
                setActiveCats(new Set());
                setPriceRange([1, 4]);
              }}
              className="ml-auto text-xs text-muted-foreground hover:text-destructive"
            >
              Limpiar
            </button>
          )}
        </div>
      )}

      {/* Main grid: map + list */}
      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        {/* Map */}
        <section className="overflow-hidden rounded-xl border border-border bg-card">
          <Map
            className="h-[55dvh] min-h-[400px] w-full"
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
                    className={`group relative flex items-center justify-center transition-transform hover:scale-125 ${
                      selected === place.id ? "scale-125 z-10" : ""
                    }`}
                  >
                    <span
                      className={`block h-3.5 w-3.5 rounded-full border-2 border-background shadow-lg ${
                        categoryColors[place.category] ?? "bg-muted-foreground"
                      } ${selected === place.id ? "ring-2 ring-primary ring-offset-1 ring-offset-background" : ""}`}
                    />
                    {selected === place.id && (
                      <span className="absolute -top-7 whitespace-nowrap rounded-md bg-card px-2 py-0.5 text-[10px] font-semibold shadow-lg border border-border">
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
                      <div>
                        <p className="text-xs font-medium text-primary">KS {place.ksScore.toFixed(1)}</p>
                        <p className="text-[10px] text-muted-foreground">{place.reviewCount} reviews</p>
                      </div>
                    </div>
                  </div>
                </MarkerPopup>
              </MapMarker>
            ))}
            <MapControls position="top-right" showZoom showCompass showLocate showFullscreen />
          </Map>
        </section>

        {/* Place list sidebar */}
        <section className="flex flex-col gap-3">
          {/* Stats bar */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-card px-3.5 py-2.5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>
                <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
                {filtered.length === 1 ? "lugar" : "lugares"}
                {search && <> para &quot;{search}&quot;</>}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground">Arequipa</span>
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

          {/* Scrollable results */}
          <div className="flex flex-col gap-1 overflow-y-auto rounded-lg border border-border bg-card p-1.5" style={{ maxHeight: "calc(55dvh - 140px)" }}>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground">
                <Search className="h-8 w-8 opacity-40" />
                <p className="text-sm font-medium">Sin resultados</p>
                <p className="text-xs">Intenta con otro nombre o ajusta los filtros</p>
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
        </section>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
    </div>
  );
}
