import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import PageTransition from "@/components/PageTransition";
import AmbientGlow from "@/components/AmbientGlow";
import InfiniteMarquee from "@/components/InfiniteMarquee";
import { Calendar, Megaphone, BarChart3, Zap, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Miss Wanjey Events & Marketing offers corporate events, brand activations, digital marketing, and event amplification in Nairobi, Kenya.",
  openGraph: {
    title: "Services — Miss Wanjey Events & Marketing",
    description: "Corporate events, brand activations, digital marketing, and event amplification in Kenya.",
    url: "https://misswanjey.co.ke/services",
  },
};

const sections = [
  {
    icon: Calendar,
    title: "Corporate Events",
    image: "/assets/gallery/event-12.jpg",
    items: ["Product launches", "Conferences", "Corporate dinners", "Networking events", "Seminars"],
  },
  {
    icon: Megaphone,
    title: "Brand Activations",
    image: "/assets/gallery/event-31.jpg",
    items: ["Experiential marketing", "In-store activations", "Roadshows", "Promotional campaigns"],
  },
  {
    icon: BarChart3,
    title: "Digital Marketing",
    image: "/assets/gallery/event-64.jpg",
    items: ["Social media strategy", "Content production", "Campaign management", "Influencer collaborations"],
  },
  {
    icon: Zap,
    title: "Event Amplification",
    image: "/assets/gallery/event-50.jpg",
    items: ["Live social coverage", "Influencer integration", "Post-event marketing", "Digital visibility strategy"],
  },
];

export default function ServicesPage() {
  return (
    <PageTransition>
      <section className="relative py-24 overflow-hidden md:py-32">
        <AmbientGlow />
        <div className="container relative z-10">
          <AnimatedSection className="text-center">
            <p className="section-label font-bold">Our Services</p>
            <h1 className="section-heading font-bold">What We Offer</h1>
            <p className="section-subtext font-medium">
              End-to-end event management and marketing solutions tailored for corporate excellence.
            </p>
          </AnimatedSection>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {sections.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 0.08}>
                <div className="premium-card group overflow-hidden flex flex-col md:flex-row bg-accent/5 backdrop-blur-md border border-accent/10 hover:border-accent/30 transition-all duration-500 rounded-2xl h-full">
                  <div className="relative h-48 w-full md:h-auto md:w-2/5 overflow-hidden">
                    <Image 
                      src={s.image} 
                      alt={s.title} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                  </div>
                  <div className="p-8 md:w-3/5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 border border-accent/20">
                        <s.icon className="h-5 w-5 text-accent" />
                      </div>
                      <h3 className="font-serif text-xl font-bold tracking-wide">{s.title}</h3>
                    </div>
                    <ul className="mt-6 space-y-3">
                      {s.items.map((item) => (
                        <li key={item} className="flex items-center gap-3 text-[15px] text-muted-foreground font-medium">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="mt-20 text-center">
            <Link href="/contact">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold px-10 h-14 text-[15px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-accent/20">
                Request a Custom Proposal
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>
      
      <InfiniteMarquee text="END-TO-END CORPORATE EXCELLENCE • STRATEGIC BRANDING • " />
    </PageTransition>
  );
}

