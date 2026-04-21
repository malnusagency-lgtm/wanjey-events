import type { Metadata } from "next";
import Link from "next/link";
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
    items: ["Product launches", "Conferences", "Corporate dinners", "Networking events", "Seminars"],
  },
  {
    icon: Megaphone,
    title: "Brand Activations",
    items: ["Experiential marketing", "In-store activations", "Roadshows", "Promotional campaigns"],
  },
  {
    icon: BarChart3,
    title: "Digital Marketing",
    items: ["Social media strategy", "Content production", "Campaign management", "Influencer collaborations"],
  },
  {
    icon: Zap,
    title: "Event Amplification",
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
            <p className="section-label">Our Services</p>
            <h1 className="section-heading">What We Offer</h1>
            <p className="section-subtext">
              End-to-end event management and marketing solutions tailored for corporate excellence.
            </p>
          </AnimatedSection>

          <div className="mt-16 grid gap-4 md:grid-cols-2">
            {sections.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 0.08}>
                <div className="premium-card group p-8">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/8 transition-colors duration-500 group-hover:bg-accent/12">
                      <s.icon className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold">{s.title}</h3>
                  </div>
                  <ul className="mt-6 space-y-2.5">
                    {s.items.map((item) => (
                      <li key={item} className="flex items-center gap-3 text-[15px] text-muted-foreground">
                        <span className="h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="mt-16 text-center">
            <Link href="/contact">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-sans px-8 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
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
