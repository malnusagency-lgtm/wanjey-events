'use client';

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed w-full h-full"
        style={{ backgroundImage: 'url("/assets/hero-bg.jpg")' }}
      />
      {/* Balanced dark overlay to ensure light text is readable without hiding the image */}
      <div className="absolute inset-0 bg-black/35" />
    </div>
  );
}
