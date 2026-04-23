'use client';
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, LayoutGrid, View as CarouselIcon, Columns3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";

const images = [
  { src: "/assets/gallery/event-1.jpg", alt: "Birthday party balloon setup" },
  { src: "/assets/gallery/event-2.jpg", alt: "Event balloon decor" },
  { src: "/assets/gallery/event-3.jpg", alt: "Themed birthday backdrop" },
  { src: "/assets/gallery/event-4.jpg", alt: "Party decorations" },
  { src: "/assets/gallery/event-5.jpg", alt: "Birthday celebration setup" },
  { src: "/assets/gallery/event-6.jpg", alt: "Balloon arch arrangement" },
  { src: "/assets/gallery/event-7.jpg", alt: "Kids party decoration" },
  { src: "/assets/gallery/event-8.jpg", alt: "Birthday event styling" },
  { src: "/assets/gallery/event-9.jpg", alt: "Celebration event decor" },
  { src: "/assets/gallery/event-10.jpg", alt: "Birthday balloon backdrop" },
  { src: "/assets/gallery/event-11.jpg", alt: "Corporate event setup" },
  { src: "/assets/gallery/event-12.jpg", alt: "Elegant dinner table setting" },
  { src: "/assets/gallery/event-13.jpg", alt: "Gold charger plate detail" },
  { src: "/assets/gallery/event-14.jpg", alt: "Formal dining arrangement" },
  { src: "/assets/gallery/event-15.jpg", alt: "Birthday party theme" },
  { src: "/assets/gallery/event-16.jpg", alt: "Table centrepiece floral" },
  { src: "/assets/gallery/event-17.jpg", alt: "Party balloon arrangement" },
  { src: "/assets/gallery/event-18.jpg", alt: "Celebration backdrop setup" },
  { src: "/assets/gallery/event-19.jpg", alt: "Garden party table layout" },
  { src: "/assets/gallery/event-20.jpg", alt: "Outdoor event dining setup" },
  { src: "/assets/gallery/event-21.jpg", alt: "Themed celebration decor" },
  { src: "/assets/gallery/event-22.jpg", alt: "Event venue preparation" },
  { src: "/assets/gallery/event-23.jpg", alt: "Formal event table design" },
  { src: "/assets/gallery/event-24.jpg", alt: "Birthday party styling" },
  { src: "/assets/gallery/event-25.jpg", alt: "Corporate dinner setting" },
  { src: "/assets/gallery/event-26.jpg", alt: "Balloon decoration arch" },
  { src: "/assets/gallery/event-27.jpg", alt: "Elegant table arrangement" },
  { src: "/assets/gallery/event-28.jpg", alt: "Party decor details" },
  { src: "/assets/gallery/event-29.jpg", alt: "Premium dining setup" },
  { src: "/assets/gallery/event-30.jpg", alt: "Table napkin fold detail" },
  { src: "/assets/gallery/event-31.jpg", alt: "Festival brand activation" },
  { src: "/assets/gallery/event-32.jpg", alt: "Event activation booth" },
  { src: "/assets/gallery/event-33.jpg", alt: "Brand activation setup" },
  { src: "/assets/gallery/event-34.jpg", alt: "Festival event branding" },
  { src: "/assets/gallery/event-35.jpg", alt: "Outdoor brand activation" },
  { src: "/assets/gallery/event-36.jpg", alt: "Activation decor styling" },
  { src: "/assets/gallery/event-37.jpg", alt: "Event brand experience" },
  { src: "/assets/gallery/event-38.jpg", alt: "Festival activation stage" },
  { src: "/assets/gallery/event-39.jpg", alt: "Corporate event styling" },
  { src: "/assets/gallery/event-40.jpg", alt: "Dinner event centrepiece" },
  { src: "/assets/gallery/event-41.jpg", alt: "Themed party backdrop" },
  { src: "/assets/gallery/event-42.jpg", alt: "Table decor arrangement" },
  { src: "/assets/gallery/event-43.jpg", alt: "Balloon arch celebration" },
  { src: "/assets/gallery/event-44.jpg", alt: "Elegant venue setup" },
  { src: "/assets/gallery/event-45.jpg", alt: "Birthday event backdrop" },
  { src: "/assets/gallery/event-46.jpg", alt: "Event table styling" },
  { src: "/assets/gallery/event-47.jpg", alt: "Celebration decor detail" },
  { src: "/assets/gallery/event-48.jpg", alt: "Premium table arrangement" },
  { src: "/assets/gallery/event-49.jpg", alt: "Festival photo moment" },
  { src: "/assets/gallery/event-50.jpg", alt: "Festival activation moment" },
  { src: "/assets/gallery/event-51.jpg", alt: "Party decor styling" },
  { src: "/assets/gallery/event-52.jpg", alt: "Dining event detail" },
  { src: "/assets/gallery/event-53.jpg", alt: "Birthday styling detail" },
  { src: "/assets/gallery/event-54.jpg", alt: "Event table presentation" },
  { src: "/assets/gallery/event-55.jpg", alt: "Party balloon styling" },
  { src: "/assets/gallery/event-56.jpg", alt: "Event decor highlight" },
  { src: "/assets/gallery/event-57.jpg", alt: "Brand activation event" },
  { src: "/assets/gallery/event-58.jpg", alt: "Event experience setup" },
  { src: "/assets/gallery/event-59.jpg", alt: "Formal event arrangement" },
  { src: "/assets/gallery/event-60.jpg", alt: "Corporate decor detail" },
  { src: "/assets/gallery/event-61.jpg", alt: "Birthday celebration theme" },
  { src: "/assets/gallery/event-62.jpg", alt: "Table setting highlight" },
  { src: "/assets/gallery/event-63.jpg", alt: "Event celebration decor" },
  { src: "/assets/gallery/event-64.jpg", alt: "Activation branding detail" },
  { src: "/assets/gallery/event-65.jpg", alt: "Event venue detail" },
  { src: "/assets/gallery/event-66.jpg", alt: "Birthday decor theme" },
  { src: "/assets/gallery/event-67.jpg", alt: "Dinner event styling" },
  { src: "/assets/gallery/event-68.jpg", alt: "Celebration detail shot" },
  { src: "/assets/gallery/event-69.jpg", alt: "Premium event arrangement" },
  { src: "/assets/gallery/event-70.jpg", alt: "Party event highlight" },
];

