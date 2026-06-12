'use client';
import { useRef, useEffect } from 'react';
import { Calendar, Megaphone, BarChart3, Zap } from "lucide-react";

const services = [
  { icon: Calendar, title: "Corporate Events", desc: "Product launches, conferences, corporate dinners, and networking events executed with precision." },
  { icon: Megaphone, title: "Brand Activations", desc: "Experiential marketing, in-store activations, and promotional campaigns that captivate audiences." },
  { icon: BarChart3, title: "Digital Marketing", desc: "Social media strategy, content production, campaign management, and influencer collaborations." },
  { icon: Zap, title: "Event Amplification", desc: "Live social coverage, influencer integration, and post-event marketing for maximum reach." },
];

export default function ServicesMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationId: number;
    let isDown = false;
    let startX: number;
    let scrollLeftVal: number;

    const handleScroll = () => {
      const cardWidth = container.scrollWidth / 3;
      if (container.scrollLeft >= cardWidth * 2) {
        container.scrollLeft -= cardWidth;
      } else if (container.scrollLeft <= 0) {
        container.scrollLeft += cardWidth;
      }
    };

    container.addEventListener('scroll', handleScroll);

    // Initial scroll position in the middle
    const cardWidth = container.scrollWidth / 3;
    container.scrollLeft = cardWidth;

    // Automatic scrolling loop
    const step = () => {
      if (!isDown && container) {
        container.scrollLeft += 0.8; // Auto-scroll speed
      }
      animationId = requestAnimationFrame(step);
    };
    animationId = requestAnimationFrame(step);

    // Mouse drag support for desktop
    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX - container.offsetLeft;
      scrollLeftVal = container.scrollLeft;
    };

    const onMouseLeave = () => {
      isDown = false;
    };

    const onMouseUp = () => {
      isDown = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeftVal - walk;
    };

    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mouseleave', onMouseLeave);
    container.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mousemove', onMouseMove);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('mouseleave', onMouseLeave);
      container.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative flex overflow-x-auto scrollbar-hide py-12 select-none cursor-grab active:cursor-grabbing border-y border-[#CAA365]/30 bg-[#FFE5D9] shadow-sm my-6"
    >
      <div className="flex whitespace-nowrap gap-6 px-6">
        {[...services, ...services, ...services].map((s, i) => (
          <div key={i} className="min-w-[300px] md:min-w-[400px]">
            <div className="glass-card group bg-accent/5 backdrop-blur-md border border-accent/10 hover:bg-accent/10 hover:border-accent/20 transition-all duration-500 rounded-2xl relative overflow-hidden flex flex-col h-full p-8 md:p-10 whitespace-normal pointer-events-auto">
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-accent-foreground border border-accent/20 transition-transform duration-500 group-hover:scale-110 shadow-[0_10px_30px_-10px_rgba(202,163,101,0.5)] animate-float-slow">
                <s.icon className="h-8 w-8" />
              </div>
              <h3 className="relative z-10 mt-6 font-serif text-xl font-bold tracking-wide transition-colors duration-300">{s.title}</h3>
              <p className="relative z-10 mt-3 text-[14px] leading-[1.7] text-muted-foreground font-medium">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-5px) scale(1.05); }
        }
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
