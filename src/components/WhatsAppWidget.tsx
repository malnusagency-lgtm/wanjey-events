'use client';
import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WhatsAppWidget = () => {
  const pathname = usePathname();
  const [ctaText, setCtaText] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const fullCta = "Let's plan your event! ✦";

  useEffect(() => {
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) {
      return;
    }
    // Typewriter effect after 2.5s delay
    const timer = setTimeout(() => {
      setShowTooltip(true);
      let index = 0;
      const interval = setInterval(() => {
        if (index <= fullCta.length) {
          setCtaText(fullCta.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 60);
      return () => clearInterval(interval);
    }, 2500);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-6 z-50 flex items-center md:bottom-24 md:right-8">
      {/* Live Typewriter CTA Speech Bubble */}
      <AnimatePresence>
        {showTooltip && ctaText && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mr-3 hidden sm:flex items-center rounded-xl bg-black/80 border border-[#25D366]/40 text-[#25D366] px-3.5 py-2 text-xs font-bold shadow-lg whitespace-nowrap backdrop-blur-md relative"
          >
            {ctaText}
            <span className="inline-block w-1.5 h-3.5 bg-[#25D366] ml-1.5 animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      <a
        href="https://wa.me/254790381039?text=Hi%20Miss%20Wanjey%2C%20I'd%20like%20to%20inquire%20about%20your%20event%20services."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-[#25D366]/30"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
};

export default WhatsAppWidget;
