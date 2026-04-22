import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Wanjey Events & Marketing offers corporate events, brand activations, digital marketing, and event amplification in Nairobi, Kenya.",
  openGraph: {
    title: "Services — Wanjey Events & Marketing",
    description: "Corporate events, brand activations, digital marketing, and event amplification in Kenya.",
    url: "https://misswanjey.co.ke/services",
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
