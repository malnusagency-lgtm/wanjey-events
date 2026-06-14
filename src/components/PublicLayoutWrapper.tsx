'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import ChatbotWidget from "@/components/ChatbotWidget";
import SmoothScroll from "@/components/SmoothScroll";
import FilmGrain from "@/components/FilmGrain";
import PremiumCursor from "@/components/PremiumCursor";

export default function PublicLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminOrLogin = pathname?.startsWith('/admin') || pathname?.startsWith('/login');

  if (isAdminOrLogin) {
    return (
      <div className="min-h-screen text-[#2D1A10]">
        <FilmGrain />
        <PremiumCursor />
        {children}
      </div>
    );
  }

  return (
    <>
      <FilmGrain />
      <PremiumCursor />
      <SmoothScroll />
      <ScrollProgress />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppWidget />
      <ChatbotWidget />
      <BackToTop />
    </>
  );
}
