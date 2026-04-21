import type { Metadata } from "next";
import PageTransition from "@/components/PageTransition";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse Miss Wanjey's portfolio of corporate events, brand activations, and celebrations in Kenya. See what we've brought to life.",
  openGraph: {
    title: "Gallery — Miss Wanjey Events & Marketing",
    description: "Corporate events, brand activations, and celebrations portfolio.",
    url: "https://misswanjey.co.ke/gallery",
  },
};

export default function GalleryPage() {
  return (
    <PageTransition>
      <GalleryClient />
    </PageTransition>
  );
}
