import Link from "next/link";
import { ReviewForm } from "@/features/reviews/review-form";

export default function EvaluatePage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/app/score" className="text-sm font-medium text-zinc-500 hover:text-white mb-12 inline-block uppercase tracking-widest transition-colors">
          ← Cancelar
        </Link>

        <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 text-white">Consola de Evaluación</h1>
            <p className="text-zinc-400 text-lg">
                Identificado como <strong>MARK Oficial</strong>. La métrica subida impactará directamente el algoritmo de desviación estándar del local.
            </p>
        </div>

        {/* 
          En un caso real la prop 'targetType' vendría del id del local seleccionado.
          Aquí lo forzamos a "place" para la demostración del componente interactivo de lugares.
        */}
        <ReviewForm targetType="place" targetId="mock-id" />
        
      </div>
    </main>
  );
}