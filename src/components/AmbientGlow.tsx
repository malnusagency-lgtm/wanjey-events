'use client';

const AmbientGlow = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-soft-light">
      <div className="absolute -left-[10%] top-[10%] h-[500px] w-[500px] rounded-full bg-accent/20 opacity-50 blur-[120px] mix-blend-screen" />
      <div className="absolute -right-[10%] bottom-[10%] h-[600px] w-[600px] rounded-full bg-accent/15 opacity-40 blur-[150px] mix-blend-screen" />
    </div>
  );
};

export default AmbientGlow;
