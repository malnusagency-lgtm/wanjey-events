import type { Metadata } from "next";
import { Outfit, Fraunces } from "next/font/google";
import "./globals.css";
import PublicLayoutWrapper from "@/components/PublicLayoutWrapper";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wanjeyevents.com"),
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
    <html lang="en" className={`${outfit.variable} ${fraunces.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Wanjey Events & Marketing",
              "image": "https://wanjeyevents.com/assets/logo.jpeg",
              "@id": "https://wanjeyevents.com/#localbusiness",
              "url": "https://wanjeyevents.com",
              "telephone": "+254790381039",
              "email": "theweventsmarketing@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Nairobi",
                "addressLocality": "Nairobi",
                "addressRegion": "Nairobi County",
                "postalCode": "00100",
                "addressCountry": "KE"
              },
              "sameAs": [
                "https://www.instagram.com/wanjey_events.marketing?igsh=MTNjZGN2MTc1ZjVuOQ==",
                "https://www.tiktok.com/@wanjey_events?_r=1&_t=ZS-94O6gd06jWn"
              ]
            })
          }}
        />
      </head>
      <body>
        <PublicLayoutWrapper>{children}</PublicLayoutWrapper>
        <Toaster />
        <Sonner />
      </body>
    </html>
  );
}
