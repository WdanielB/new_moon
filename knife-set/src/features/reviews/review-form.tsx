"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RubricItemProps {
  label: string;
  description: string;
  value: number;
  onChange: (val: number) => void;
}

function RubricRow({ label, description, value, onChange }: RubricItemProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-white/5 gap-4">
      <div>
        <h4 className="font-medium text-white">{label}</h4>
        <p className="text-xs text-zinc-500">{description}</p>
      </div>
      <div className="flex gap-1 shrink-0">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            className="group relative focus:outline-none"
          >
            <div className={cn(
              "w-8 h-10 border rounded flex items-center justify-center text-xs font-mono transition-all",
              value >= num 
                ? "bg-primary border-primary text-black font-black" 
                : "bg-zinc-900 border-white/10 text-zinc-600 hover:border-primary/50 hover:bg-zinc-800"
            )}>
              {num}
            </div>
            {/* Tooltip on hover */}
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {num === 10 ? 'Perfecto' : num <= 4 ? 'Terrible' : num}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function ReviewForm({ targetType = "place", targetId }: { targetType?: "place" | "event", targetId: string }) {
  const [rubric, setRubric] = useState<Record<string, number>>(
    targetType === "place" 
      ? { taste: 0, service: 0, ambiance: 0, value: 0 }
      : { experience: 0, organization: 0, value: 0 }
  );
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate the live mean (Overall Score)
  const scores = Object.values(rubric).filter(v => v > 0);
  const currentOverall = scores.length > 0 
    ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
    : "0.0";

  const handleScoreChange = (metric: string, val: number) => {
    setRubric(prev => ({ ...prev, [metric]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate Supabase API insertion that will trigger the schema-pro.sql RPC calculation
    // const { error } = await supabase.from('reviews').insert({ ... })
    
    setTimeout(() => {
      alert(`Review subida. Score reportado: ${currentOverall}. El algoritmo penalizará la varianza pronto.`);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-950 border border-white/10 rounded-2xl p-6 md:p-8 max-w-3xl mx-auto shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between mb-8 pb-6 border-b border-white/10 gap-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Evaluación del MARK</h2>
          <p className="text-sm text-zinc-400">
            {targetType === "place" 
              ? "Evalúa tu experiencia gastronómica. Recuerda, tu puntuación se cruza estadísticamente de forma matemática con las de los demás."
              : "Evalúa la organización general del último tramo del evento."}
          </p>
        </div>
        
        {/* Dynamic Widget showing the score */}
        <div className="shrink-0 flex items-center justify-center w-24 h-24 rounded-2xl bg-zinc-900 border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-col items-center">
            <span className="text-sm text-zinc-500 font-mono tracking-widest">PROMEDIO</span>
            <span className={cn(
              "text-3xl font-black transition-colors",
              parseFloat(currentOverall) > 7 ? "text-primary" : "text-white"
            )}>
              {currentOverall}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-8">
        {targetType === "place" ? (
          <>
            <RubricRow label="Sabor y Producto" description="Calidad de ingredientes, técnica y balance." value={rubric.taste} onChange={(v) => handleScoreChange('taste', v)} />
            <RubricRow label="Servicio y Tiempos" description="Atención del personal, conocimiento del menú, velocidad." value={rubric.service} onChange={(v) => handleScoreChange('service', v)} />
            <RubricRow label="Ambiente y Comodidad" description="Música, temperatura, limpieza y vibra general." value={rubric.ambiance} onChange={(v) => handleScoreChange('ambiance', v)} />
            <RubricRow label="Relación Calidad/Precio" description="¿El precio justifica lo que se ofrece en plato?" value={rubric.value} onChange={(v) => handleScoreChange('value', v)} />
          </>
        ) : (
          <>
            <RubricRow label="Organización (Logística)" description="Manejo de colas, aforo, baños, y seguridad." value={rubric.organization} onChange={(v) => handleScoreChange('organization', v)} />
            <RubricRow label="Experiencia Cultural" description="Calidad de las bandas, feriantes o actividades." value={rubric.experience} onChange={(v) => handleScoreChange('experience', v)} />
            <RubricRow label="Precio General" description="Costo de entradas y consumo de tickets interno." value={rubric.value} onChange={(v) => handleScoreChange('value', v)} />
          </>
        )}
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-white mb-2">Comentarios adicionales del Evaluador</label>
        <textarea 
          placeholder="Escribe detalles que afectaron la varianza o experiencia (Por ej: 'El puré estaba más seco que la última vez...')"
          className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-sm text-white resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[120px]"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting || parseFloat(currentOverall) === 0}
        className="w-full bg-primary text-black font-bold py-4 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Encriptando y calculando matriz...' : 'Someter Análisis Confidencial'}
      </button>
    </form>
  );
}
