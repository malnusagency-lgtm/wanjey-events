'use client';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import MagneticButton from "./MagneticButton";
import { ArrowRight } from "lucide-react";
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

const bgVideos = mediaItems.filter(item => item.type === 'video');

const UpcomingEventSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgVideos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <section className="relative h-[75vh] md:h-[95vh] w-full overflow-hidden bg-black">
        {/* Dynamic Background — Videos only, smooth transitions */}
        <div className="absolute inset-0 z-0 h-full w-full">
          {bgVideos.map((item, idx) => (
            <div 
              key={item.src} 
              className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ease-in-out ${idx === bgIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <video
                src={item.src}
                autoPlay
                muted
                loop
                playsInline
                preload={idx <= 1 ? "auto" : "none"}
                className="h-full w-full object-cover grayscale-[0.2] contrast-[1.1]" 
              />
            </div>
          ))}
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/40 via-transparent to-black/30" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4 sm:px-6 text-center">
          <AnimatedSection delay={0.2}>
            <h2 className="font-serif text-3xl font-black leading-tight text-white sm:text-7xl md:text-9xl tracking-tighter drop-shadow-2xl">
              BIGVOICES <em className="italic font-light text-white">FEST</em>
            </h2>
          </AnimatedSection>
          
          <AnimatedSection delay={0.4}>
            <p className="mt-4 font-sans text-lg font-black uppercase tracking-[0.2em] text-white sm:text-2xl drop-shadow-md text-balance">
              Season 2: Millennial Edition
            </p>
          </AnimatedSection>
 
          {/* Bold 6th June Date — Changed to White */}
          <AnimatedSection delay={0.5}>
            <div className="mt-6 md:mt-10 flex flex-col items-center">
              <div className="h-px w-24 bg-white/40 mb-6" />
              <div className="flex flex-col items-center gap-2">
                <span className="font-serif text-4xl font-black text-white sm:text-8xl md:text-[8.5rem] tracking-tighter drop-shadow-2xl uppercase leading-none">
                  6TH JUNE
                </span>
                <span className="text-sm font-bold uppercase tracking-[0.6em] text-white sm:text-xl">SAVE THE DATE</span>
              </div>
              <div className="h-px w-24 bg-white/40 mt-6" />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.6}>
            <div className="mt-8 sm:mt-16">
              <MagneticButton intensity={40}>
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  size="lg" 
                  className="bg-accent text-accent-foreground hover:bg-accent/90 px-10 h-16 text-base sm:px-20 sm:h-24 sm:text-2xl font-black uppercase tracking-[0.3em] shadow-[0_0_70px_-5px_rgba(202,163,101,0.6)] transition-all duration-500 group rounded-full border-2 border-white/10"
                >
                  Join the Movement
                  <ArrowRight className="ml-3 h-6 w-6 sm:ml-5 sm:h-8 sm:w-8 group-hover:translate-x-2 transition-transform duration-300" />
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
        bgVideos={bgVideos}
      />
    </>
  );
};

export default UpcomingEventSection;
