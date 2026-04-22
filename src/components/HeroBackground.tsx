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
      {/* Cinematic gradient vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-primary/60 to-primary/95" />
    </div>
  );
}
