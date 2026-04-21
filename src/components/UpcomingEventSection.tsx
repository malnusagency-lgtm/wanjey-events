'use client';
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import MagneticButton from "./MagneticButton";
import { ArrowRight, Play, LayoutGrid } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import MediaModal from "./MediaModal";

const mediaItems = [
  { type: 'video', src: '/assets/bigvoices/bv-vid-1.mp4' },
  { type: 'video', src: '/assets/bigvoices/bv-vid-2.mp4' },
  { type: 'video', src: '/assets/bigvoices/bv-vid-3.mp4' },
  { type: 'video', src: '/assets/bigvoices/bv-vid-4.mp4' },
  { type: 'video', src: '/assets/bigvoices/bv-vid-5.mp4' },
  { type: 'video', src: '/assets/bigvoices/bv-vid-6.mp4' },
  { type: 'video', src: '/assets/bigvoices/bv-vid-7.mp4' },
  { type: 'video', src: '/assets/bigvoices/bv-vid-8.mp4' },
  { type: 'video', src: '/assets/bigvoices/bv-vid-9.mp4' },
  { type: 'video', src: '/assets/bigvoices/bv-vid-10.mp4' },
  { type: 'video', src: '/assets/bigvoices/bv-vid-11.mp4' },
  { type: 'video', src: '/assets/bigvoices/bv-vid-12.mp4' },
  { type: 'image', src: '/assets/bigvoices/bv-img-1.jpg' },
  { type: 'image', src: '/assets/bigvoices/bv-img-2.jpg' },
  { type: 'image', src: '/assets/bigvoices/bv-img-3.jpg' },
  { type: 'image', src: '/assets/bigvoices/bv-img-4.jpg' },
  { type: 'image', src: '/assets/bigvoices/bv-img-5.jpg' },
  { type: 'image', src: '/assets/bigvoices/bv-img-6.jpg' },
] as const;

const UpcomingEventSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <>
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
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/80" />
          <div className="absolute inset-0 bg-black/20 mix-blend-overlay" />
        </motion.div>

        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
          <AnimatedSection delay={0.2}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Festival Reveal</span>
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
            <div className="mt-12">
              <MagneticButton intensity={30}>
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  size="lg" 
                  className="bg-accent text-accent-foreground hover:bg-accent/90 px-10 h-16 text-base font-bold shadow-2xl shadow-accent/20 transition-all duration-500 group"
                >
                  <LayoutGrid className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-500" />
                  Explore Event Media
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </MagneticButton>
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
      </section>

      <MediaModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        items={[...mediaItems]} 
      />
    </>
  );
};

export default UpcomingEventSection;
