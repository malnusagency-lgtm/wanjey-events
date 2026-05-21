'use client';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import MagneticButton from "./MagneticButton";
import { ArrowRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import MediaModal from "./MediaModal";

type MediaItem = {
  id?: string;
  src: string;
  type: 'video' | 'image';
};

type EventData = {
  title: string;
  subtitle: string;
  event_date: string;
  save_the_date_text: string;
  cta_text: string;
};

const UpcomingEventSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [bgVideos, setBgVideos] = useState<MediaItem[]>([]);
  const [eventData, setEventData] = useState<EventData>({
    title: 'BIGVOICES FEST',
    subtitle: 'Season 2: Millennial Edition',
    event_date: '6TH JUNE',
    save_the_date_text: 'SAVE THE DATE',
    cta_text: 'Join the Movement',
  });

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await fetch('/api/media?folder=bigvoices');
        if (response.ok) {
          const data = await response.json();
          // Transform to match existing structure 
          // Cloudinary type might be 'image' or 'video'
          const items = data.media.map((item: any) => ({
            type: item.type,
            src: item.url,
          }));
          setMediaItems(items);
          setBgVideos(items.filter((item: any) => item.type === 'video'));
        }
      } catch (error) {
        console.error('Failed to fetch bigvoices media:', error);
      }
    };

    const fetchEvent = async () => {
      try {
        const response = await fetch('/api/events');
        if (response.ok) {
          const data = await response.json();
          if (data && !data.error) {
            setEventData({
              title: data.title || 'BIGVOICES FEST',
              subtitle: data.subtitle || 'Season 2: Millennial Edition',
              event_date: data.event_date || '6TH JUNE',
              save_the_date_text: data.save_the_date_text || 'SAVE THE DATE',
              cta_text: data.cta_text || 'Join the Movement',
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch event data:', error);
      }
    };

    fetchMedia();
    fetchEvent();
  }, []);

  useEffect(() => {
    if (bgVideos.length === 0) return;
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgVideos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bgVideos.length]);

  const renderTitle = (title: string) => {
    const words = title.trim().split(/\s+/);
    if (words.length <= 1) return title;
    const lastWord = words.pop();
    return (
      <>
        {words.join(' ')} <em className="italic font-light text-white">{lastWord}</em>
      </>
    );
  };

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
            <h2 className="font-serif text-3xl font-black leading-tight text-white sm:text-7xl md:text-9xl tracking-tighter drop-shadow-2xl uppercase">
              {renderTitle(eventData.title)}
            </h2>
          </AnimatedSection>
          
          <AnimatedSection delay={0.4}>
            <p className="mt-4 font-sans text-lg font-black uppercase tracking-[0.2em] text-white sm:text-2xl drop-shadow-md text-balance">
              {eventData.subtitle}
            </p>
          </AnimatedSection>
 
          {/* Bold Event Date — Changed to White */}
          <AnimatedSection delay={0.5}>
            <div className="mt-6 md:mt-10 flex flex-col items-center">
              <div className="h-px w-24 bg-white/40 mb-6" />
              <div className="flex flex-col items-center gap-2">
                <span className="font-serif text-4xl font-black text-white sm:text-8xl md:text-[8.5rem] tracking-tighter drop-shadow-2xl uppercase leading-none">
                  {eventData.event_date}
                </span>
                <span className="text-sm font-bold uppercase tracking-[0.6em] text-white sm:text-xl">
                  {eventData.save_the_date_text}
                </span>
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
                  {eventData.cta_text}
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
