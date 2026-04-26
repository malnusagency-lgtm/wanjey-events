import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import SmoothScroll from "@/components/SmoothScroll";
import FilmGrain from "@/components/FilmGrain";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://misswanjey.co.ke"),
  title: {
    default: "Wanjey Events & Marketing — Nairobi, Kenya",
    template: "%s | Wanjey Events & Marketing",
  },
  description:
    "Premium corporate events management and brand marketing agency based in Nairobi, Kenya. We plan, execute, and amplify impactful events that drive visibility and growth.",
  keywords: ["events management Kenya", "corporate events Nairobi", "brand activations", "digital marketing Kenya", "Wanjey Events"],
  openGraph: {
    type: "website",
    siteName: "Wanjey Events & Marketing",
    locale: "en_KE",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body>
        <FilmGrain />
        <SmoothScroll />
        <ScrollProgress />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <WhatsAppWidget />
        <BackToTop />
        <Toaster />
        <Sonner />
      </body>
    </html>
  );
}
