'use client';
import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

interface Props {
  src: string;
  alt: string;
}

const ParallaxImageBreakout = ({ src, alt }: Props) => {
  return (
    <section className="relative h-[40vh] md:h-[60vh] lg:h-[80vh] w-full overflow-hidden">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed w-full h-full"
        style={{ backgroundImage: `url("${src}")` }}
      />
      {/* Cinematic blend overlay to maintain transition smoothness */}
      <div className="absolute inset-0 z-1 bg-gradient-to-t from-background/90 via-background/40 to-background/90 mix-blend-multiply pointer-events-none" />
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        {/* Optional overlaying content could go here */}
      </div>
    </section>
  );
};

export default ParallaxImageBreakout;
