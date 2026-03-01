"use client";

import { useMemo } from "react";

export default function HeroScene() {
  const particles = useMemo(
    () =>
      Array.from({ length: 80 }, (_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: `${Math.random() * 3 + 1}px`,
        duration: `${Math.random() * 10 + 8}s`,
        delay: `${Math.random() * 8}s`,
      })),
    []
  );

  return (
    <div className="absolute inset-0 z-0 h-full w-full pointer-events-none opacity-50 mix-blend-screen">
      <div className="relative h-full w-full overflow-hidden">
        {particles.map((particle) => (
          <span
            key={particle.id}
            className="ks-particle"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              animationDuration: particle.duration,
              animationDelay: particle.delay,
            }}
          />
        ))}
      </div>
      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
      <style jsx>{`
        .ks-particle {
          position: absolute;
          border-radius: 9999px;
          background: white;
          opacity: 0.6;
          filter: blur(0.5px);
          animation-name: ksFloat;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          will-change: transform, opacity;
        }

        @keyframes ksFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(0.85);
            opacity: 0.35;
          }
          50% {
            transform: translate3d(0, -18px, 0) scale(1.15);
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  );
}
