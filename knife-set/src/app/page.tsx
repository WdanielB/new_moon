"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { GsapMarquee } from "@/components/ui/gsap-marquee";

const HeroScene = dynamic(() => import("@/components/3d/hero-scene"), {
  ssr: false,
});

const LOGO_URL = "https://cdn.shopify.com/s/files/1/0649/4083/4883/files/Diseno_sin_titulo_1.png?v=1772327984";
const BG_1 = "https://cdn.shopify.com/s/files/1/0649/4083/4883/files/pexels-nerfee-mirandilla-1656989-3186654.jpg?v=1772328445";
const BG_2 = "https://cdn.shopify.com/s/files/1/0649/4083/4883/files/pexels-kun-fayakun-1238181416-23147806.jpg?v=1772328492";

export default function Home() {
  const marqueeItems = [
    {
      id: "1",
      imageUrl: "https://cdn.shopify.com/s/files/1/0649/4083/4883/files/1.png?v=1772330107",
      alt: "Elwecco La Feria",
    },
    {
      id: "2",
      imageUrl: "https://cdn.shopify.com/s/files/1/0649/4083/4883/files/2.png?v=1772330106",
      alt: "El Show Me The Room",
    },
    {
      id: "3",
      imageUrl: LOGO_URL,
      alt: "Knife Set",
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between relative bg-[#111318] text-white overflow-x-hidden">

      {/* ===== HERO: Full-width cinematic background ===== */}
      <section className="relative w-full min-h-screen flex flex-col">
        {/* Background photo – horizontal crop */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={BG_1}
            alt="Gastronomía"
            className="w-full h-full object-cover object-center"
          />
          {/* Dark overlay with brand tint */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#111318]" />
        </div>

        {/* 3D particles layer (behind text, above photo) */}
        <div className="absolute inset-0 z-[1] opacity-30 mix-blend-screen pointer-events-none">
          <HeroScene />
        </div>

        {/* Nav */}
        <nav className="relative z-20 flex items-center justify-between w-full px-6 md:px-12 py-6">
          <img
            src={LOGO_URL}
            alt="Knife Set"
            className="h-12 md:h-16 w-auto drop-shadow-lg"
          />
          <div className="flex items-center gap-4">
            <Link href="/algoritmo" className="text-sm text-white/70 hover:text-white transition-colors hidden md:block">Algoritmo</Link>
            <Link href="/app/agenda" className="text-sm text-white/70 hover:text-white transition-colors hidden md:block">Agenda</Link>
            <Link href="/login" className="text-sm text-white/80 hover:text-white transition-colors px-4 py-2 border border-white/20 rounded-full hover:border-white/40">Entrar</Link>
            <Link href="/app/score" className="text-sm font-semibold px-5 py-2 bg-[#C41E2A] text-white rounded-full hover:bg-[#a51923] transition-colors shadow-lg shadow-red-900/30">Ver Ranking</Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto pb-32">
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#C41E2A] animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-white/60 font-medium">Algoritmo de Consistencia Activo</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-[#D4A882] to-[#8B5E3C]">
              La Verdad
            </span>
            <br />
            <span className="text-white">Algorítmica.</span>
          </h1>

          <p className="max-w-2xl text-base md:text-lg text-white/60 mb-12 font-light leading-relaxed">
            Ya no importa quién lo dice, importa cómo se mantiene.
            Evaluamos restaurantes y eventos culturales aplicando{" "}
            <span className="text-[#C41E2A] font-semibold">Desviación Estándar</span>{" "}
            para descubrir si realmente son consistentes o si su calidad es una lotería.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/algoritmo"
              className="px-8 py-4 border border-[#D4A882]/30 text-[#D4A882] rounded-full hover:bg-[#D4A882]/10 transition-all font-medium"
            >
              Leer el Paper
            </Link>
            <Link
              href="/app/score"
              className="px-8 py-4 bg-[#C41E2A] text-white rounded-full hover:bg-[#a51923] transition-all font-semibold shadow-xl shadow-red-900/20 hover:scale-105"
            >
              Explorar el Índice
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[10px] uppercase tracking-widest text-white/30">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* ===== MARQUEE: Partners / Logos strip ===== */}
      <section className="relative z-10 w-full py-16 bg-[#111318] border-t border-white/5">
        <div className="container mx-auto px-4 mb-4">
          <h2 className="text-[10px] font-bold text-[#8B5E3C] uppercase tracking-[0.25em] text-center">
            Puntuados e Involucrados
          </h2>
        </div>
        <div className="w-full">
          <GsapMarquee items={marqueeItems} speed={1.2} direction="left" />
          <GsapMarquee items={marqueeItems} speed={0.8} direction="right" />
        </div>
      </section>

      {/* ===== SECOND BG SECTION: Methodology with photo ===== */}
      <section className="relative z-10 w-full overflow-hidden">
        {/* Background photo 2 – horizontal crop */}
        <div className="absolute inset-0">
          <img
            src={BG_2}
            alt="Interior restaurante"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111318] via-[#111318]/90 to-[#111318]/60" />
        </div>

        <div className="relative z-10 container mx-auto px-6 py-32 md:py-40">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C41E2A] font-bold mb-4 block">Métrica Central</span>
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-white">
                Consistencia<br/>
                <span className="text-[#D4A882]">sobre Promedio.</span>
              </h2>
              <p className="text-white/50 text-lg mb-10 leading-relaxed">
                El problema con los promedios es que esconden la verdad. Un restaurante con reseñas de &quot;10&quot; y &quot;2&quot; tiene un promedio de &quot;6&quot;. Pareciera normal, pero es una ruleta rusa.
              </p>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#4E7A52]/20 text-[#4E7A52] flex items-center justify-center shrink-0 border border-[#4E7A52]/30 text-lg font-bold">&#10003;</div>
                  <div>
                    <strong className="block text-white text-sm">Sello Titanio (Constante)</strong>
                    <span className="text-white/40 text-sm">Varianza baja. Sabes exactamente qué vas a recibir sin sorpresas.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#C41E2A]/20 text-[#C41E2A] flex items-center justify-center shrink-0 border border-[#C41E2A]/30 text-lg font-bold">!</div>
                  <div>
                    <strong className="block text-white text-sm">Lotería (Volátil)</strong>
                    <span className="text-white/40 text-sm">Varianza alta. Penalización severa. Hoy bueno, mañana pésimo.</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Equation card */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-xl p-10 flex flex-col justify-center min-h-[360px]">
              <div className="text-center space-y-6">
                <div className="text-[10px] uppercase tracking-[0.25em] text-[#B5C4D5] font-bold">Score Oficial KS</div>
                <div className="font-mono text-white/40 text-sm">Promedio - (Penalty &times; Desviaci&oacute;n Est&aacute;ndar)</div>
                <div className="flex items-center justify-center gap-4 text-4xl font-light py-6">
                  <span className="text-white font-black">8.5</span>
                  <span className="text-white/20">=</span>
                  <span className="text-[#19445E] font-bold">9.0</span>
                  <span className="text-white/20">-</span>
                  <span className="text-[#C41E2A] font-bold">0.5</span>
                </div>
                <div className="text-xs text-white/30">Ejemplo: Local con ligeras variaciones de calidad</div>
                <div className="mt-6 flex items-center justify-center gap-6 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#4E7A52]" />
                    <span className="text-white/40">&sigma; &lt; 1.0</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#D4A882]" />
                    <span className="text-white/40">&sigma; 1.1-2.5</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#C41E2A]" />
                    <span className="text-white/40">&sigma; &gt; 2.5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 w-full py-12 bg-[#0a0c10] border-t border-white/5">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <img src={LOGO_URL} alt="Knife Set" className="h-8 w-auto opacity-50" />
          <div className="flex gap-6 text-xs text-white/30">
            <Link href="/algoritmo" className="hover:text-white/60 transition-colors">Algoritmo</Link>
            <Link href="/app/score" className="hover:text-white/60 transition-colors">Ranking</Link>
            <Link href="/app/agenda" className="hover:text-white/60 transition-colors">Agenda</Link>
          </div>
          <span className="text-xs text-white/20">&copy; 2026 Knife Set. Todos los derechos reservados.</span>
        </div>
      </footer>
    </main>
  );
}
