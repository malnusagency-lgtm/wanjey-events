'use client';
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import MagneticButton from "./MagneticButton";
import { ArrowRight, LayoutGrid } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import MediaModal from "./MediaModal";

const mediaItems = [
  { type: 'video', src: '/assets/bigvoices/bv-vid-1.mp4' },
  { type: 'image', src: '/assets/bigvoices/bv-img-1.jpg' },
  { type: 'video', src: '/assets/bigvoices/bv-vid-2.mp4' },
  { type: 'image', src: '/assets/bigvoices/bv-img-2.jpg' },
  { type: 'video', src: '/assets/bigvoices/bv-vid-3.mp4' },
  { type: 'image', src: '/assets/bigvoices/bv-img-3.jpg' },
  { type: 'video', src: '/assets/bigvoices/bv-vid-4.mp4' },
  { type: 'image', src: '/assets/bigvoices/bv-img-4.jpg' },
  { type: 'video', src: '/assets/bigvoices/bv-vid-5.mp4' },
  { type: 'image', src: '/assets/bigvoices/bv-img-5.jpg' },
  { type: 'video', src: '/assets/bigvoices/bv-vid-6.mp4' },
  { type: 'image', src: '/assets/bigvoices/bv-img-6.jpg' },
  { type: 'video', src: '/assets/bigvoices/bv-vid-7.mp4' },
  { type: 'video', src: '/assets/bigvoices/bv-vid-8.mp4' },
  { type: 'video', src: '/assets/bigvoices/bv-vid-9.mp4' },
  { type: 'video', src: '/assets/bigvoices/bv-vid-10.mp4' },
  { type: 'video', src: '/assets/bigvoices/bv-vid-11.mp4' },
  { type: 'video', src: '/assets/bigvoices/bv-vid-12.mp4' },
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
        {/* Sharp Background Media - No Blur, High Opacity */}
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
            className="h-full w-full object-cover opacity-80" 
          />
          {/* Minimal gradient to ensure text readability without blurring the video */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/40" />
        </motion.div>

        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
          <AnimatedSection delay={0.2}>
            <h2 className="font-serif text-6xl font-black leading-tight text-white md:text-8xl lg:text-[9rem] tracking-tighter drop-shadow-2xl">
              BIGVOICES <em className="italic font-light text-accent">FEST</em>
            </h2>
          </AnimatedSection>
          
          <AnimatedSection delay={0.4}>
            <p className="mt-4 font-sans text-xl font-black uppercase tracking-[0.4em] text-white md:text-2xl drop-shadow-md">
              Season 2: Millennial Edition
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.5}>
            <div className="mt-10 mb-2 py-2 px-8 border-y border-white/20">
              <p className="font-sans text-3xl font-black uppercase tracking-[0.2em] text-accent md:text-4xl">
                6th June
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.6}>
            <div className="mt-8">
              <MagneticButton intensity={30}>
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  size="lg" 
                  className="bg-accent text-accent-foreground hover:bg-accent/90 px-14 h-16 text-lg font-black uppercase tracking-widest shadow-[0_0_40px_-5px_rgba(202,163,101,0.4)] transition-all duration-500 group"
                >
                  Explore More
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </MagneticButton>
            </div>
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
// Finalized UpcomingEventSection
