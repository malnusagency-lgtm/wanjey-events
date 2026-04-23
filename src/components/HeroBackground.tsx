'use client';

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0 h-full w-full overflow-hidden" style={{ clipPath: 'inset(0)' }}>
      <div 
        className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat w-full h-full pointer-events-none"
        style={{ 
          backgroundImage: 'url("/assets/hero-bg.jpg")',
          height: '100vh',
          width: '100vw',
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
      />
      {/* Balanced dark overlay to ensure light text is readable without hiding the image */}
      <div className="absolute inset-0 bg-black/35" />
    </div>
  );
}
