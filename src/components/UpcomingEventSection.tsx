'use client';
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import MagneticButton from "./MagneticButton";
import { ArrowRight, Play } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const UpcomingEventSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax movement for the background media
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={ref} className="relative h-[80vh] md:h-[90vh] w-full overflow-hidden bg-black">
      {/* Parallax Background Media */}
      <motion.div 
        className="absolute inset-0 z-0 h-[120%] w-full" 
        style={{ y, top: "-10%" }}
      >
        <video
          src="/assets/bigvoices/bv-vid-1.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover opacity-60"
        />
        {/* Cinematic Overlays to blend with the site's dark aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/80" />
        <div className="absolute inset-0 bg-black/20 mix-blend-overlay" />
      </motion.div>

      {/* Content Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
        <AnimatedSection delay={0.2}>
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Upcoming Event</span>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.4}>
          <h2 className="mt-8 font-serif text-5xl font-bold leading-tight text-white md:text-7xl lg:text-[7.5rem] tracking-tighter">
            BIGVOICES <em className="italic font-light text-accent/90">FEST</em>
          </h2>
          <p className="mt-4 font-sans text-lg font-medium uppercase tracking-[0.3em] text-white/80 md:text-xl">
            Season 2: Millennial Edition
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.6}>
          <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row">
            <MagneticButton intensity={30}>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-10 h-16 text-base font-bold shadow-2xl shadow-accent/20 transition-all duration-300">
                Secure Your Spot
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </MagneticButton>
            
            <button className="flex items-center gap-3 text-white/90 hover:text-white transition-colors group">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm group-hover:bg-white/10 transition-all duration-300">
                <Play className="h-4 w-4 fill-current transition-transform group-hover:scale-110" />
              </div>
              <span className="text-sm font-bold uppercase tracking-wider">Watch Promo</span>
            </button>
          </div>
        </AnimatedSection>
      </div>

      {/* Floating Meta Details */}
      <div className="absolute bottom-12 right-12 z-20 hidden lg:block">
        <AnimatedSection delay={0.8} className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-1">Status</p>
          <p className="text-sm font-medium text-white/60">Tickets Live Soon</p>
        </AnimatedSection>
      </div>

      {/* Subtle Grain Layer just for this section to enhance the cinematic feel */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.15] mix-blend-overlay">
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-20" />
      </div>
    </section>
  );
};

export default UpcomingEventSection;
