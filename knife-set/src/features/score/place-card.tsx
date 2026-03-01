"use client";

import { useMemo } from "react";
import Image from "next/image";
import { formatScore, cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, MapPin, Instagram, Facebook, Clock, Link as LinkIcon } from "lucide-react";

export type PlaceData = {
  id: string;
  name: string;
  description: string;
  category: string;
  district: string;
  address: string;
  average_score: number;
  consistency_score: number;
  total_reviews: number;
  is_franchise: boolean;
  social_networks?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
  menu_url?: string;
  google_maps_url?: string;
  interior_photos?: string[];
};

interface PlaceCardProps {
  place: PlaceData;
  className?: string;
}

export function PlaceCard({ place, className }: PlaceCardProps) {
  // Determine consistency visual state based on stddev (consistency_score)
  const consistencyInfo = useMemo(() => {
    const sigma = place.consistency_score || 0;
    if (sigma < 1.0) {
      return { level: "titanium", label: "Sello Titanio", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: CheckCircle2, summary: "Consistencia impecable." };
    } else if (sigma <= 2.5) {
      return { level: "moderate", label: "Moderado", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: AlertTriangle, summary: "Fluctuaciones normales." };
    } else {
      return { level: "volatile", label: "Volátil", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20", icon: AlertTriangle, summary: "Riesgos de calidad." };
    }
  }, [place.consistency_score]);

  const ConsistencyIcon = consistencyInfo.icon;

  const bgImage = place.interior_photos && place.interior_photos.length > 0 
    ? place.interior_photos[0] 
    : "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=800";

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl bg-zinc-950 border border-white/10 transition-all hover:border-white/20 hover:shadow-2xl hover:shadow-black/50",
      className
    )}>
      {/* Header Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent z-10" />
        <img 
          src={bgImage} 
          alt={`Interior de ${place.name}`} 
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          {place.is_franchise && (
            <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-black bg-white/90 backdrop-blur-sm rounded-full">
              Franquicia
            </span>
          )}
          <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white bg-black/60 backdrop-blur-sm rounded-full border border-white/10">
            {place.category}
          </span>
        </div>

        {/* Score Floating Badge */}
        <div className="absolute top-4 right-4 z-20 flex flex-col items-end">
           <div className="flex items-center justify-center w-12 h-12 bg-white text-black font-black text-xl rounded-xl shadow-lg transform rotate-3 transition-transform group-hover:rotate-0">
             {formatScore(place.average_score)}
           </div>
           <span className="text-[10px] uppercase font-bold text-white/80 drop-shadow-md mt-1">
             KS Score
           </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-4 relative z-20 bg-zinc-950">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-white mb-1 group-hover:text-primary transition-colors">
            {place.name}
          </h3>
          <div className="flex items-center text-xs text-zinc-400 gap-1 mb-3">
            <MapPin className="w-3 h-3" /> {place.district}
          </div>
          <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
            {place.description}
          </p>
        </div>

        {/* Consistency Metric Block */}
        <div className={cn("p-3 rounded-xl border flex items-start gap-3", consistencyInfo.bg, consistencyInfo.border)}>
          <div className={cn("shrink-0 mt-0.5", consistencyInfo.color)}>
            <ConsistencyIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className={cn("font-bold text-sm", consistencyInfo.color)}>
                {consistencyInfo.label}
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                σ={formatScore(place.consistency_score)}
              </span>
            </div>
            <p className="text-xs text-zinc-400/80 leading-snug">
              {consistencyInfo.summary} ({place.total_reviews} reviews)
            </p>
          </div>
        </div>

        {/* Action/Links Footer */}
        <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/5">
          <div className="flex gap-3">
            {place.social_networks?.instagram && (
              <a href={place.social_networks.instagram.startsWith('http') ? place.social_networks.instagram : `https://instagram.com/${place.social_networks.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-pink-500 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {place.google_maps_url && (
              <a href={place.google_maps_url} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-emerald-500 transition-colors">
                <MapPin className="w-4 h-4" />
              </a>
            )}
            {place.menu_url && (
              <a href={place.menu_url} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-blue-500 transition-colors">
                <LinkIcon className="w-4 h-4" />
              </a>
            )}
          </div>
          
          <button className="text-xs font-medium text-white hover:text-primary transition-colors flex items-center gap-1">
             Ver Detalles <span className="text-primary font-bold">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
