import type { Metadata } from "next";
import PageTransition from "@/components/PageTransition";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Miss Wanjey Events & Marketing. Book a consultation for your corporate event, brand activation, or digital marketing needs in Nairobi, Kenya.",
  openGraph: {
    title: "Contact Miss Wanjey Events & Marketing",
    description: "Book a consultation for corporate events and marketing in Kenya.",
    url: "https://misswanjey.co.ke/contact",
  },
};

export default function ContactPage() {
  return (
    <PageTransition>
      <ContactClient />
    </PageTransition>
  );
}