// Masonry height patterns for visual variety
const masonryHeights = ["h-48", "h-64", "h-56", "h-72", "h-52", "h-60", "h-80", "h-48", "h-68", "h-56"];
const ITEMS_PER_PAGE = 12;

export default function GalleryClient() {
  const [viewMode, setViewMode] = useState<'grid' | 'masonry' | 'carousel'>('masonry');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  
  // Carousel specific state
  const [carouselIndex, setCarouselIndex] = useState(0);

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
  }, [selectedIndex]);

  const goPrev = useCallback(() => {
    if (selectedIndex === null) return;
    setDirection(-1);
    setSelectedIndex((prev) => (prev! - 1 + images.length) % images.length);
  }, [selectedIndex]);

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
    { key: 'masonry' as const, icon: Columns3, label: 'Masonry' },
    { key: 'grid' as const, icon: LayoutGrid, label: 'Grid' },
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
          <div className="mt-6 md:mt-10 flex justify-center gap-3">
            {viewOptions.map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setViewMode(key)}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
                  viewMode === key 
                  ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20" 
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                <Icon className="h-4 w-4" />
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
                            {/* Hover overlay with title */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                              <p className="text-white text-xs font-medium truncate">{img.alt}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {hasMore && (
                    <AnimatedSection className="mt-10 text-center">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                        className="font-sans px-10"
                      >
                        View More ({images.length - visibleCount} remaining)
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
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-3">
                              <p className="text-white text-xs font-medium truncate">{img.alt}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {hasMore && (
                    <AnimatedSection className="mt-10 text-center">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                        className="font-sans px-10"
                      >
                        View More ({images.length - visibleCount} remaining)
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
                  <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-black/5 shadow-2xl">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={carouselIndex}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={images[carouselIndex].src}
                          alt={images[carouselIndex].alt}
                          fill
                          className="object-cover"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      </motion.div>
                    </AnimatePresence>

                    {/* Counter badge */}
                    <div className="absolute top-4 right-4 z-10 rounded-full bg-black/40 backdrop-blur-md px-3 py-1 text-xs font-bold text-white">
                      {carouselIndex + 1} / {images.length}
                    </div>

                    {/* Caption */}
                    <div className="absolute bottom-4 left-4 z-10">
                      <p className="text-white text-sm font-medium drop-shadow-lg">{images[carouselIndex].alt}</p>
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
              <Image
                src={images[selectedIndex].src}
                alt={images[selectedIndex].alt}
                width={1200}
                height={900}
                className="max-h-[80vh] rounded-xl object-contain"
                priority
              />
              {/* Caption */}
              <p className="absolute bottom-4 left-0 right-0 text-center text-sm text-white/80 font-medium drop-shadow-lg">
                {images[selectedIndex].alt}
              </p>
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
