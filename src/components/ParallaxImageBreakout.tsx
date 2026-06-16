'use client';
import Image from "next/image";

interface Props {
  src: string;
  alt: string;
}

const ParallaxImageBreakout = ({ src, alt }: Props) => {
  return (
    <section className="relative h-[40vh] md:h-[60vh] lg:h-[80vh] w-full overflow-hidden md:[clip-path:inset(0)]">
      {/* Absolute on mobile (smooth native scrolling), fixed on desktop for premium parallax */}
      <div className="absolute md:fixed inset-0 z-0 w-full h-full md:h-[100vh] md:w-[100vw] pointer-events-none">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>
      {/* Cinematic blend overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-background/90 via-background/40 to-background/90 mix-blend-multiply pointer-events-none" />
    </section>
  );
};

export default ParallaxImageBreakout;
