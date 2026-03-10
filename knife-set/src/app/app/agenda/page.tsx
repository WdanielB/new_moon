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
const SUPABASE_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

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

  const toggleForm = () => {
    setShowForm((value) => !value);
    setSubmitted(false);
  };

  return (
    <main className="min-h-screen bg-background px-4 py-4 text-foreground md:px-6 md:py-6">
      <a
        href="#agenda-contenido"
        className="absolute left-4 top-4 z-[60] -translate-y-16 bg-[#f4ead6] px-4 py-2 text-sm font-semibold text-[#24170f] transition-transform focus:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5f3527] focus-visible:ring-offset-2 focus-visible:ring-offset-[#efe3c7]"
      >
        Saltar a la agenda
      </a>

      <div className="newspaper-shell mx-auto max-w-7xl overflow-hidden">
        <header className="border-b border-[#6e573f] px-5 py-4 md:px-8 md:py-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="newspaper-kicker">Edicion de agenda</p>
              <Link href="/" className="mt-1 block text-4xl font-bold uppercase tracking-[0.12em] text-[#1b140f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5f3527]">
                Knife Set
              </Link>
            </div>
            <span className="border border-[#7f674d] px-3 py-2 text-xs uppercase tracking-[0.26em] text-[#4b3727]">
              Agenda cultural
            </span>
            <nav className="flex flex-wrap items-center gap-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#302218] md:text-sm">
              <Link href="/app/score" className="hover:text-[#6b3525] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5f3527]">
                Directorio
              </Link>
              <Link href="/algoritmo" className="hover:text-[#6b3525] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5f3527]">
                Algoritmo
              </Link>
              <Link href="/login" className="hover:text-[#6b3525] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5f3527]">
                Redaccion
              </Link>
            </nav>
          </div>
        </header>

        <div id="agenda-contenido" className="px-5 py-6 md:px-8 md:py-8">
        <section className="mb-8 newspaper-panel p-6 md:p-8" aria-labelledby="agenda-title">
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="newspaper-kicker mb-3">
                Agenda central
              </p>
              <h1 id="agenda-title" className="mb-4 text-5xl font-bold tracking-tight text-[#5f3527] md:text-7xl">
                Agenda Cultural.
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-[#3f2e22]">
                Ferias, conciertos y festivales evaluados por organizacion, experiencia y precio.
                La consistencia tambien penaliza eventos recurrentes mal ejecutados.
              </p>
            </div>

            <button
              type="button"
              onClick={toggleForm}
              aria-expanded={showForm}
              aria-controls="solicitud-evento"
              className="newspaper-button-primary shrink-0 gap-2"
            >
              {showForm ? <>✕ Cerrar formulario</> : <>＋ Solicitar evento</>}
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3" aria-label="Resumen de estado">
            <div className="newspaper-panel p-4">
              <p className="mb-1 text-xs uppercase tracking-[0.2em] text-[#6b3525]">Eventos visibles</p>
              <p className="text-3xl font-bold text-[#1b140f]">{filtered.length}</p>
              <p className="mt-2 text-sm leading-6 text-[#4b3727]">La portada de eventos ahora tiene prioridad dentro del producto.</p>
            </div>
            <div className="newspaper-panel p-4">
              <p className="mb-1 text-xs uppercase tracking-[0.2em] text-[#6b3525]">Fuente de datos</p>
              <p className="text-lg font-bold text-[#1b140f]">{SUPABASE_CONFIGURED ? "Supabase disponible" : "Modo demo"}</p>
              <p className="mt-2 text-sm leading-6 text-[#4b3727]">
                {SUPABASE_CONFIGURED
                  ? "Hay variables publicas de Supabase. Esta vista aun usa datos mock hasta conectar lecturas reales."
                  : "No hay variables publicas de Supabase en este workspace. La agenda sigue con datos mock."}
              </p>
            </div>
            <div className="newspaper-panel p-4">
              <p className="mb-1 text-xs uppercase tracking-[0.2em] text-[#6b3525]">MCP</p>
              <p className="text-lg font-bold text-[#1b140f]">No detectado en repo</p>
              <p className="mt-2 text-sm leading-6 text-[#4b3727]">No se encontro una configuracion MCP de Supabase en el repositorio.</p>
            </div>
          </div>
        </section>

        <section className="mb-12" aria-labelledby="solicitudes-title">
          <h2 id="solicitudes-title" className="sr-only">
            Solicitudes de nuevos eventos
          </h2>

          <div aria-live="polite" className="sr-only">
            {submitted ? "Solicitud enviada correctamente" : showForm ? "Formulario de solicitud abierto" : "Formulario de solicitud cerrado"}
          </div>

          <div>
          {showForm && (
            <div
              id="solicitud-evento"
              className="newspaper-panel max-w-2xl p-6 md:p-10"
            >
            {submitted ? (
              <div className="py-12 text-center" role="status" aria-live="polite">
                <div className="text-5xl mb-4">✓</div>
                <h3 className="mb-2 text-3xl font-semibold text-[#1b140f]">Solicitud Enviada</h3>
                <p className="text-sm leading-6 text-[#4b3727]">
                  Un administrador revisara tu evento. Te notificaremos cuando
                  sea aprobado.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="mb-1 text-3xl font-semibold text-[#1b140f]">
                    Solicitar Inclusión de Evento
                  </h3>
                  <p className="text-sm leading-6 text-[#4b3727]">
                    Completa el formulario y un administrador aprobara tu evento
                    para la agenda pública.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="event-name" className="mb-1.5 block text-xs uppercase tracking-wider text-[#4b3727]">
                        Nombre del evento *
                      </label>
                      <input
                        id="event-name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-[#8d7359] bg-[#fbf5e7] px-4 py-2.5 text-sm text-[#24170f] transition-colors placeholder:text-[#8b7a66] focus:outline-none focus-visible:border-[#5f3527] focus-visible:ring-2 focus-visible:ring-[#b88a6e]/40"
                        placeholder="e.g. Street Food Weekend"
                      />
                    </div>
                    <div>
                      <label htmlFor="event-type" className="mb-1.5 block text-xs uppercase tracking-wider text-[#4b3727]">
                        Tipo *
                      </label>
                      <select
                        id="event-type"
                        name="event_type"
                        value={formData.event_type}
                        onChange={handleChange}
                        className="w-full border border-[#8d7359] bg-[#fbf5e7] px-4 py-2.5 text-sm text-[#24170f] transition-colors focus:outline-none focus-visible:border-[#5f3527] focus-visible:ring-2 focus-visible:ring-[#b88a6e]/40"
                      >
                        {EVENT_TYPES.map((t) => (
                          <option key={t} value={t} className="bg-[#fbf5e7] text-[#24170f]">
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="event-location" className="mb-1.5 block text-xs uppercase tracking-wider text-[#4b3727]">
                        Ubicación *
                      </label>
                      <input
                        id="event-location"
                        name="location"
                        required
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full border border-[#8d7359] bg-[#fbf5e7] px-4 py-2.5 text-sm text-[#24170f] transition-colors placeholder:text-[#8b7a66] focus:outline-none focus-visible:border-[#5f3527] focus-visible:ring-2 focus-visible:ring-[#b88a6e]/40"
                        placeholder="Direccion o zona"
                      />
                    </div>
                    <div>
                      <label htmlFor="event-instagram" className="mb-1.5 block text-xs uppercase tracking-wider text-[#4b3727]">
                        Instagram
                      </label>
                      <input
                        id="event-instagram"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleChange}
                        className="w-full border border-[#8d7359] bg-[#fbf5e7] px-4 py-2.5 text-sm text-[#24170f] transition-colors placeholder:text-[#8b7a66] focus:outline-none focus-visible:border-[#5f3527] focus-visible:ring-2 focus-visible:ring-[#b88a6e]/40"
                        placeholder="@cuenta"
                      />
                    </div>
                    <div>
                      <label htmlFor="event-start" className="mb-1.5 block text-xs uppercase tracking-wider text-[#4b3727]">
                        Fecha Inicio *
                      </label>
                      <input
                        id="event-start"
                        type="date"
                        name="start_date"
                        required
                        value={formData.start_date}
                        onChange={handleChange}
                        className="w-full border border-[#8d7359] bg-[#fbf5e7] px-4 py-2.5 text-sm text-[#24170f] transition-colors focus:outline-none focus-visible:border-[#5f3527] focus-visible:ring-2 focus-visible:ring-[#b88a6e]/40"
                      />
                    </div>
                    <div>
                      <label htmlFor="event-end" className="mb-1.5 block text-xs uppercase tracking-wider text-[#4b3727]">
                        Fecha Fin *
                      </label>
                      <input
                        id="event-end"
                        type="date"
                        name="end_date"
                        required
                        value={formData.end_date}
                        onChange={handleChange}
                        className="w-full border border-[#8d7359] bg-[#fbf5e7] px-4 py-2.5 text-sm text-[#24170f] transition-colors focus:outline-none focus-visible:border-[#5f3527] focus-visible:ring-2 focus-visible:ring-[#b88a6e]/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="event-description" className="mb-1.5 block text-xs uppercase tracking-wider text-[#4b3727]">
                      Descripcion *
                    </label>
                    <textarea
                      id="event-description"
                      name="description"
                      required
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full resize-none border border-[#8d7359] bg-[#fbf5e7] px-4 py-2.5 text-sm text-[#24170f] transition-colors placeholder:text-[#8b7a66] focus:outline-none focus-visible:border-[#5f3527] focus-visible:ring-2 focus-visible:ring-[#b88a6e]/40"
                      placeholder="Describe brevemente el evento..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="newspaper-button-primary"
                  >
                    Enviar Solicitud
                  </button>
                </form>
              </>
            )}
            </div>
          )}
          </div>
        </section>

        <section aria-labelledby="resultados-title">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 id="resultados-title" className="text-4xl font-bold tracking-tight text-[#1b140f] md:text-5xl">
                Eventos destacados y accesibles
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[#4b3727]">
                Filtra por tipo para revisar la agenda. El estado de recomendacion se basa en estabilidad operativa y consistencia de la experiencia.
              </p>
            </div>
            <p className="text-sm text-[#6b3525]" aria-live="polite">
              Mostrando {filtered.length} {filtered.length === 1 ? "evento" : "eventos"} para el filtro {filter === "all" ? "Todos" : filter}.
            </p>
          </div>

          <div className="mb-8 flex flex-wrap gap-2" role="toolbar" aria-label="Filtrar eventos por tipo">
          {["all", ...EVENT_TYPES].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilter(t)}
              aria-pressed={filter === t}
              className={`text-xs px-4 py-2 rounded-full border transition-colors ${
                filter === t
                  ? "border-[#5f3527] bg-[#5f3527] text-[#f4ead6]"
                  : "border-[#8d7359] text-[#4b3727] hover:border-[#5f3527] hover:text-[#1b140f]"
              }`}
            >
              {t === "all" ? "Todos" : t}
            </button>
          ))}
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {filtered.map((event) => {
            const isVolatile = event.consistency_score > 2.5;

            return (
              <article
                key={event.id}
                className="newspaper-panel group flex flex-col overflow-hidden transition-all hover:border-[#5f3527] md:flex-row"
                aria-labelledby={`event-${event.id}`}
              >
                <div className="md:w-2/5 h-64 md:h-auto relative overflow-hidden">
                  <img
                    src={event.photos[0]}
                    alt={`Imagen promocional de ${event.name}`}
                    className="newspaper-photo h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4 border border-[#5f3527] bg-[#f4ead6] px-2 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#5f3527]">
                    {event.event_type}
                  </div>
                </div>

                <div className="p-6 md:w-3/5 flex flex-col relative">
                  <div className="mb-4 flex-1">
                    <div className="mb-2 text-xs uppercase tracking-[0.18em] text-[#6b3525]">
                      {formatDate(event.start_date)} —{" "}
                      {formatDate(event.end_date)}
                    </div>
                    <h3 id={`event-${event.id}`} className="mb-2 text-4xl font-semibold leading-none text-[#1b140f] transition-colors group-hover:text-[#5f3527]">
                      {event.name}
                    </h3>
                    <p className="mb-4 text-sm leading-7 text-[#4b3727] line-clamp-3">
                      {event.description}
                    </p>

                    <div className="w-fit border border-dashed border-[#8d7359] px-2 py-1 text-xs uppercase tracking-[0.12em] text-[#4b3727]">
                      <span>Ubicacion: {event.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#8d7359] pt-4">
                    <div className="flex flex-col">
                      <span className="text-xs uppercase tracking-[0.18em] text-[#6b3525]">
                        Score Global
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-[#1b140f]">
                          {event.average_score.toFixed(1)}
                        </span>
                        {isVolatile ? (
                          <span className="border border-[#91412f] bg-[#edd7ce] px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-[#91412f]">
                            Riesgo operativo
                          </span>
                        ) : (
                          <span className="border border-[#536247] bg-[#e7e0cd] px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-[#415038]">
                            Recomendado
                          </span>
                        )}
                      </div>
                      <span className="mt-1 text-xs text-[#5b4a3a]">
                        {event.total_reviews} opiniones registradas
                      </span>
                    </div>

                    <span className="border border-[#7f674d] px-4 py-2 text-sm font-medium uppercase tracking-[0.12em] text-[#4b3727]">
                      Opiniones pronto
                    </span>
                  </div>
                </div>
              </article>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-full py-24 text-center text-[#4b3727]" role="status" aria-live="polite">
              <p className="text-lg mb-2">No hay eventos de tipo &ldquo;{filter}&rdquo;</p>
              <button
                type="button"
                onClick={() => setFilter("all")}
                className="text-sm text-[#6b3525] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5f3527]"
              >
                Ver todos
              </button>
            </div>
          )}
          </div>
        </section>
      </div>
      </div>
    </main>
  );
}
