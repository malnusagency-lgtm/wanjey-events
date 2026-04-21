'use client';
import { MessageCircle } from "lucide-react";

const WhatsAppWidget = () => (
  <a
    href="https://wa.me/254790381039?text=Hi%20Miss%20Wanjey%2C%20I'd%20like%20to%20inquire%20about%20your%20event%20services."
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat on WhatsApp"
    className="fixed bottom-20 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-[#25D366]/30 md:bottom-24 md:right-8"
  >
    <MessageCircle className="h-6 w-6" />
  </a>
);

export default WhatsAppWidget;
