'use client';
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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

// Target date for the event
const EVENT_DATE = new Date('2025-06-06T18:00:00+03:00');

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now.getTime());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

const UpcomingEventSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const countdown = useCountdown(EVENT_DATE);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isModalOpen) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {
          // Ignore autoplay errors
        });
      }
    }
  }, [isModalOpen]);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <>
      <section ref={ref} className="relative h-[80vh] md:h-[90vh] w-full overflow-hidden bg-black">
        <motion.div 
          className="absolute inset-0 z-0 h-[120%] w-full" 
          style={{ y, top: "-10%" }}
        >
          <video
            ref={videoRef}
            src="/assets/bigvoices/bv-vid-1.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover opacity-80" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/40" />
        </motion.div>

        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 sm:px-6 text-center">
          <AnimatedSection delay={0.2}>
            <h2 className="font-serif text-4xl font-black leading-tight text-white sm:text-6xl md:text-8xl lg:text-[9rem] tracking-tighter drop-shadow-2xl">
              BIGVOICES <em className="italic font-light text-accent">FEST</em>
            </h2>
          </AnimatedSection>
          
          <AnimatedSection delay={0.4}>
            <p className="mt-3 sm:mt-4 font-sans text-sm font-black uppercase tracking-[0.15em] text-white sm:text-xl sm:tracking-[0.4em] md:text-2xl drop-shadow-md">
              Season 2: Millennial Edition
            </p>
          </AnimatedSection>

          {/* Countdown Timer */}
          <AnimatedSection delay={0.5}>
            <div className="mt-6 sm:mt-10 grid grid-cols-4 gap-2 sm:gap-4">
              {[
                { val: countdown.days, label: 'Days' },
                { val: countdown.hours, label: 'Hrs' },
                { val: countdown.minutes, label: 'Min' },
                { val: countdown.seconds, label: 'Sec' },
              ].map((unit) => (
                <div key={unit.label} className="flex flex-col items-center">
                  <span className="font-sans text-3xl font-black text-accent tabular-nums sm:text-5xl md:text-6xl drop-shadow-lg">
                    {String(unit.val).padStart(2, '0')}
                  </span>
                  <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 sm:text-xs">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.6}>
            <div className="mt-6 sm:mt-8">
              <MagneticButton intensity={30}>
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  size="lg" 
                  className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 h-12 text-sm sm:px-14 sm:h-16 sm:text-lg font-black uppercase tracking-widest shadow-[0_0_40px_-5px_rgba(202,163,101,0.4)] transition-all duration-500 group"
                >
                  Explore More
                  <ArrowRight className="ml-2 h-5 w-5 sm:ml-3 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform duration-300" />
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
