"use client";

import { useState } from "react";
import Link from "next/link";
import { parseISO, format, isValid } from "date-fns";
import { es } from "date-fns/locale";

/* ── Types ──────────────────────────────────────── */
type EventStatus = "pending" | "approved" | "rejected";

interface EventRecord {
  id: string;
  name: string;
  description: string;
  event_type: string;
  location: string;
  start_date: string;
  end_date: string;
  instagram?: string;
  status: EventStatus;
  submitted_by: string;
  created_at: string;
}

/* ── Mock data (simulates Supabase rows) ─────── */
const MOCK_EVENTS: EventRecord[] = [
  {
    id: "p1",
    name: "Street Food Weekend",
    description: "Fin de semana con 30 puestos de comida callejera gourmet.",
    event_type: "Festival",
    location: "Parque Selva Alegre",
    start_date: "2026-06-20T10:00:00Z",
    end_date: "2026-06-22T22:00:00Z",
    instagram: "@streetfoodaqp",
    status: "pending",
    submitted_by: "usuario123@gmail.com",
    created_at: "2026-01-15T08:00:00Z",
  },
  {
    id: "p2",
    name: "Noche de Pisco y Jazz",
    description: "Cata de piscos artesanales con jazz en vivo.",
    event_type: "Cultural",
    location: "Casona Libertad",
    start_date: "2026-07-10T19:00:00Z",
    end_date: "2026-07-10T23:00:00Z",
    status: "pending",
    submitted_by: "maria_mark@ks.pe",
    created_at: "2026-01-18T10:30:00Z",
  },
  {
    id: "a1",
    name: "Feria Gastronómica Mistura 2026",
    description: "El megaregreso de la feria más importante de la región.",
    event_type: "Feria",
    location: "Costa Verde",
    start_date: "2026-09-01T10:00:00Z",
    end_date: "2026-09-10T22:00:00Z",
    instagram: "@mistura_oficial",
    status: "approved",
    submitted_by: "admin@knifeset.pe",
    created_at: "2025-12-01T08:00:00Z",
  },
  {
    id: "a2",
    name: "Burger Fest Vol. 3",
    description: "Festival de hamburguesas artesanales y cerveza.",
    event_type: "Festival",
    location: "Parque de la Exposición",
    start_date: "2026-11-15T12:00:00Z",
    end_date: "2026-11-17T22:00:00Z",
    instagram: "@burgerfest",
    status: "approved",
    submitted_by: "admin@knifeset.pe",
    created_at: "2025-12-05T08:00:00Z",
  },
];

const EVENT_TYPES = ["Feria", "Festival", "Concierto", "Cultural", "Pop-Up", "Otro"];

