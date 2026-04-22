'use client';
import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

interface Props {
  src: string;
  alt: string;
}

const ParallaxImageBreakout = ({ src, alt }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Moves the image slightly downwards as the user scrolls down,
  // creating a parallax slower-than-scroll effect.
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section ref={ref} className="relative h-[40vh] md:h-[60vh] lg:h-[80vh] w-full overflow-hidden">
      <motion.div className="absolute inset-0 z-0 h-[130%] w-full" style={{ y, top: "-15%" }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover"
          quality={100}
          priority={false}
        />
        {/* Cinematic blend overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-background/90 mix-blend-multiply" />
      </motion.div>
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        {/* Optional overlaying content could go here, e.g. a large minimal logo */}
      </div>
    </section>
  );
};

export default ParallaxImageBreakout;
