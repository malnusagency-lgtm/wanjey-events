'use client';
import Image from 'next/image';

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
      <Image
        src="/assets/hero-bg.jpg"
        alt="Hero Background"
        fill
        priority
        className="object-cover pointer-events-none"
        sizes="100vw"
      />
      {/* Balanced dark overlay to ensure light text is readable without hiding the image */}
      <div className="absolute inset-0 bg-black/35 z-10" />
    </div>
  );
}
