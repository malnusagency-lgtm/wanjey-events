'use client';
import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Cinematic slow-scroll (parallax) effect
  // The background moves at 30% of the scroll speed, creating depth
  const y = useTransform(scrollY, [0, 1000], [0, 300]);

  return (
    <div ref={ref} className="absolute inset-0 z-0 h-full w-full overflow-hidden">
      <motion.div 
        className="absolute inset-0 h-[120%] w-full"
        style={{ y }}
      >
        <Image
          src="/assets/hero-bg.jpg"
          alt="Wanjey Events hero"
          fill
          className="object-cover object-top"
          priority
          quality={90}
        />
      </motion.div>
      {/* Cinematic gradient vignette overlay with deep edge containment */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-background/40 to-background" />
      
      {/* Top and Bottom shadow protection for header/footer overlap */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />
      
      {/* Deep inner shadow */}
      <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.5)] pointer-events-none" />
    </div>
  );
}
