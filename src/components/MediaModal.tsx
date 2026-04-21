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

  // Sync index when opening with a specific one
  useEffect(() => {
    if (isOpen) setCurrentIndex(initialIndex);
  }, [isOpen, initialIndex]);

  // Handle escape key to close
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
          className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <h3 className="font-serif text-xl text-white">BIGVOICES <span className="italic font-light text-accent">Festival</span></h3>
              <span className="hidden md:block h-4 w-px bg-white/20" />
              <p className="hidden md:block text-xs font-medium uppercase tracking-widest text-white/40">
                Media Item {currentIndex + 1} / {items.length}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <X className="h-6 w-6 text-white group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Main Media Player Area */}
          <div className="relative flex-1 flex items-center justify-center p-4 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentIndex}
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 1.05, opacity: 0, y: -20 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative aspect-video w-full max-w-6xl rounded-2xl border border-white/10 bg-black/40 shadow-[0_0_100px_-20px_rgba(202,163,101,0.2)] overflow-hidden"
              >
                {currentItem.type === 'video' ? (
                  <video 
                    src={currentItem.src} 
                    controls 
                    autoPlay 
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="relative h-full w-full">
                    <Image 
                      src={currentItem.src} 
                      alt="BigVoices Media" 
                      fill 
                      className="object-contain"
                      quality={100}
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button 
              onClick={prev}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white hover:bg-white/10 hover:border-white/30 transition-all group"
            >
              <ChevronLeft className="h-8 w-8 group-hover:-translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={next}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white hover:bg-white/10 hover:border-white/30 transition-all group"
            >
              <ChevronRight className="h-8 w-8 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Thumbnails Strip Navigation */}
          <div className="p-8 bg-black/50 border-t border-white/5 backdrop-blur-md">
            <div className="flex gap-4 max-w-7xl mx-auto px-4 overflow-x-auto pb-4 scrollbar-hide">
              {items.map((item, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative h-16 w-28 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                    currentIndex === idx ? 'border-accent shadow-[0_0_15px_rgba(202,163,101,0.5)]' : 'border-transparent opacity-40 hover:opacity-100'
                  }`}
                >
                  {item.type === 'video' ? (
                    <div className="h-full w-full bg-accent/20 flex items-center justify-center">
                      <Play className="h-4 w-4 text-accent fill-accent" />
                    </div>
                  ) : (
                    <Image src={item.src} alt="thumbnail" fill className="object-cover" />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MediaModal;
