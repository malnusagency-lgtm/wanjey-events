'use client';
import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const AmbientGlow = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const springX = useSpring(mousePosition.x, { stiffness: 50, damping: 40 });
  const springY = useSpring(mousePosition.y, { stiffness: 50, damping: 40 });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-soft-light z-0">
      <div className="absolute -left-[10%] top-[10%] h-[500px] w-[500px] rounded-full bg-accent/20 opacity-50 blur-[120px] mix-blend-screen" />
      <motion.div 
        className="absolute h-[600px] w-[600px] rounded-full bg-accent/15 opacity-40 blur-[150px] mix-blend-screen"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%'
        }}
      />
    </div>
  );
};

export default AmbientGlow;
