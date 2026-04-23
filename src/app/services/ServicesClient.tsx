'use client';
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import PageTransition from "@/components/PageTransition";
import AmbientGlow from "@/components/AmbientGlow";
import InfiniteMarquee from "@/components/InfiniteMarquee";
import { Calendar, Megaphone, BarChart3, Zap, ArrowRight, Star } from "lucide-react";

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

const testimonials = [
  { name: "Sarah Kimani", company: "TechVentures Kenya", quote: "Their attention to detail and creative vision exceeded every expectation we had." },
  { name: "James Odhiambo", company: "Capital Finance Group", quote: "Professional, strategic, and incredibly organized. Highly recommended." },
  { name: "Amina Hassan", company: "Bloom Lifestyle Brand", quote: "The brand activation campaign generated incredible engagement." },
  { name: "David Mwangi", company: "Savannah Holdings", quote: "Wanjey Events stands out for their strategic approach and reliable execution." },
];

export default function ServicesClient() {
  return (
    <PageTransition>
      <section className="relative py-12 md:py-16 overflow-hidden">
        <AmbientGlow />
        <div className="container relative z-10">
          <AnimatedSection className="text-center">
            <p className="section-label font-bold">Our Services</p>
            <h1 className="section-heading font-bold">What We Offer</h1>
            <p className="section-subtext font-medium">
              End-to-end event management and marketing solutions tailored for corporate excellence.
            </p>
          </AnimatedSection>

          <div className="mt-8 md:mt-16 grid gap-6 md:grid-cols-2">
            {sections.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 0.08}>
                <div className="glass-card group overflow-hidden flex flex-col md:flex-row bg-accent/5 backdrop-blur-md border border-accent/10 hover:border-accent/30 transition-all duration-500 rounded-2xl h-full">
                  <div className="relative h-48 w-full md:h-auto md:w-2/5 overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed w-full h-full"
                      style={{ 
                        backgroundImage: `url("${s.image}")`,
                        transform: 'translateZ(0)',
                        willChange: 'transform'
                      }}
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

          <AnimatedSection className="mt-12 text-center">
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

      {/* Testimonials — Auto-scrolling Marquee */}
      <section className="py-8 md:py-16 overflow-hidden">
        <div className="container">
          <AnimatedSection className="text-center mb-8 md:mb-16">
            <p className="section-label">Testimonials</p>
            <h2 className="section-heading">Trusted by Leading Brands</h2>
          </AnimatedSection>
        </div>

        <div className="relative flex overflow-hidden py-6">
          <div className="flex animate-marquee whitespace-nowrap gap-6 px-6">
            {/* Double the items for seamless loop */}
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="min-w-[320px] md:min-w-[400px]">
                <div className="glass-card flex flex-col p-8 h-full bg-accent/5 backdrop-blur-sm border-accent/10">
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-accent text-accent animate-rotate-slow" />
                    ))}
                  </div>
                  <p className="flex-1 text-[15px] leading-[1.8] text-muted-foreground italic whitespace-normal">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-6 flex items-center gap-4 pt-5 border-t border-accent/10">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground font-serif text-sm font-bold shadow-lg shadow-accent/20">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{t.name}</p>
                      <p className="text-[12px] font-medium text-accent uppercase tracking-wider">{t.company}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CSS for custom marquee animation */}
        <style jsx>{`
          .animate-marquee {
            display: flex;
            width: max-content;
            animation: marquee 40s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>
    </PageTransition>
  );
}
