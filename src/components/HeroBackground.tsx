'use client';
import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroBackground() {
  return (
    <div
      className="absolute inset-0 z-0 h-full w-full"
    >
      <Image
        src="/assets/hero-bg.jpg"
        alt="Wanjey Events hero"
        fill
        className="object-cover object-top"
        priority
        quality={90}
      />
      {/* Cinematic gradient vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-primary/60 to-primary/95" />
    </div>
  );
}
