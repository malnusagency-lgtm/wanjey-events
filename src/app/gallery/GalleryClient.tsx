'use client';
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, LayoutGrid, View as CarouselIcon, Columns3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";

type GalleryImage = {
  src: string;
  alt: string;
  category: string;
};

// Masonry height patterns for visual variety
const masonryHeights = ["h-48", "h-64", "h-56", "h-72", "h-52", "h-60", "h-80", "h-48", "h-68", "h-56"];
const ITEMS_PER_PAGE = 12;

export default function GalleryClient() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'masonry' | 'carousel'>('grid');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/media?folder=gallery');
        if (response.ok) {
          const data = await response.json();
          // Filter to only include images and map to gallery structure
          const fetchedImages = data.media
            .filter((item: any) => item.type === 'image')
            .map((item: any, index: number) => {
              // Assign dummy categories for visual variety until Cloudinary tags are implemented
              const categories = ['lifestyle', 'corporate', 'activations'];
              return {
                src: item.url,
                alt: `Event photo ${index + 1}`,
                category: categories[index % categories.length]
              };
            });
          setImages(fetchedImages);
        }
      } catch (error) {
        console.error('Failed to fetch gallery media:', error);
      }
    };
    fetchImages();
  }, []);

  const visible = images.slice(0, visibleCount);
  const hasMore = visibleCount < images.length;

  const openLightbox = (index: number) => {
    setDirection(0);
    setSelectedIndex(index);
    setShowSwipeHint(true);
  };
  const closeLightbox = () => setSelectedIndex(null);

  const goNext = useCallback(() => {
    if (selectedIndex === null) return;
    setDirection(1);
    setSelectedIndex((prev) => (prev! + 1) % images.length);
  }, [selectedIndex, images.length]);

  const goPrev = useCallback(() => {
    if (selectedIndex === null) return;
    setDirection(-1);
    setSelectedIndex((prev) => (prev! - 1 + images.length) % images.length);
  }, [selectedIndex, images.length]);

  // Touch swipe support for lightbox
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
    setTouchStart(null);
  };

  // Keyboard nav + body lock
  useEffect(() => {
    if (selectedIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [selectedIndex, goNext, goPrev]);

  useEffect(() => {
    if (selectedIndex === null) return;
    const t = setTimeout(() => setShowSwipeHint(false), 2500);
    return () => clearTimeout(t);
  }, [selectedIndex]);

  const carouselNext = () => setCarouselIndex((prev) => (prev + 1) % images.length);
  const carouselPrev = () => setCarouselIndex((prev) => (prev - 1 + images.length) % images.length);

  const viewOptions = [
    { key: 'grid' as const, icon: LayoutGrid, label: 'Grid' },
    { key: 'masonry' as const, icon: Columns3, label: 'Masonry' },
    { key: 'carousel' as const, icon: CarouselIcon, label: 'Carousel' },
  ];

  return (
    <>
      <section className="py-8 md:py-16">
        <div className="container">
          <AnimatedSection className="text-center max-w-4xl mx-auto">
            <div className="glass-card p-6 md:p-12">
              <p className="section-label">Gallery</p>
              <h1 className="section-heading">Event Highlights</h1>
              <p className="section-subtext">
                Discover our impactful events and stunning setups.
              </p>
            </div>
          </AnimatedSection>

          {/* View Toggle */}
          <div className="mt-4 flex justify-center gap-2">
            {viewOptions.map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setViewMode(key)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-bold transition-all duration-300 ${
                  viewMode === key 
                  ? "bg-foreground text-background" 
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="h-3 w-3" />
                {label}
              </button>
            ))}
          </div>

          <div className="mt-6 md:mt-10">
            <AnimatePresence mode="wait">
              {/* === MASONRY VIEW === */}
              {viewMode === 'masonry' && (
                <motion.div
                  key="masonry"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 xl:columns-5">
                    {visible.map((img, i) => (
                      <motion.div
                        key={img.src}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.02 }}
                        className="mb-3 break-inside-avoid"
                      >
                        <div
                          className="group relative cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500"
                          onClick={() => openLightbox(i)}
                        >
                          <div className={`relative ${masonryHeights[i % masonryHeights.length]} sm:${masonryHeights[(i + 3) % masonryHeights.length]}`}>
                            <Image
                              src={img.src}
                              alt={img.alt}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                              loading="lazy"
                            />
                            {/* Hover overlay - simplified for premium look */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {hasMore && (
                    <AnimatedSection className="mt-10 text-center">
                      <Button
                        size="lg"
                        onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                        className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold px-10 shadow-lg shadow-accent/20"
                      >
                        View More
                      </Button>
                    </AnimatedSection>
                  )}
                </motion.div>
              )}

              {/* === GRID VIEW === */}
              {viewMode === 'grid' && (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {visible.map((img, i) => (
                      <motion.div
                        key={img.src}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.35, delay: i * 0.02 }}
                      >
                        <div
                          className="group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500"
                          onClick={() => openLightbox(i)}
                        >
                          <div className="relative aspect-square">
                            <Image
                              src={img.src}
                              alt={img.alt}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {hasMore && (
                    <AnimatedSection className="mt-10 text-center">
                      <Button
                        size="lg"
                        onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                        className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold px-10 shadow-lg shadow-accent/20"
                      >
                        View More
                      </Button>
                    </AnimatedSection>
                  )}
                </motion.div>
              )}

              {/* === CAROUSEL VIEW === */}
              {viewMode === 'carousel' && (
                <motion.div
                  key="carousel"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="relative mx-auto max-w-5xl"
                >
                  <div className="relative aspect-[4/5] sm:aspect-[16/9] overflow-hidden rounded-2xl bg-black/5 shadow-2xl">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={carouselIndex}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0"
                      >
                        {images[carouselIndex] && (
                          <Image
                            src={images[carouselIndex].src}
                            alt={images[carouselIndex].alt}
                            fill
                            className="object-cover"
                            priority
                          />
                        )}
                      </motion.div>
                    </AnimatePresence>

                    {/* Counter badge */}
                    <div className="absolute top-4 right-4 z-10 rounded-full bg-black/40 backdrop-blur-md px-3 py-1 text-xs font-bold text-white">
                      {carouselIndex + 1} / {images.length}
                    </div>

                    {/* Navigation */}
                    <button
                      onClick={carouselPrev}
                      className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 z-10"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={carouselNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 z-10"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </div>
                  
                  {/* Thumbnails below carousel */}
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCarouselIndex(idx)}
                        className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                          carouselIndex === idx ? 'border-accent scale-105 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'
                        }`}
                      >
                        <Image src={img.src} alt="thumb" fill className="object-cover" loading="lazy" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Premium Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md"
            onClick={closeLightbox}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Close button */}
            <button onClick={closeLightbox} className="absolute right-4 top-12 sm:top-4 z-10 p-3 text-white/80 hover:text-white transition-colors">
              <X className="h-7 w-7" />
            </button>

            {/* Image counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 text-sm font-bold text-white">
              {selectedIndex + 1} / {images.length}
            </div>
            
            {/* Navigation buttons */}
            <button onClick={(e) => { e.stopPropagation(); goPrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white transition-colors hidden md:flex h-14 w-14 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-sm">
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); goNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white transition-colors hidden md:flex h-14 w-14 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-sm">
              <ChevronRight className="h-8 w-8" />
            </button>

            {/* Main image */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative max-h-[80vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              {images[selectedIndex as number] && (
                <Image
                  src={images[selectedIndex as number].src}
                  alt={images[selectedIndex as number].alt}
                  width={1200}
                  height={900}
                  className="max-h-[80vh] rounded-xl object-contain"
                  priority
                />
              )}
            </motion.div>

            {/* Swipe hint on mobile */}
            <AnimatePresence>
              {showSwipeHint && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 text-xs text-white md:hidden"
                >
                  ← Swipe to navigate →
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
