'use client';
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import Image from "next/image";

interface MediaItem {
  type: 'image' | 'video';
  src: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: MediaItem[];
  initialIndex?: number;
  bgVideos?: { src: string }[];
}

const MediaModal = ({ isOpen, onClose, items, initialIndex = 0, bgVideos = [] }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsPlaying(true);
    }
  }, [isOpen, initialIndex]);

  const next = useCallback(() => setCurrentIndex((prev) => (prev + 1) % items.length), [items.length]);
  const prev = useCallback(() => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length), [items.length]);

  // Slideshow logic
  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    
    const interval = setInterval(() => {
      next();
    }, 6000); // 6 seconds per item
    
    return () => clearInterval(interval);
  }, [isOpen, isPlaying, next]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === ' ') setIsPlaying(p => !p);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, next, prev]);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) {
      if (diff > 0) next();
      else prev();
    }
    setTouchStart(null);
  };

  if (!items.length) return null;

  const currentItem = items[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-md"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Ultra-premium background - Blurred videos cycling */}
          {bgVideos.length > 0 && (
            <div className="absolute inset-0 z-0 opacity-30 blur-2xl scale-110 overflow-hidden">
               {bgVideos.map((vid, idx) => (
                 <video
                   key={vid.src}
                   src={vid.src}
                   autoPlay
                   muted
                   loop
                   playsInline
                   className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                     (currentIndex % bgVideos.length) === idx ? 'opacity-100' : 'opacity-0'
                   }`}
                 />
               ))}
            </div>
          )}

          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-[110] flex items-center justify-between p-4 sm:p-8 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
            <div className="flex flex-col">
              <h3 className="font-serif text-xl sm:text-2xl font-black text-white tracking-tighter uppercase drop-shadow-lg">BIGVOICES <span className="text-accent italic font-light ml-2">FEST</span></h3>
              <p className="text-[10px] sm:text-xs text-white/60 font-bold uppercase tracking-[0.3em] mt-1">Join The Movement</p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all text-white"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
              </button>
              <span className="rounded-full bg-white/10 backdrop-blur-md px-4 py-2 text-xs font-black text-white border border-white/10 shadow-xl">
                {currentIndex + 1} <span className="mx-1 opacity-40">/</span> {items.length}
              </span>
              <button 
                onClick={onClose}
                className="group flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all duration-300 border border-white/10"
              >
                <X className="h-5 w-5 sm:h-7 sm:w-7 text-white group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>
          </div>

          {/* Main Media Player */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden px-4 py-20 z-10">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ 
                  duration: 0.4, 
                  ease: [0.22, 1, 0.36, 1], // Custom premium cubic-bezier
                }}
                className="relative h-full w-full flex items-center justify-center"
              >
                {currentItem.type === 'video' ? (
                  <div className="relative h-full w-full flex items-center justify-center group/video">
                    <video 
                      key={currentItem.src}
                      src={currentItem.src} 
                      controls 
                      autoPlay 
                      playsInline
                      preload="auto"
                      className="h-full w-full object-contain md:max-h-[80vh] rounded-2xl shadow-2xl shadow-black/50 border border-white/5"
                    />
                  </div>
                ) : (
                  <div className="relative h-full w-full flex items-center justify-center">
                    <Image 
                      src={currentItem.src} 
                      alt="BigVoices Media" 
                      fill 
                      className="object-contain md:max-h-[80vh] rounded-2xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                      quality={100}
                      priority
                      sizes="(max-width: 1280px) 100vw, 1280px"
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button 
              onClick={prev}
              className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/20 backdrop-blur-xl transition-all duration-500 z-[120] border border-white/5 hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>
            <button 
              onClick={next}
              className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/20 backdrop-blur-xl transition-all duration-500 z-[120] border border-white/5 hover:scale-110 active:scale-95"
            >
              <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="p-4 sm:p-6 bg-gradient-to-t from-black via-black/80 to-transparent border-t border-white/5 z-20">
            <div className="flex gap-2 sm:gap-4 max-w-6xl mx-auto overflow-x-auto pb-2 scrollbar-hide snap-x">
              {items.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setIsPlaying(false);
                  }}
                  className={`relative h-16 w-24 sm:h-20 sm:w-36 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-500 snap-center ${
                    currentIndex === idx 
                      ? 'border-accent scale-110 shadow-2xl shadow-accent/40 z-30' 
                      : 'border-white/10 opacity-30 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  {item.type === 'video' ? (
                    <div className="h-full w-full bg-accent/20 flex items-center justify-center">
                      <Play className="h-5 w-5 sm:h-6 sm:w-6 text-accent fill-accent" />
                    </div>
                  ) : (
                    <Image src={item.src} alt="thumbnail" fill className="object-cover" loading="lazy" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MediaModal;
