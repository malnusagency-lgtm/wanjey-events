'use client';
import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WhatsAppWidget = () => {
  const pathname = usePathname();
  const [ctaText, setCtaText] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [triggerKey, setTriggerKey] = useState(0);
  const fullCta = "Chat on WhatsApp! ✦";

  useEffect(() => {
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) {
      return;
    }
    // Stagger delay only on first run (triggerKey === 0) to separate from Chatbot
    const initialDelay = triggerKey === 0 ? 5500 : 0;
    
    const timer = setTimeout(() => {
      setShowTooltip(true);
      let index = 0;
      const interval = setInterval(() => {
        if (index <= fullCta.length) {
          setCtaText(fullCta.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
          // Show full text for 5 seconds, then hide and trigger next loop after 3 seconds
          setTimeout(() => {
            setShowTooltip(false);
            setTimeout(() => {
              setTriggerKey(prev => prev + 1);
            }, 3000);
          }, 5000);
        }
      }, 60);
      return () => clearInterval(interval);
    }, initialDelay);

    return () => clearTimeout(timer);
  }, [pathname, triggerKey]);

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
            className="mr-2 sm:mr-3 flex items-center rounded-xl bg-black/90 border border-[#25D366]/40 text-[#25D366] px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-[10px] sm:text-xs font-bold shadow-lg whitespace-nowrap backdrop-blur-md relative"
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
