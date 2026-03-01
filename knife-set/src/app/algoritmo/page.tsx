import Link from "next/link";

export const metadata = {
  title: "Índice de Consistencia Cks — Knife Set Working Paper",
};

/* ── helpers ───────────────────────────────────────── */
const Ref = ({ n }: { n: number }) => (
  <sup className="text-[10px] text-gray-500 ml-0.5 cursor-default select-none">[{n}]</sup>
);

const Eq = ({ children, id }: { children: React.ReactNode; id?: string }) => (
  <figure id={id} className="my-10 flex flex-col items-center gap-2">
    <div className="bg-gray-50 border border-gray-200 rounded px-10 py-6 font-serif italic text-lg md:text-xl tracking-wide text-center">
      {children}
    </div>
  </figure>
);

/* ── page ──────────────────────────────────────────── */
export default function Paper() {
  return (
    <article className="min-h-screen bg-white text-black selection:bg-black selection:text-white print:p-0">
      {/* top bar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200 px-6 py-3 flex items-center justify-between print:hidden">
        <Link href="/" className="text-xs uppercase tracking-[.25em] text-gray-400 hover:text-black transition-colors font-medium">
          &larr; Knife Set
        </Link>
        <span className="text-[10px] uppercase tracking-widest text-gray-300 hidden md:inline">Working Paper &mdash; v 1.0</span>
      </nav>

      <div className="max-w-[680px] mx-auto px-6 py-16 md:py-24 font-serif">
        {/* ───── Title Block ───── */}
        <header className="mb-14 text-center">
          <p className="text-[10px] uppercase tracking-[.3em] text-gray-400 mb-6 font-sans">Knife Set Research &bull; Working Paper WP-2026-001</p>
          <h1 className="text-2xl md:text-3xl font-bold leading-snug mb-6 font-sans tracking-tight">
            Índice de Consistencia&nbsp;C<sub>ks</sub>:
            <br className="hidden md:block" />
            Un modelo de penalización por varianza para la evaluación gastronómica
          </h1>

          <div className="text-sm text-gray-500 space-y-1 mb-8">
            <p className="font-sans font-medium text-gray-700">Equipo Knife Set</p>
            <p className="text-xs italic">Departamento de Algoritmos &amp; Datos</p>
          </div>

          <time className="text-xs text-gray-400 font-sans uppercase tracking-wider">Febrero 2026</time>
        </header>

        <hr className="border-gray-200 mb-12" />

        {/* ───── Abstract ───── */}
        <section className="mb-12">
          <h2 className="text-[11px] font-sans font-bold uppercase tracking-[.2em] text-gray-400 mb-4">Abstract</h2>
          <p className="text-[15px] leading-relaxed text-gray-700 text-justify">
            Las plataformas de reseñas predominantes (Google&nbsp;Maps, TripAdvisor, Yelp) dependen exclusivamente de la media aritmética para sintetizar la calidad percibida de un establecimiento gastronómico. Esta métrica ignora la dispersión de las calificaciones, ocultando información crítica sobre la consistencia operativa del servicio. El presente documento introduce el <em>Índice de Consistencia</em>&nbsp;C<sub>ks</sub>, un modelo que penaliza la media aritmética en función de la desviación estándar de las evaluaciones históricas, generando un score que refleja tanto la calidad como la fiabilidad de la experiencia.
          </p>
        </section>

        <hr className="border-gray-100 mb-12" />

        {/* ───── Body ───── */}
        <div className="space-y-12 text-[15px] leading-[1.85] text-gray-800 text-justify">

          {/* §1 */}
          <section>
            <h2 className="text-base font-sans font-bold mb-4">1. &ensp;Introducción: El Problema de la Lotería</h2>
            <p>
              Consideremos dos establecimientos en un mismo distrito, ambos con una puntuación aparente de <strong>7.0</strong> sobre&nbsp;10.<Ref n={1} />
            </p>
            <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-5">
                <p className="font-sans font-semibold text-sm mb-1">Restaurante A &mdash; &laquo;La Roca&raquo;</p>
                <p className="text-sm text-gray-500 font-mono mb-2">[7, 7, 7, 7, 7]</p>
                <p className="text-xs text-gray-400">Desviación estándar: <strong className="text-gray-700">σ = 0.00</strong></p>
              </div>
              <div className="border border-gray-200 rounded-lg p-5">
                <p className="font-sans font-semibold text-sm mb-1">Restaurante B &mdash; &laquo;La Sorpresa&raquo;</p>
                <p className="text-sm text-gray-500 font-mono mb-2">[10, 2, 9, 4, 10]</p>
                <p className="text-xs text-gray-400">Desviación estándar: <strong className="text-gray-700">σ ≈ 3.35</strong></p>
              </div>
            </div>
            <p>
              Bajo el modelo tradicional el comensal asume equivalencia de calidad entre ambos locales, lo cual es empíricamente falso. El restaurante&nbsp;B presenta un problema grave de consistencia operativa &mdash;cocina, estandarización de platos, rotación de personal&mdash; que el promedio simple no logra capturar.<Ref n={2} /> Al carecer de una penalidad por varianza, el sistema vigente incentiva picos temporales de calidad (campañas, influencers) sobre la sostenibilidad.
            </p>
          </section>

          {/* §2 */}
          <section>
            <h2 className="text-base font-sans font-bold mb-4">2. &ensp;Definición Formal del Score Knife&nbsp;Set</h2>
            <p>
              Sea <em>R</em> = &#123;r<sub>1</sub>, r<sub>2</sub>, …, r<sub>n</sub>&#125; el conjunto de <em>n</em> calificaciones emitidas por evaluadores certificados (MARKs) para un establecimiento dado. Definimos:
            </p>

            <Eq id="eq-1">
              C<sub>ks</sub> = μ − λ · σ
            </Eq>

            <p>Donde los componentes se establecen como sigue:</p>

            <table className="w-full text-sm my-6 border-collapse font-sans">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-2 pr-4 font-semibold text-gray-600 w-32">Símbolo</th>
                  <th className="text-left py-2 font-semibold text-gray-600">Definición</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-mono text-gray-500">μ</td>
                  <td className="py-3">Media aritmética: μ = (1/n) Σ r<sub>i</sub></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-mono text-gray-500">σ</td>
                  <td className="py-3">Desviación estándar muestral de <em>R</em></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-mono text-gray-500">λ</td>
                  <td className="py-3">Constante de penalización calibrada (actualmente <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">λ = 0.25</code>)</td>
                </tr>
              </tbody>
            </table>

            <p>
              La constante λ controla la severidad de la penalización. Valores superiores producen scores más estrictos, desincentivando la volatilidad.<Ref n={3} /> El valor actual fue determinado empíricamente con datos de prueba piloto (Arequipa, Perú, 2025-2026).
            </p>
          </section>

          {/* §3 */}
          <section>
            <h2 className="text-base font-sans font-bold mb-4">3. &ensp;Clasificación de la Varianza</h2>
            <p>
              En función del valor resultante de σ, el sistema clasifica cada establecimiento en uno de tres niveles de advertencia para el consumidor:
            </p>

            <div className="my-8 font-sans text-sm">
              {/* Table-like presentation */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] border-b border-gray-200 bg-gray-50">
                  <div className="px-4 py-3 font-semibold text-gray-600 border-r border-gray-200">Clasificación</div>
                  <div className="px-4 py-3 font-semibold text-gray-600">Criterio &amp; Interpretación</div>
                </div>
                <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] border-b border-gray-100">
                  <div className="px-4 py-4 border-r border-gray-100 flex items-start gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span className="font-semibold text-emerald-800">Titanio</span>
                  </div>
                  <div className="px-4 py-4 text-gray-600">
                    <strong>σ &lt; 1.0</strong> &mdash; Alta consistencia. Menú, sabor y tiempos de atención operan con precisión estable. Recomendación sin reservas.
                  </div>
                </div>
                <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] border-b border-gray-100">
                  <div className="px-4 py-4 border-r border-gray-100 flex items-start gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span className="font-semibold text-amber-800">Moderado</span>
                  </div>
                  <div className="px-4 py-4 text-gray-600">
                    <strong>1.0 ≤ σ ≤ 2.5</strong> &mdash; Fluctuaciones dentro de lo esperable por demanda, aforo y rotación estacional.
                  </div>
                </div>
                <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr]">
                  <div className="px-4 py-4 border-r border-gray-100 flex items-start gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                    <span className="font-semibold text-red-800">Volátil</span>
                  </div>
                  <div className="px-4 py-4 text-gray-600">
                    <strong>σ &gt; 2.5</strong> &mdash; Experiencia impredecible. Se aplica la penalización máxima del modelo C<sub>ks</sub>.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* §4 */}
          <section>
            <h2 className="text-base font-sans font-bold mb-4">4. &ensp;Ejemplo Numérico</h2>
            <p>Retomando el caso introductorio con λ&nbsp;=&nbsp;0.25:</p>

            <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-sm">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 space-y-1.5">
                <p className="font-semibold text-gray-600">Restaurant A</p>
                <p className="text-gray-500">μ = 7.00 &ensp;|&ensp; σ = 0.00</p>
                <p className="font-mono text-lg mt-2">C<sub>ks</sub> = 7.00 − 0.25 × 0.00 = <strong className="text-emerald-700">7.00</strong></p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 space-y-1.5">
                <p className="font-semibold text-gray-600">Restaurante B</p>
                <p className="text-gray-500">μ = 7.00 &ensp;|&ensp; σ ≈ 3.35</p>
                <p className="font-mono text-lg mt-2">C<sub>ks</sub> = 7.00 − 0.25 × 3.35 ≈ <strong className="text-red-700">6.16</strong></p>
              </div>
            </div>

            <p>
              Bajo el modelo C<sub>ks</sub>, el Restaurante&nbsp;B recibe una puntuación 12&thinsp;% inferior a pesar de compartir la misma media aritmética, reflejando fielmente el riesgo que asume el comensal.
            </p>
          </section>

          {/* §5 */}
          <section>
            <h2 className="text-base font-sans font-bold mb-4">5. &ensp;Propiedades del Modelo</h2>
            <ol className="list-decimal list-outside ml-5 space-y-2 marker:text-gray-400 marker:font-sans">
              <li><strong>Monotonía inversa en varianza:</strong> a mayor dispersión de calificaciones, menor score final.</li>
              <li><strong>Resistencia a manipulación:</strong> inyecciones artificiales de calificaciones extremas incrementan&nbsp;σ, reduciendo el score neto.</li>
              <li><strong>Convergencia temporal:</strong> a medida que <em>n</em>&nbsp;→&nbsp;∞, la influencia de outliers decrece naturalmente.</li>
              <li><strong>Parametrización ajustable:</strong> λ puede variar por categoría (fine dining vs. street food) sin alterar la estructura del modelo.</li>
            </ol>
          </section>

          {/* §6 */}
          <section>
            <h2 className="text-base font-sans font-bold mb-4">6. &ensp;Conclusión</h2>
            <p>
              El Índice de Consistencia C<sub>ks</sub> erradica los falsos halagos producidos por campañas de influencers y reseñas pagadas. Un aumento artificial de calificaciones genera un pico que desbalancea la varianza, arrastrando el score oficial hasta que el establecimiento demuestre capacidad de replicar esa calidad de forma sostenida.<Ref n={4} />
            </p>
            <p>
              El modelo permanece abierto a extensiones futuras: ponderación temporal (decaimiento exponencial de reseñas antiguas), segmentación por rúbrica (cocina, servicio, ambiente) y ajuste dinámico de&nbsp;λ mediante aprendizaje supervisado.
            </p>
          </section>
        </div>

        <hr className="border-gray-200 mt-16 mb-10" />

        {/* ───── References ───── */}
        <section className="mb-16">
          <h2 className="text-[11px] font-sans font-bold uppercase tracking-[.2em] text-gray-400 mb-4">Referencias</h2>
          <ol className="list-decimal list-outside ml-5 space-y-2 text-xs text-gray-500 font-sans">
            <li>Ejemplo adaptado de problemas clásicos de agregación de preferencias. Véase Arrow, K. J. (1951). <em>Social Choice and Individual Values</em>.</li>
            <li>Anderson, M. &amp; Magruder, J. (2012). Learning from the crowd: regression discontinuity estimates of the effects of an online review database. <em>The Economic Journal</em>, 122(563).</li>
            <li>El valor λ = 0.25 fue calibrado durante la fase piloto en Arequipa, Perú (n = 120 evaluaciones, 18 establecimientos).</li>
            <li>Luca, M. (2016). Reviews, reputation, and revenue: the case of Yelp.com. <em>Harvard Business School Working Paper</em>, 12-016.</li>
          </ol>
        </section>

        {/* ───── Footer ───── */}
        <footer className="border-t border-gray-200 pt-8 pb-16 text-center font-sans">
          <p className="text-[10px] uppercase tracking-[.25em] text-gray-300">
            &copy; 2026 Knife Set &mdash; Todos los derechos reservados
          </p>
        </footer>
      </div>
    </article>
  );
}
