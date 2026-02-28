"use client";

const categoryConfig: Record<string, { color: string; icon: string }> = {
  Restaurante: { color: "bg-ks-rose/20 text-ks-rose", icon: "🍽️" },
  "Café": { color: "bg-ks-amber/20 text-ks-amber", icon: "☕" },
  "Puesto callejero": { color: "bg-ks-emerald/20 text-ks-emerald", icon: "🌮" },
  Mercado: { color: "bg-ks-cyan/20 text-ks-cyan", icon: "🏪" },
};

const priceLabels = ["", "$", "$$", "$$$", "$$$$"];

type PlaceCardProps = {
  name: string;
  category: string;
  district: string;
  address: string;
  ksScore: number;
  reviewCount: number;
  priceLevel: number;
  selected?: boolean;
  rank?: number;
  compact?: boolean;
  onClick?: () => void;
};

function ScoreRing({ score, size = 44 }: { score: number; size?: number }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(score, 100) / 100;
  const offset = circ * (1 - pct);

  const color =
    score >= 75
      ? "stroke-ks-emerald"
      : score >= 50
        ? "stroke-ks-amber"
        : score >= 25
          ? "stroke-ks-amber-dim"
          : "stroke-ks-rose";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={3}
          className="stroke-border"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={3}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${color} transition-all duration-500`}
        />
      </svg>
      <span className="absolute text-xs font-bold tabular-nums">{score.toFixed(0)}</span>
    </div>
  );
}

export function PlaceCard({
  name,
  category,
  district,
  address,
  ksScore,
  reviewCount,
  priceLevel,
  selected = false,
  rank,
  compact = false,
  onClick,
}: PlaceCardProps) {
  const cat = categoryConfig[category] ?? { color: "bg-muted text-muted-foreground", icon: "📍" };

  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
          selected
            ? "bg-primary/10 ring-1 ring-primary/40"
            : "hover:bg-ks-surface-elevated"
        }`}
      >
        {rank != null && (
          <span className="w-5 shrink-0 text-center text-xs font-semibold text-muted-foreground">
            {rank}
          </span>
        )}
        <ScoreRing score={ksScore} size={36} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {category} · {district}
          </p>
        </div>
        <span className="text-[10px] text-muted-foreground">{priceLabels[priceLevel]}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full flex-col gap-3 rounded-xl border p-4 text-left transition-all ${
        selected
          ? "border-primary/40 bg-primary/5 shadow-[0_0_20px_-6px] shadow-primary/20"
          : "border-border bg-card hover:border-primary/20 hover:bg-ks-surface-elevated"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            {rank != null && (
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/15 text-[10px] font-bold text-primary">
                {rank}
              </span>
            )}
            <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${cat.color}`}>
              {cat.icon} {category}
            </span>
          </div>
          <h3 className="text-sm font-semibold leading-snug">{name}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{address}</p>
        </div>
        <ScoreRing score={ksScore} />
      </div>

      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
        <span>{district}</span>
        <span className="h-3 w-px bg-border" />
        <span>{reviewCount} {reviewCount === 1 ? "review" : "reviews"}</span>
        <span className="h-3 w-px bg-border" />
        <span>{priceLabels[priceLevel]}</span>
      </div>
    </button>
  );
}

export { ScoreRing };
