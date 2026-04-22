'use client';
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";

const images = [
  { src: "/assets/gallery/event-1.jpg", category: "Celebrations", alt: "Birthday party balloon setup" },
  { src: "/assets/gallery/event-2.jpg", category: "Celebrations", alt: "Event balloon decor" },
  { src: "/assets/gallery/event-3.jpg", category: "Celebrations", alt: "Themed birthday backdrop" },
  { src: "/assets/gallery/event-4.jpg", category: "Celebrations", alt: "Party decorations" },
  { src: "/assets/gallery/event-5.jpg", category: "Celebrations", alt: "Birthday celebration setup" },
  { src: "/assets/gallery/event-6.jpg", category: "Celebrations", alt: "Balloon arch arrangement" },
  { src: "/assets/gallery/event-7.jpg", category: "Celebrations", alt: "Kids party decoration" },
  { src: "/assets/gallery/event-8.jpg", category: "Celebrations", alt: "Birthday event styling" },
  { src: "/assets/gallery/event-9.jpg", category: "Celebrations", alt: "Celebration event decor" },
  { src: "/assets/gallery/event-10.jpg", category: "Celebrations", alt: "Birthday balloon backdrop" },
  { src: "/assets/gallery/event-11.jpg", category: "Corporate", alt: "Corporate event setup" },
  { src: "/assets/gallery/event-12.jpg", category: "Corporate", alt: "Elegant dinner table setting" },
  { src: "/assets/gallery/event-13.jpg", category: "Corporate", alt: "Gold charger plate detail" },
  { src: "/assets/gallery/event-14.jpg", category: "Corporate", alt: "Formal dining arrangement" },
  { src: "/assets/gallery/event-15.jpg", category: "Celebrations", alt: "Birthday party theme" },
  { src: "/assets/gallery/event-16.jpg", category: "Corporate", alt: "Table centrepiece floral" },
  { src: "/assets/gallery/event-17.jpg", category: "Celebrations", alt: "Party balloon arrangement" },
  { src: "/assets/gallery/event-18.jpg", category: "Celebrations", alt: "Celebration backdrop setup" },
  { src: "/assets/gallery/event-19.jpg", category: "Corporate", alt: "Garden party table layout" },
  { src: "/assets/gallery/event-20.jpg", category: "Corporate", alt: "Outdoor event dining setup" },
  { src: "/assets/gallery/event-21.jpg", category: "Celebrations", alt: "Themed celebration decor" },
  { src: "/assets/gallery/event-22.jpg", category: "Corporate", alt: "Event venue preparation" },
  { src: "/assets/gallery/event-23.jpg", category: "Corporate", alt: "Formal event table design" },
  { src: "/assets/gallery/event-24.jpg", category: "Celebrations", alt: "Birthday party styling" },
  { src: "/assets/gallery/event-25.jpg", category: "Corporate", alt: "Corporate dinner setting" },
  { src: "/assets/gallery/event-26.jpg", category: "Celebrations", alt: "Balloon decoration arch" },
  { src: "/assets/gallery/event-27.jpg", category: "Corporate", alt: "Elegant table arrangement" },
  { src: "/assets/gallery/event-28.jpg", category: "Celebrations", alt: "Party decor details" },
  { src: "/assets/gallery/event-29.jpg", category: "Corporate", alt: "Premium dining setup" },
  { src: "/assets/gallery/event-30.jpg", category: "Corporate", alt: "Table napkin fold detail" },
  { src: "/assets/gallery/event-31.jpg", category: "Activations", alt: "Festival brand activation" },
  { src: "/assets/gallery/event-32.jpg", category: "Activations", alt: "Event activation booth" },
  { src: "/assets/gallery/event-33.jpg", category: "Activations", alt: "Brand activation setup" },
  { src: "/assets/gallery/event-34.jpg", category: "Activations", alt: "Festival event branding" },
  { src: "/assets/gallery/event-35.jpg", category: "Activations", alt: "Outdoor brand activation" },
  { src: "/assets/gallery/event-36.jpg", category: "Activations", alt: "Activation decor styling" },
  { src: "/assets/gallery/event-37.jpg", category: "Activations", alt: "Event brand experience" },
  { src: "/assets/gallery/event-38.jpg", category: "Activations", alt: "Festival activation stage" },
  { src: "/assets/gallery/event-39.jpg", category: "Corporate", alt: "Corporate event styling" },
  { src: "/assets/gallery/event-40.jpg", category: "Corporate", alt: "Dinner event centrepiece" },
  { src: "/assets/gallery/event-41.jpg", category: "Celebrations", alt: "Themed party backdrop" },
  { src: "/assets/gallery/event-42.jpg", category: "Corporate", alt: "Table decor arrangement" },
  { src: "/assets/gallery/event-43.jpg", category: "Celebrations", alt: "Balloon arch celebration" },
  { src: "/assets/gallery/event-44.jpg", category: "Corporate", alt: "Elegant venue setup" },
  { src: "/assets/gallery/event-45.jpg", category: "Celebrations", alt: "Birthday event backdrop" },
  { src: "/assets/gallery/event-46.jpg", category: "Corporate", alt: "Event table styling" },
  { src: "/assets/gallery/event-47.jpg", category: "Celebrations", alt: "Celebration decor detail" },
  { src: "/assets/gallery/event-48.jpg", category: "Corporate", alt: "Premium table arrangement" },
  { src: "/assets/gallery/event-49.jpg", category: "Activations", alt: "Festival photo moment" },
  { src: "/assets/gallery/event-50.jpg", category: "Activations", alt: "Festival activation moment" },
  { src: "/assets/gallery/event-51.jpg", category: "Celebrations", alt: "Party decor styling" },
  { src: "/assets/gallery/event-52.jpg", category: "Corporate", alt: "Dining event detail" },
  { src: "/assets/gallery/event-53.jpg", category: "Celebrations", alt: "Birthday styling detail" },
  { src: "/assets/gallery/event-54.jpg", category: "Corporate", alt: "Event table presentation" },
  { src: "/assets/gallery/event-55.jpg", category: "Celebrations", alt: "Party balloon styling" },
  { src: "/assets/gallery/event-56.jpg", category: "Corporate", alt: "Event decor highlight" },
  { src: "/assets/gallery/event-57.jpg", category: "Activations", alt: "Brand activation event" },
  { src: "/assets/gallery/event-58.jpg", category: "Activations", alt: "Event experience setup" },
  { src: "/assets/gallery/event-59.jpg", category: "Corporate", alt: "Formal event arrangement" },
  { src: "/assets/gallery/event-60.jpg", category: "Corporate", alt: "Corporate decor detail" },
  { src: "/assets/gallery/event-61.jpg", category: "Celebrations", alt: "Birthday celebration theme" },
  { src: "/assets/gallery/event-62.jpg", category: "Corporate", alt: "Table setting highlight" },
  { src: "/assets/gallery/event-63.jpg", category: "Celebrations", alt: "Event celebration decor" },
  { src: "/assets/gallery/event-64.jpg", category: "Activations", alt: "Activation branding detail" },
  { src: "/assets/gallery/event-65.jpg", category: "Corporate", alt: "Event venue detail" },
  { src: "/assets/gallery/event-66.jpg", category: "Celebrations", alt: "Birthday decor theme" },
  { src: "/assets/gallery/event-67.jpg", category: "Corporate", alt: "Dinner event styling" },
  { src: "/assets/gallery/event-68.jpg", category: "Celebrations", alt: "Celebration detail shot" },
  { src: "/assets/gallery/event-69.jpg", category: "Corporate", alt: "Premium event arrangement" },
  { src: "/assets/gallery/event-70.jpg", category: "Celebrations", alt: "Party event highlight" },
];

