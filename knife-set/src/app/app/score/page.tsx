"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PlaceCard, PlaceData } from "@/features/score/place-card";

// Mock data to visualize the new component while Supabase is integrated
const MOCK_PLACES: PlaceData[] = [
  {
    id: "1",
    name: "Café Consistence",
    description: "Una cafetería de especialidad con un servicio extremadamente estandarizado. Sus granos y técnicas nunca fallan.",
    category: "Café",
    district: "Miraflores",
    address: "Av. Consistencia 123",
    average_score: 9.2,
    consistency_score: 0.45,
    total_reviews: 124,
    is_franchise: false,
    social_networks: { instagram: "@cafeconsistence" },
    interior_photos: ["https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800"]
  },
  {
    id: "2",
    name: "Ruleta de Sabor",
    description: "Restaurante fusión. Algunos días el chef principal cocina obras de arte, otros días los asistentes arruinan platos básicos.",
    category: "Restaurante",
    district: "Barranco",
    address: "Av. Volatil 456",
    average_score: 7.5,
    consistency_score: 3.2,
    total_reviews: 89,
    is_franchise: true,
    social_networks: { instagram: "@ruletasabor" },
    google_maps_url: "https://maps.google.com/?q=-12.145,-77.022",
    interior_photos: ["https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=800"]
  },
  {
    id: "3",
    name: "La Trattoria del Centro",
    description: "Especialidad en pastas caseras. Ambiente familiar. A veces la atención se satura los fines de semana, afectando levemente el score.",
    category: "Pastas",
    district: "San Isidro",
    address: "Calle Italia 881",
    average_score: 8.6,
    consistency_score: 1.8,
    total_reviews: 56,
    is_franchise: false,
    interior_photos: ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800"]
  }
];

export default function ScoreExplorer() {
  const [filter, setFilter] = useState("all");

  const filteredPlaces = MOCK_PLACES.filter(place => {
    if (filter === "titanium") return place.consistency_score < 1.0;
    if (filter === "risky") return place.consistency_score > 2.5;
    return true;
  });

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Link href="/" className="font-bold tracking-tighter text-xl">
              KNIFE<span className="text-primary">SET</span>
            </Link>
            <span className="text-xs text-white/50 bg-white/5 px-2 py-1 rounded-full border border-white/10 hidden md:block">
              KS Directory
            </span>
        </div>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/app/agenda" className="text-white/60 hover:text-white transition-colors">Agenda</Link>
          <Link href="/algoritmo" className="text-white/60 hover:text-white transition-colors">Algoritmo</Link>
          <Link href="/login" className="bg-white text-black px-4 py-2 rounded-full hover:bg-white/80 transition-colors">Entrar</Link>
        </nav>
      </header>

      {/* Explorer Content */}
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">El Ranking.</h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Descubre los lugares más consistentes de la ciudad. El puntaje que ves ya está ajustado algorítmicamente para penalizar la inconsistencia en el sabor y atención.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-10 pb-6 border-b border-white/10">
          <button 
            onClick={() => setFilter("all")}
            className={cn("px-4 py-2 text-sm rounded-full transition-all border", filter === "all" ? "bg-white text-black border-white" : "bg-transparent text-white/60 border-white/20 hover:border-white/50")}
          >
            Todos
          </button>
          <button 
            onClick={() => setFilter("titanium")}
            className={cn("px-4 py-2 text-sm rounded-full transition-all border flex items-center gap-2", filter === "titanium" ? "bg-emerald-500 text-black border-emerald-500 font-bold" : "bg-transparent text-emerald-500/80 border-emerald-500/30 hover:border-emerald-500")}
          >
            <span className="w-2 h-2 rounded-full bg-current hidden sm:block" />
            Sello Titanio (Más consistentes)
          </button>
          <button 
            onClick={() => setFilter("risky")}
            className={cn("px-4 py-2 text-sm rounded-full transition-all border flex items-center gap-2", filter === "risky" ? "bg-rose-500 text-white border-rose-500 font-bold" : "bg-transparent text-rose-500/80 border-rose-500/30 hover:border-rose-500")}
          >
            <span className="w-2 h-2 rounded-full bg-current hidden sm:block" />
            Volátiles (Alto Riesgo)
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlaces.map(place => (
            <PlaceCard key={place.id} place={place} />
          ))}
          {filteredPlaces.length === 0 && (
            <div className="col-span-full py-20 text-center text-zinc-500">
              No hay locales que coincidan con este filtro en la base de datos actual.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
