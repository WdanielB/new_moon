"use client";

import { useState } from "react";
import Link from "next/link";
import { parseISO, format, isValid } from "date-fns";
import { es } from "date-fns/locale";

/* ── Mock data ──────────────────────────────────── */
const MOCK_EVENTS = [
  {
    id: "1",
    name: "Feria Gastronómica Mistura 2026",
    description:
      "El megaregreso de la feria más importante de la región. Miles de locales en un solo punto.",
    event_type: "Feria",
    location: "Costa Verde",
    start_date: "2026-09-01T10:00:00Z",
    end_date: "2026-09-10T22:00:00Z",
    average_score: 8.5,
    consistency_score: 1.2,
    total_reviews: 42,
    social_networks: { instagram: "@mistura_oficial" },
    photos: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800",
    ],
    status: "approved" as const,
  },
  {
    id: "2",
    name: "Burger Fest Vol. 3",
    description: "Festival de hamburguesas artesanales y cerveza.",
    event_type: "Festival",
    location: "Parque de la Exposición",
    start_date: "2026-11-15T12:00:00Z",
    end_date: "2026-11-17T22:00:00Z",
    average_score: 6.5,
    consistency_score: 3.1,
    total_reviews: 15,
    social_networks: { instagram: "@burgerfest" },
    photos: [
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800",
    ],
    status: "approved" as const,
  },
];

const EVENT_TYPES = ["Feria", "Festival", "Concierto", "Cultural", "Pop-Up", "Otro"];

