import Link from "next/link";

const LOGO_URL = "https://cdn.shopify.com/s/files/1/0649/4083/4883/files/Diseno_sin_titulo_1.png?v=1772327984";
const BG_1 = "https://cdn.shopify.com/s/files/1/0649/4083/4883/files/pexels-nerfee-mirandilla-1656989-3186654.jpg?v=1772328445";
const BG_2 = "https://cdn.shopify.com/s/files/1/0649/4083/4883/files/pexels-kun-fayakun-1238181416-23147806.jpg?v=1772328492";
const CURRENT_DATE = "10 de marzo de 2026";

const SUPABASE_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const FRONT_PAGE_NOTES = [
  {
    title: "Agenda cultural",
    text: "Ferias, conciertos y festivales tratados como noticia principal, no como anexo.",
    href: "/app/agenda",
  },
  {
    title: "KS Points",
    text: "Los lugares recomendados quedan ordenados como servicio al lector antes y despues del evento.",
    href: "/app/score",
  },
  {
    title: "Como funciona",
    text: "El algoritmo se explica con claridad periodistica para justificar cada recomendacion.",
    href: "/algoritmo",
  },
];

const COLUMNS = [
  {
    kicker: "Cronica central",
    title: "Agenda Cultural",
    text: "Una portada que anuncia que Knife Set sirve para descubrir a que evento ir, con fecha, contexto y criterio.",
    href: "/app/agenda",
    cta: "Abrir agenda",
  },
  {
    kicker: "Servicio publico",
    title: "Points",
    text: "La seccion de points acompana la salida completa: donde quedar, comer y seguir la noche sin perder tiempo.",
    href: "/app/score",
    cta: "Ver points",
  },
  {
    kicker: "Mesa de analisis",
    title: "Algoritmo",
    text: "La metodologia se presenta como editorial tecnico: legible, breve y util para entender el por que de cada portada.",
    href: "/algoritmo",
    cta: "Leer analisis",
  },
];

