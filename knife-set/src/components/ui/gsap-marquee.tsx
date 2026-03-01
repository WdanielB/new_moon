"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface MarqueeProps {
  items: {
    id: string;
    imageUrl: string;
    alt: string;
  }[];
  speed?: number;
  direction?: "left" | "right";
  className?: string;
}

export function GsapMarquee({ items, speed = 1, direction = "left", className }: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !wrapperRef.current) return;

    // Clone items for infinite effect
    const wrap = wrapperRef.current;
    
    // Create twin for seamless loop
    const clone = wrap.cloneNode(true) as HTMLDivElement;
    containerRef.current.appendChild(clone);

    // Calculate total width of one set
    const totalWidth = wrap.offsetWidth;
    const duration = totalWidth / (50 * speed); // Pixels per second

    // Set up horizontal scroll timeline
    const xMovement = direction === "left" ? -totalWidth : totalWidth;
    
    // Initial position if moving right
    if (direction === "right") {
      gsap.set([wrap, clone], { x: -totalWidth });
    }

    const tl = gsap.timeline({ repeat: -1 });

    tl.to([wrap, clone], {
      x: direction === "left" ? xMovement : 0,
      duration: duration,
      ease: "none",
      modifiers: {
        x: gsap.utils.unitize((x: string) => parseFloat(x) % totalWidth)
      }
    });

    // Velocity-based Skew/Stretch effect (The "Netflix/Apple" stretch)
    let proxy = { skew: 0 },
        skewSetter = gsap.quickSetter([wrap, clone], "skewX", "deg"), 
        clamp = gsap.utils.clamp(-20, 20);

    ScrollTrigger.create({
      onUpdate: (self) => {
        let skew = clamp(self.getVelocity() / -300);
        
        // Stop the marquee while scrolling fast for dramatic effect, or just let it play
        // We'll just apply the skew
        if (Math.abs(skew) > Math.abs(proxy.skew)) {
          proxy.skew = skew;
          gsap.to(proxy, {
            skew: 0, 
            duration: 0.8, 
            ease: "power3", 
            overwrite: true, 
            onUpdate: () => skewSetter(proxy.skew)
          });
        }
      }
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [items, speed, direction]);

  return (
    <div 
      className={cn("overflow-hidden w-full whitespace-nowrap py-10 flex", className)} 
      ref={containerRef}
    >
      <div 
        ref={wrapperRef} 
        className="flex inline-flex gap-8 px-4 items-center"
      >
        {items.map((item) => (
          <div 
            key={item.id} 
            className="flex-shrink-0 h-16 w-32 relative md:h-20 md:w-40 opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
          >
            {/* Using standard img for simpler GSAP integration, though next/image works if unoptimized or configured */}
            <img 
              src={item.imageUrl} 
              alt={item.alt}
              className="object-contain w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