/* ── Component ─────────────────────────────────── */
export default function AgendaPage() {
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* form state */
  const [formData, setFormData] = useState({
    name: "",
    event_type: EVENT_TYPES[0],
    location: "",
    description: "",
    start_date: "",
    end_date: "",
    instagram: "",
  });

  const formatDate = (isoString: string) => {
    try {
      const date = parseISO(isoString);
      if (!isValid(date)) return "Fecha no definida";
      return format(date, "d 'de' MMMM", { locale: es });
    } catch {
      return "Fecha no definida";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production this would POST to a Supabase RPC / insert into events with status='pending'
    console.log("Event request submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setShowForm(false);
      setSubmitted(false);
      setFormData({
        name: "",
        event_type: EVENT_TYPES[0],
        location: "",
        description: "",
        start_date: "",
        end_date: "",
        instagram: "",
      });
    }, 2500);
  };

  const filtered =
    filter === "all"
      ? MOCK_EVENTS
      : MOCK_EVENTS.filter((e) => e.event_type === filter);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold tracking-tighter text-xl">
            KNIFE<span className="text-primary">SET</span>
          </Link>
          <span className="text-xs text-white/50 bg-white/5 px-2 py-1 rounded-full border border-white/10">
            AGENDA
          </span>
        </div>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/app/score"
            className="text-white/60 hover:text-white transition-colors"
          >
            Directorio
          </Link>
          <Link
            href="/algoritmo"
            className="text-white/60 hover:text-white transition-colors"
          >
            Algoritmo
          </Link>
          <Link
            href="/login"
            className="bg-white text-black px-4 py-2 rounded-full hover:bg-white/80 transition-colors"
          >
            Entrar
          </Link>
        </nav>
      </header>

      {/* Hero + CTA */}
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-primary">
              Agenda Cultural.
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Ferias, conciertos y festivales evaluados bajo un criterio de
              organización, experiencia y precio. La consistencia también
              penaliza eventos recurrentes mal organizados.
            </p>
          </div>

          <button
            onClick={() => setShowForm((v) => !v)}
            className="shrink-0 flex items-center gap-2 bg-primary text-black font-bold text-sm px-6 py-3 rounded-full hover:brightness-110 transition-all"
          >
            {showForm ? (
              <>✕ Cerrar</>
            ) : (
              <>＋ Solicitar Evento</>
            )}
          </button>
        </div>

        {/* ── Solicitud Form ── */}
        {showForm && (
          <div className="mb-16 border border-white/10 rounded-2xl bg-zinc-950 p-6 md:p-10 max-w-2xl">
            {submitted ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">✓</div>
                <h3 className="text-xl font-bold mb-2">Solicitud Enviada</h3>
                <p className="text-gray-400 text-sm">
                  Un administrador revisará tu evento. Te notificaremos cuando
                  sea aprobado.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-1">
                    Solicitar Inclusión de Evento
                  </h3>
                  <p className="text-sm text-gray-500">
                    Completa el formulario y un administrador aprobará tu evento
                    para la agenda pública.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">
                        Nombre del evento *
                      </label>
                      <input
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors placeholder:text-gray-600"
                        placeholder="e.g. Street Food Weekend"
                      />
                    </div>
                    {/* Type */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">
                        Tipo *
                      </label>
                      <select
                        name="event_type"
                        value={formData.event_type}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                      >
                        {EVENT_TYPES.map((t) => (
                          <option key={t} value={t} className="bg-black">
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Location */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">
                        Ubicación *
                      </label>
                      <input
                        name="location"
                        required
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors placeholder:text-gray-600"
                        placeholder="Dirección o zona"
                      />
                    </div>
                    {/* Instagram */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">
                        Instagram
                      </label>
                      <input
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors placeholder:text-gray-600"
                        placeholder="@cuenta"
                      />
                    </div>
                    {/* Start Date */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">
                        Fecha Inicio *
                      </label>
                      <input
                        type="date"
                        name="start_date"
                        required
                        value={formData.start_date}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                      />
                    </div>
                    {/* End Date */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">
                        Fecha Fin *
                      </label>
                      <input
                        type="date"
                        name="end_date"
                        required
                        value={formData.end_date}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">
                      Descripción *
                    </label>
                    <textarea
                      name="description"
                      required
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors resize-none placeholder:text-gray-600"
                      placeholder="Describe brevemente el evento..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-primary text-black font-bold text-sm px-8 py-3 rounded-full hover:brightness-110 transition-all"
                  >
                    Enviar Solicitud
                  </button>
                </form>
              </>
            )}
          </div>
        )}

        {/* ── Filter Tabs ── */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {["all", ...EVENT_TYPES].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`text-xs px-4 py-2 rounded-full border transition-colors ${
                filter === t
                  ? "bg-white text-black border-white"
                  : "border-white/10 text-white/50 hover:text-white hover:border-white/30"
              }`}
            >
              {t === "all" ? "Todos" : t}
            </button>
          ))}
        </div>

        {/* ── Event Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((event) => {
            const isVolatile = event.consistency_score > 2.5;

            return (
              <div
                key={event.id}
                className="group flex flex-col md:flex-row bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all"
              >
                {/* Event Poster */}
                <div className="md:w-2/5 h-64 md:h-auto relative overflow-hidden">
                  <img
                    src={event.photos[0]}
                    alt={event.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-primary text-black font-bold text-xs px-2 py-1 rounded">
                    {event.event_type}
                  </div>
                </div>

                {/* Event Info */}
                <div className="p-6 md:w-3/5 flex flex-col relative">
                  <div className="mb-4 flex-1">
                    <div className="text-xs text-primary/80 font-mono mb-2 uppercase tracking-wider">
                      {formatDate(event.start_date)} —{" "}
                      {formatDate(event.end_date)}
                    </div>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {event.name}
                    </h3>
                    <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-zinc-500 bg-white/5 w-fit px-2 py-1 rounded">
                      <span>📍 {event.location}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-xs text-zinc-500 uppercase tracking-wider">
                        Score Global
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black">
                          {event.average_score.toFixed(1)}
                        </span>
                        {isVolatile ? (
                          <span className="text-[10px] text-rose-500 bg-rose-500/10 px-1 py-0.5 rounded border border-rose-500/20">
                            Pésima Organización
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-1 py-0.5 rounded border border-emerald-500/20">
                            Recomendado
                          </span>
                        )}
                      </div>
                    </div>

                    <button className="text-sm px-4 py-2 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-colors">
                      Ver Opiniones
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-24 text-gray-500">
              <p className="text-lg mb-2">No hay eventos de tipo &ldquo;{filter}&rdquo;</p>
              <button
                onClick={() => setFilter("all")}
                className="text-sm text-primary hover:underline"
              >
                Ver todos
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