const BULLETINS = [
  "Edicion nocturna dedicada a eventos y ruta gastronomica.",
  "Narrativa principal: la salida cultural primero, el score como contexto.",
  SUPABASE_CONFIGURED
    ? "Mesa de datos conectada a Supabase mediante variables publicas activas."
    : "Mesa de datos en modo demo: faltan variables publicas para Supabase en el entorno.",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-4 py-4 text-foreground md:px-6 md:py-6">
      <a
        href="#portada"
        className="absolute left-4 top-4 z-50 -translate-y-16 bg-[#f4ead6] px-4 py-2 text-sm font-semibold text-[#24170f] transition-transform focus:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5f3527] focus-visible:ring-offset-2 focus-visible:ring-offset-[#efe3c7]"
      >
        Saltar a portada
      </a>

      <div className="newspaper-shell mx-auto max-w-7xl overflow-hidden">
        <header className="border-b border-[#6e573f] px-5 py-4 md:px-8 md:py-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="text-xs uppercase tracking-[0.3em] text-[#6b3525]">
              Edicion cultural de cuchillo y papel
            </div>
            <div className="text-center text-xs uppercase tracking-[0.26em] text-[#493627]">
              Lima, Peru · {CURRENT_DATE}
            </div>
            <div className="text-right text-xs uppercase tracking-[0.26em] text-[#493627]">
              Ano I · Numero 08
            </div>
          </div>

          <div className="newspaper-rule my-4" />

          <div className="grid gap-4 md:grid-cols-[150px_minmax(0,1fr)_200px] md:items-center">
            <div className="hidden md:block">
              <p className="text-xs uppercase tracking-[0.3em] text-[#6b3525]">Edicion</p>
              <p className="mt-2 text-sm leading-6 text-[#3c2d1f]">
                La salida nocturna leida como noticia de portada.
              </p>
            </div>

            <div className="text-center">
              <p className="text-[11px] uppercase tracking-[0.42em] text-[#6b3525]">La gaceta de Knife Set</p>
              <h1 className="mt-1 text-5xl font-bold uppercase tracking-[0.14em] text-[#1c140d] md:text-7xl">
                Knife Set
              </h1>
              <p className="mt-2 text-sm uppercase tracking-[0.28em] text-[#4a3829] md:text-base">
                Agenda cultural, points y criterio en primera plana
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 md:justify-end">
              <img src={LOGO_URL} alt="Knife Set" className="h-12 w-auto opacity-80 sepia" />
            </div>
          </div>

          <div className="newspaper-rule my-4" />

          <nav aria-label="Principal" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#302218] md:text-sm">
            <Link href="/app/agenda" className="hover:text-[#6b3525] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5f3527]">
              Agenda cultural
            </Link>
            <Link href="/app/score" className="hover:text-[#6b3525] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5f3527]">
              KS Points
            </Link>
            <Link href="/algoritmo" className="hover:text-[#6b3525] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5f3527]">
              Como funciona
            </Link>
            <Link href="/login" className="hover:text-[#6b3525] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5f3527]">
              Redaccion
            </Link>
          </nav>
        </header>

        <div id="portada" className="px-5 py-6 md:px-8 md:py-8">
          <section className="grid gap-6 border-b border-[#6e573f] pb-8 lg:grid-cols-[minmax(0,1.2fr)_360px]">
            <article className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="border-b border-[#8d7359] pb-6 lg:border-b-0 lg:border-r lg:pr-6">
                <p className="newspaper-kicker">Titular mayor</p>
                <h2 className="mt-3 max-w-4xl text-5xl font-bold leading-[0.92] text-[#18120d] md:text-7xl">
                  La ciudad vuelve a salir cuando el evento aguanta la multitud.
                </h2>
                <p className="mt-5 max-w-3xl text-xl leading-8 text-[#35271c]">
                  Knife Set cambia de tono y se convierte en un periodico antiguo de cultura nocturna:
                  primero anuncia ferias, conciertos y festivales; despues ofrece points y metodo para que
                  el lector tome una mejor decision.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/app/agenda" className="newspaper-button-primary">
                    Ver la primera plana
                  </Link>
                  <Link href="/app/score" className="newspaper-button">
                    Consultar points
                  </Link>
                </div>

                <div className="newspaper-rule my-6" />

                <p className="newspaper-dropcap text-base leading-8 text-[#2d2016]">
                  Esta nueva portada usa tono editorial, bordes de imprenta, papel envejecido y jerarquia
                  de columnas para dejar una idea clara: el producto no vende solo teoria ni ranking, vende
                  una salida concreta con respaldo, contexto y lectura de consistencia.
                </p>
              </div>

              <div className="space-y-5">
                <figure className="newspaper-panel overflow-hidden p-2">
                  <img
                    src={BG_1}
                    alt="Publico reunido en un evento gastronomico nocturno"
                    className="newspaper-photo h-[280px] w-full object-cover md:h-[360px]"
                  />
                  <figcaption className="border-t border-[#8d7359] px-3 py-3 text-sm leading-6 text-[#4b3727]">
                    La portada deja atras el aspecto digital y entra en una estetica de suplemento cultural antiguo.
                  </figcaption>
                </figure>

                <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-1">
                  {FRONT_PAGE_NOTES.map((note) => (
                    <article key={note.title} className="newspaper-panel p-4">
                      <p className="newspaper-kicker">Seccion</p>
                      <h3 className="mt-2 text-2xl font-semibold text-[#1e1610]">{note.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#4d3a2b]">{note.text}</p>
                      <Link href={note.href} className="mt-4 inline-block text-sm font-semibold uppercase tracking-[0.16em] text-[#6b3525] underline-offset-4 hover:underline">
                        Abrir
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            </article>

            <aside className="space-y-4">
              <section className="newspaper-panel p-5">
                <p className="newspaper-kicker">Boletin tecnico</p>
                <h3 className="mt-2 text-3xl font-semibold text-[#1c140d]">Estado de mesa de datos</h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-[#433122]">
                  {BULLETINS.map((item) => (
                    <li key={item} className="border-b border-dashed border-[#9b8165] pb-3 last:border-b-0 last:pb-0">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="newspaper-panel p-5">
                <p className="newspaper-kicker">Sumario</p>
                <dl className="mt-4 space-y-4 text-[#2f2217]">
                  <div>
                    <dt className="text-xs uppercase tracking-[0.2em] text-[#6b3525]">Agenda</dt>
                    <dd className="mt-1 text-3xl font-semibold">Frente principal</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.2em] text-[#6b3525]">Estilo</dt>
                    <dd className="mt-1 text-3xl font-semibold">Papel, serif y filetes</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.2em] text-[#6b3525]">Narrativa</dt>
                    <dd className="mt-1 text-3xl font-semibold">Evento antes que ranking</dd>
                  </div>
                </dl>
              </section>
            </aside>
          </section>

          <section className="grid gap-0 border-b border-[#6e573f] py-8 md:grid-cols-3">
            {COLUMNS.map((column, index) => (
              <article
                key={column.title}
                className={`p-5 ${index < COLUMNS.length - 1 ? "border-b border-[#8d7359] md:border-b-0 md:border-r" : ""}`}
              >
                <p className="newspaper-kicker">{column.kicker}</p>
                <h3 className="mt-3 text-4xl font-semibold text-[#1b140f]">{column.title}</h3>
                <p className="mt-3 text-base leading-8 text-[#413023]">{column.text}</p>
                <Link href={column.href} className="mt-5 inline-block text-sm font-semibold uppercase tracking-[0.16em] text-[#6b3525] underline-offset-4 hover:underline">
                  {column.cta}
                </Link>
              </article>
            ))}
          </section>

          <section className="grid gap-6 py-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="newspaper-panel p-5 md:p-6">
              <p className="newspaper-kicker">Mesa de redaccion</p>
              <h3 className="mt-3 text-5xl font-semibold leading-none text-[#1b140f] md:text-6xl">
                Primero el evento. Luego el point. Siempre la evidencia.
              </h3>
              <p className="mt-4 text-lg leading-8 text-[#3f2e22]">
                La estructura de portada funciona como un diario antiguo: gran titular, bajada amplia,
                columnas laterales, sumario tecnico y una foto tratada como archivo de imprenta.
              </p>
              <p className="mt-4 text-base leading-8 text-[#433122]">
                El resultado se siente menos app generica y mas suplemento cultural: una pieza con tono,
                memoria visual y una jerarquia que invita a leer antes de hacer clic.
              </p>
            </div>

            <div className="newspaper-panel overflow-hidden p-2">
              <img
                src={BG_2}
                alt="Mesas, luces y escenario listos para una noche cultural"
                className="newspaper-photo h-[280px] w-full object-cover md:h-[360px]"
              />
              <div className="grid gap-0 border-t border-[#8d7359] md:grid-cols-3">
                <div className="p-4 md:border-r md:border-[#8d7359]">
                  <p className="newspaper-kicker">Estetica</p>
                  <p className="mt-2 text-sm leading-6 text-[#433122]">Tipografia serif, negro deslavado, filetes y papel envejecido.</p>
                </div>
                <div className="p-4 md:border-r md:border-[#8d7359]">
                  <p className="newspaper-kicker">Lectura</p>
                  <p className="mt-2 text-sm leading-6 text-[#433122]">Bloques modulares que guian la mirada como una primera pagina.</p>
                </div>
                <div className="p-4">
                  <p className="newspaper-kicker">Accion</p>
                  <p className="mt-2 text-sm leading-6 text-[#433122]">CTAs rectangulares y sobrios, mas cercanos a una llamada editorial que a una app brillante.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <footer className="border-t border-[#6e573f] px-5 py-5 md:px-8">
          <div className="flex flex-col gap-3 text-center text-xs uppercase tracking-[0.22em] text-[#4b3727] md:flex-row md:items-center md:justify-between">
            <span>Knife Set · Gaceta nocturna</span>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/app/agenda" className="hover:text-[#6b3525]">Agenda</Link>
              <Link href="/app/score" className="hover:text-[#6b3525]">Points</Link>
              <Link href="/algoritmo" className="hover:text-[#6b3525]">Analisis</Link>
            </div>
            <span>Impreso en papel digital · 2026</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