/* ── Component ─────────────────────────────────── */
export default function AdminEventosPage() {
  const [events, setEvents] = useState<EventRecord[]>(MOCK_EVENTS);
  const [tab, setTab] = useState<"pending" | "approved" | "rejected" | "create">("pending");

  /* Create form state */
  const [newEvent, setNewEvent] = useState({
    name: "",
    event_type: EVENT_TYPES[0],
    location: "",
    description: "",
    start_date: "",
    end_date: "",
    instagram: "",
  });
  const [created, setCreated] = useState(false);

  /* ── helpers ── */
  const fmtDate = (iso: string) => {
    try {
      const d = parseISO(iso);
      return isValid(d) ? format(d, "d MMM yyyy", { locale: es }) : "—";
    } catch {
      return "—";
    }
  };

  const countByStatus = (s: EventStatus) => events.filter((e) => e.status === s).length;

  /* ── actions ── */
  const approve = (id: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "approved" as const } : e))
    );
  };

  const reject = (id: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "rejected" as const } : e))
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const record: EventRecord = {
      id: `new-${Date.now()}`,
      ...newEvent,
      status: "approved",
      submitted_by: "admin@knifeset.pe",
      created_at: new Date().toISOString(),
    };
    setEvents((prev) => [record, ...prev]);
    setCreated(true);
    setTimeout(() => {
      setCreated(false);
      setTab("approved");
      setNewEvent({
        name: "",
        event_type: EVENT_TYPES[0],
        location: "",
        description: "",
        start_date: "",
        end_date: "",
        instagram: "",
      });
    }, 1500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setNewEvent((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const filtered = tab === "create" ? [] : events.filter((e) => e.status === tab);

  /* ── status badge ── */
  const Badge = ({ status }: { status: EventStatus }) => {
    const styles = {
      pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      rejected: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    const labels = { pending: "Pendiente", approved: "Aprobado", rejected: "Rechazado" };
    return (
      <span className={`text-[10px] px-2 py-0.5 rounded border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold tracking-tighter text-xl">
            KNIFE<span className="text-primary">SET</span>
          </Link>
          <span className="text-xs text-white/50 bg-white/5 px-2 py-1 rounded-full border border-white/10">
            ADMIN · EVENTOS
          </span>
        </div>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/app/agenda" className="text-white/60 hover:text-white transition-colors">
            Ver Agenda Pública
          </Link>
          <Link href="/app/score" className="text-white/60 hover:text-white transition-colors">
            Directorio
          </Link>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2">
          Gestión de Eventos
        </h1>
        <p className="text-gray-500 text-sm mb-10">
          Aprueba solicitudes de usuarios, crea eventos directamente y administra la agenda.
        </p>

        {/* ── Tabs ── */}
        <div className="flex gap-2 mb-10 border-b border-white/10 pb-4 flex-wrap">
          {(
            [
              { key: "pending" as const, label: "Pendientes", count: countByStatus("pending") },
              { key: "approved" as const, label: "Aprobados", count: countByStatus("approved") },
              { key: "rejected" as const, label: "Rechazados", count: countByStatus("rejected") },
              { key: "create" as const, label: "＋ Crear Evento", count: undefined as number | undefined },
            ]
          ).map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`text-sm px-5 py-2 rounded-full border transition-all ${
                tab === key
                  ? key === "create"
                    ? "bg-primary text-black border-primary font-bold"
                    : "bg-white text-black border-white font-bold"
                  : "border-white/10 text-white/50 hover:text-white hover:border-white/30"
              }`}
            >
              {label}
              {count !== undefined && (
                <span className="ml-1.5 text-[10px] opacity-60">({count})</span>
              )}
            </button>
          ))}
        </div>

        {/* ── Create Form Tab ── */}
        {tab === "create" && (
          <div className="border border-white/10 rounded-2xl bg-zinc-950 p-6 md:p-10 max-w-2xl">
            {created ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">✓</div>
                <h3 className="text-xl font-bold mb-2">Evento Creado</h3>
                <p className="text-gray-400 text-sm">
                  El evento fue publicado directamente en la agenda.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold mb-1">Crear Evento (Admin)</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Este evento se publica directamente sin necesidad de aprobación.
                </p>

                <form onSubmit={handleCreate} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">
                        Nombre *
                      </label>
                      <input
                        name="name"
                        required
                        value={newEvent.name}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors placeholder:text-gray-600"
                        placeholder="Nombre del evento"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">
                        Tipo *
                      </label>
                      <select
                        name="event_type"
                        value={newEvent.event_type}
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
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">
                        Ubicación *
                      </label>
                      <input
                        name="location"
                        required
                        value={newEvent.location}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors placeholder:text-gray-600"
                        placeholder="Dirección"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">
                        Instagram
                      </label>
                      <input
                        name="instagram"
                        value={newEvent.instagram}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors placeholder:text-gray-600"
                        placeholder="@cuenta"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">
                        Fecha Inicio *
                      </label>
                      <input
                        type="date"
                        name="start_date"
                        required
                        value={newEvent.start_date}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">
                        Fecha Fin *
                      </label>
                      <input
                        type="date"
                        name="end_date"
                        required
                        value={newEvent.end_date}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">
                      Descripción *
                    </label>
                    <textarea
                      name="description"
                      required
                      rows={3}
                      value={newEvent.description}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors resize-none placeholder:text-gray-600"
                      placeholder="Detalle del evento..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-primary text-black font-bold text-sm px-8 py-3 rounded-full hover:brightness-110 transition-all"
                  >
                    Publicar Evento
                  </button>
                </form>
              </>
            )}
          </div>
        )}

        {/* ── Event List ── */}
        {tab !== "create" && (
          <div className="space-y-4">
            {filtered.length === 0 && (
              <div className="text-center py-20 text-gray-600">
                <p className="text-lg mb-1">Sin eventos {tab === "pending" ? "pendientes" : tab === "approved" ? "aprobados" : "rechazados"}</p>
                <p className="text-sm text-gray-700">Los eventos aparecerán aquí cuando los usuarios envíen solicitudes.</p>
              </div>
            )}

            {filtered.map((ev) => (
              <div
                key={ev.id}
                className="border border-white/10 rounded-xl bg-zinc-950 p-5 flex flex-col md:flex-row md:items-center gap-4"
              >
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 className="font-bold text-lg truncate">{ev.name}</h3>
                    <Badge status={ev.status} />
                    <span className="text-[10px] text-gray-600 bg-white/5 px-2 py-0.5 rounded">
                      {ev.event_type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-1 mb-2">{ev.description}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span>📍 {ev.location}</span>
                    <span>
                      📅 {fmtDate(ev.start_date)} — {fmtDate(ev.end_date)}
                    </span>
                    {ev.instagram && <span>📸 {ev.instagram}</span>}
                    <span className="text-gray-600">Enviado por: {ev.submitted_by}</span>
                  </div>
                </div>

                {/* Actions */}
                {ev.status === "pending" && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => approve(ev.id)}
                      className="text-sm px-5 py-2 bg-emerald-600 text-white font-medium rounded-full hover:bg-emerald-500 transition-colors"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => reject(ev.id)}
                      className="text-sm px-5 py-2 bg-white/5 border border-white/10 text-white/60 font-medium rounded-full hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-colors"
                    >
                      Rechazar
                    </button>
                  </div>
                )}

                {ev.status === "rejected" && (
                  <button
                    onClick={() => approve(ev.id)}
                    className="text-sm px-5 py-2 bg-white/5 border border-white/10 text-white/60 font-medium rounded-full hover:text-white hover:border-white/30 transition-colors shrink-0"
                  >
                    Reactivar
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
