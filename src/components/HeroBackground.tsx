'use client';
import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroBackground() {
  return (
    <motion.div
      className="absolute inset-0 z-0 h-full w-full"
      animate={{ scale: [1, 1.05] }}
      transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
    >
      <Image
        src="/assets/hero-bg.jpg"
        alt="Miss Wanjey Events hero"
        fill
        className="object-cover object-top"
        priority
        quality={90}
      />
      {/* Cinematic gradient vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-primary/60 to-primary/95" />
    </motion.div>
  );
}