const categories = ["All", "Corporate", "Activations", "Celebrations"];

const aspectRatios = ["aspect-[4/3]", "aspect-[3/4]", "aspect-[4/3]", "aspect-square", "aspect-[3/4]", "aspect-[4/3]"];

const ITEMS_PER_PAGE = 12;

export default function GalleryClient() {
  const [active, setActive] = useState("All");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  const filtered = active === "All" ? images : images.filter((img) => img.category === active);
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Count per category
  const counts: Record<string, number> = {
    All: images.length,
    Corporate: images.filter((i) => i.category === "Corporate").length,
    Activations: images.filter((i) => i.category === "Activations").length,
    Celebrations: images.filter((i) => i.category === "Celebrations").length,
  };

  const openLightbox = (index: number) => {
    setDirection(0);
    setSelectedIndex(index);
    setShowSwipeHint(true);
  };
  const closeLightbox = () => setSelectedIndex(null);

  const goNext = useCallback(() => {
    if (selectedIndex === null) return;
    setDirection(1);
    setSelectedIndex((prev) => (prev! + 1) % filtered.length);
  }, [selectedIndex, filtered.length]);

  const goPrev = useCallback(() => {
    if (selectedIndex === null) return;
    setDirection(-1);
    setSelectedIndex((prev) => (prev! - 1 + filtered.length) % filtered.length);
  }, [selectedIndex, filtered.length]);

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
    setSelectedIndex(null);
  }, [active]);

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

  // Auto-hide swipe hint after 2.5s
  useEffect(() => {
    if (selectedIndex === null) return;
    const t = setTimeout(() => setShowSwipeHint(false), 2500);
    return () => clearTimeout(t);
  }, [selectedIndex]);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0, scale: 0.95 }),
  };

  return (
    <>
      <section className="py-24 md:py-32">
        <div className="container">
          <AnimatedSection className="text-center">
            <p className="section-label">Gallery</p>
            <h1 className="section-heading">Event Highlights</h1>
            <p className="section-subtext">
              A glimpse into the impactful events and stunning setups we&apos;ve brought to life.
            </p>
          </AnimatedSection>

          {/* Filter tabs with counts */}
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                  active === cat
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat} <span className="ml-1 text-xs opacity-60">({counts[cat]})</span>
              </button>
            ))}
          </div>

          {/* Masonry grid — 2 columns on mobile */}
          <div className="mt-12 columns-2 gap-2 sm:gap-3 lg:columns-3 xl:columns-4">
            <AnimatePresence mode="popLayout">
              {visible.map((img, i) => (
                <motion.div
                  key={img.src}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: i * 0.02, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-2 sm:mb-3 break-inside-avoid"
                >
                  <div
                    className="group cursor-pointer overflow-hidden rounded-lg sm:rounded-xl"
                    onClick={() => openLightbox(i)}
                  >
                    <div className={`relative ${aspectRatios[i % aspectRatios.length]}`}>
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-primary/0 transition-all duration-500 group-hover:bg-primary/20 flex items-end p-3 sm:p-4 opacity-0 group-hover:opacity-100">
                        <span className="rounded-full bg-background/90 px-2.5 py-1 text-[10px] sm:text-xs font-medium text-foreground">
                          {img.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Load More Button */}
          {hasMore && (
            <AnimatedSection className="mt-10 text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                className="font-sans px-10 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
              >
                View More ({filtered.length - visibleCount} remaining)
              </Button>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/90 backdrop-blur-md"
            onClick={closeLightbox}
          >
            {/* Close button — safe area aware */}
            <button
              onClick={closeLightbox}
              className="absolute right-4 top-12 sm:top-4 z-10 rounded-full bg-primary-foreground/10 p-3 text-primary-foreground/80 transition-colors hover:bg-primary-foreground/20 hover:text-primary-foreground"
              aria-label="Close lightbox"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Counter — safe area aware */}
            <div className="absolute left-1/2 top-12 sm:top-5 -translate-x-1/2 font-sans text-sm font-medium text-primary-foreground/60">
              {selectedIndex + 1} / {filtered.length}
            </div>

            {/* Nav arrows — hidden on mobile, visible on md+ */}
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-primary-foreground/10 p-2.5 text-primary-foreground/70 transition-colors hover:bg-primary-foreground/20 hover:text-primary-foreground hidden md:flex md:left-6"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-primary-foreground/10 p-2.5 text-primary-foreground/70 transition-colors hover:bg-primary-foreground/20 hover:text-primary-foreground hidden md:flex md:right-6"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={filtered[selectedIndex].src}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 80) goPrev();
                  else if (info.offset.x < -80) goNext();
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative max-h-[80vh] max-w-[90vw] md:max-w-[85vw] touch-none"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={filtered[selectedIndex].src}
                  alt={filtered[selectedIndex].alt}
                  width={1200}
                  height={900}
                  className="max-h-[80vh] max-w-[90vw] md:max-w-[85vw] rounded-xl object-contain pointer-events-none"
                  quality={90}
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Mobile swipe hint */}
            <AnimatePresence>
              {showSwipeHint && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-20 left-1/2 -translate-x-1/2 font-sans text-xs font-medium text-primary-foreground/40 md:hidden"
                >
                  ← Swipe to navigate →
                </motion.p>
              )}
            </AnimatePresence>

            {/* Caption */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 font-sans text-sm font-medium text-primary-foreground/60"
            >
              {filtered[selectedIndex].alt}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
