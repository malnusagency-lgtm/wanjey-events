'use client';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";
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
}

const MediaModal = ({ isOpen, onClose, items, initialIndex = 0 }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) setCurrentIndex(initialIndex);
  }, [isOpen, initialIndex]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!items.length) return null;

  const currentItem = items[currentIndex];

  const next = () => setCurrentIndex((prev) => (prev + 1) % items.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col bg-black/98"
        >
          {/* Header - Minimalized */}
          <div className="absolute top-0 left-0 right-0 z-[110] flex items-center justify-between p-6 bg-gradient-to-b from-black/60 to-transparent">
            <h3 className="font-serif text-xl font-bold text-white tracking-tight uppercase">BIGVOICES</h3>
            <button 
              onClick={onClose}
              className="group flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
            >
              <X className="h-6 w-6 text-white group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Main Media Player - Full Height/Width with Swiping */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentIndex}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 100) prev();
                  else if (info.offset.x < -100) next();
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="relative h-full w-full flex items-center justify-center touch-none"
              >
                {currentItem.type === 'video' ? (
                  <video 
                    src={currentItem.src} 
                    controls 
                    autoPlay 
                    playsInline
                    preload="auto"
                    className="h-full w-full object-contain md:max-h-[85vh]"
                  />
                ) : (
                  <div className="relative h-full w-full">
                    <Image 
                      src={currentItem.src} 
                      alt="BigVoices Media" 
                      fill 
                      className="object-contain md:max-h-[85vh]"
                      quality={100}
                      priority
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows — smaller on mobile */}
            <button 
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-[120]"
            >
              <ChevronLeft className="h-5 w-5 md:h-8 md:w-8" />
            </button>
            <button 
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-[120]"
            >
              <ChevronRight className="h-5 w-5 md:h-8 md:w-8" />
            </button>
          </div>

          {/* Dot indicators on mobile, Thumbnails on sm+ */}
          <div className="sm:hidden p-3 bg-black border-t border-white/10">
            <div className="flex justify-center gap-1.5 overflow-x-auto">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${currentIndex === idx ? 'w-6 bg-accent' : 'w-2 bg-white/30'}`}
                  aria-label={`Go to item ${idx + 1}`}
                />
              ))}
            </div>
          </div>
          <div className="hidden sm:block p-4 bg-black border-t border-white/10">
            <div className="flex gap-3 max-w-5xl mx-auto overflow-x-auto pb-2 scrollbar-hide">
              {items.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative h-14 w-24 shrink-0 overflow-hidden rounded-md border-2 transition-all duration-300 ${
                    currentIndex === idx ? 'border-accent' : 'border-transparent opacity-40'
                  }`}
                >
                  {item.type === 'video' ? (
                    <div className="h-full w-full bg-accent/20 flex items-center justify-center">
                      <Play className="h-3 w-3 text-accent fill-accent" />
                    </div>
                  ) : (
                    <Image src={item.src} alt="thumbnail" fill className="object-cover" />
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
