'use client';
import { useRef } from "react";

interface Props {
  src: string;
  alt: string;
}

const ParallaxImageBreakout = ({ src, alt }: Props) => {
  return (
    <section className="relative h-[40vh] md:h-[60vh] lg:h-[80vh] w-full overflow-hidden" style={{ clipPath: 'inset(0)' }}>
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat w-full h-full pointer-events-none"
        style={{ 
          backgroundImage: `url("${src}")`,
          height: '100vh',
          width: '100vw'
        }}
      />
      {/* Cinematic blend overlay */}
      <div className="absolute inset-0 z-1 bg-gradient-to-t from-background/90 via-background/40 to-background/90 mix-blend-multiply pointer-events-none" />
    </section>
  );
};

export default ParallaxImageBreakout;
