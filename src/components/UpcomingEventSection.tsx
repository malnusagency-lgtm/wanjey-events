'use client';
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import MagneticButton from "./MagneticButton";
import { ArrowRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import MediaModal from "./MediaModal";
import Image from "next/image";

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
  const [bgIndex, setBgIndex] = useState(0);
  
  // Background rotation for "eye-catching" advertising look
  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % mediaItems.length);
    }, 4000); // Rotate every 4 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <section className="relative h-[85vh] md:h-[95vh] w-full overflow-hidden bg-black">
        {/* Dynamic Background Slideshow */}
        <div className="absolute inset-0 z-0 h-full w-full">
          <div className="absolute inset-0 h-full w-full">
            {mediaItems[bgIndex].type === 'video' ? (
              <video
                key={mediaItems[bgIndex].src}
                src={mediaItems[bgIndex].src}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover opacity-90" 
              />
            ) : (
              <Image
                key={mediaItems[bgIndex].src}
                src={mediaItems[bgIndex].src}
                alt="Background"
                fill
                className="object-cover opacity-90"
              />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/80 mix-blend-multiply" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 sm:px-6 text-center">
          <AnimatedSection delay={0.2}>
            <h2 className="font-serif text-5xl font-black leading-tight text-white sm:text-7xl md:text-9xl tracking-tighter drop-shadow-2xl">
              BIGVOICES <em className="italic font-light text-white">FEST</em>
            </h2>
          </AnimatedSection>
          
          <AnimatedSection delay={0.4}>
            <p className="mt-4 font-sans text-lg font-black uppercase tracking-[0.2em] text-white/80 sm:text-2xl drop-shadow-md">
              Season 2: Millennial Edition
            </p>
          </AnimatedSection>

          {/* Bold 6th June Date */}
          <AnimatedSection delay={0.5}>
            <div className="mt-10 flex flex-col items-center">
              <div className="h-px w-24 bg-accent mb-6" />
              <div className="flex flex-col items-center gap-2">
                <span className="font-serif text-6xl font-black text-white sm:text-8xl md:text-[8rem] tracking-tighter drop-shadow-2xl">
                  06 JUNE
                </span>
                <span className="text-sm font-bold uppercase tracking-[0.5em] text-accent sm:text-lg">SAVE THE DATE</span>
              </div>
              <div className="h-px w-24 bg-accent mt-6" />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.6}>
            <div className="mt-12 sm:mt-16">
              <MagneticButton intensity={30}>
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  size="lg" 
                  className="bg-accent text-accent-foreground hover:bg-accent/90 px-10 h-14 text-sm sm:px-16 sm:h-20 sm:text-xl font-black uppercase tracking-[0.2em] shadow-[0_0_50px_-5px_rgba(202,163,101,0.5)] transition-all duration-500 group rounded-full"
                >
                  Join the Movement
                  <ArrowRight className="ml-3 h-5 w-5 sm:ml-4 sm:h-7 sm:w-7 group-hover:translate-x-1 transition-transform duration-300" />
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
