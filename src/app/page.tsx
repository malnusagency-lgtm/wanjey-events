import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import PageTransition from "@/components/PageTransition";
import ParallaxImageBreakout from "@/components/ParallaxImageBreakout";
import InfiniteMarquee from "@/components/InfiniteMarquee";
import AmbientGlow from "@/components/AmbientGlow";
import MagneticButton from "@/components/MagneticButton";
import HeroBackground from "@/components/HeroBackground";
import UpcomingEventSection from "@/components/UpcomingEventSection";
import ServicesMarquee from "@/components/ServicesMarquee";
import { Calendar, Megaphone, BarChart3, Zap, CheckCircle2, ArrowRight, Users, Star, Trophy, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Strategic Events & Marketing That Elevate Your Brand",
  description:
    "Wanjey Events & Marketing — corporate events, brand activations, and digital marketing in Nairobi, Kenya. Book a consultation today.",
  openGraph: {
    title: "Wanjey Events & Marketing",
    description: "Premium event management and brand marketing in Kenya.",
    url: "https://misswanjey.co.ke",
  },
};

const services = [
  { icon: Calendar, title: "Corporate Events", desc: "Product launches, conferences, corporate dinners, and networking events executed with precision.", image: "/assets/gallery/event-12.jpg" },
  { icon: Megaphone, title: "Brand Activations", desc: "Experiential marketing, in-store activations, and promotional campaigns that captivate audiences.", image: "/assets/gallery/event-31.jpg" },
  { icon: BarChart3, title: "Digital Marketing", desc: "Social media strategy, content production, campaign management, and influencer collaborations.", image: "/assets/gallery/event-64.jpg" },
  { icon: Zap, title: "Event Amplification", desc: "Live social coverage, influencer integration, and post-event marketing for maximum reach.", image: "/assets/gallery/event-50.jpg" },
];

const differentiators = [
  "Professional corporate execution",
  "End-to-end project management",
  "Integrated digital amplification",
  "Strong brand storytelling",
  "Reliable and detail-oriented team",
];

const stats = [
  { icon: Trophy, value: "50+", label: "Events Delivered" },
  { icon: Users, value: "100+", label: "Happy Clients" },
  { icon: Star, value: "3+", label: "Years of Excellence" },
  { icon: Clock, value: "24/7", label: "Client Support" },
];

export default function HomePage() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative flex min-h-[100vh] items-center overflow-hidden">
        <HeroBackground />
        <div className="container relative z-10 py-24 md:py-32">
          <div className="max-w-2xl">
            <AnimatedSection delay={0.1}>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent">
                Wanjey Events & Marketing
              </p>
            </AnimatedSection>
            
            <AnimatedSection delay={0.25}>
              <h1 className="mt-6 font-serif text-5xl font-bold leading-[1.05] text-primary-foreground md:text-6xl lg:text-[4.5rem] tracking-tight text-balance">
                Strategic Events & Marketing That Elevate Your Brand
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <p className="mt-8 max-w-lg text-[16px] leading-[1.7] text-primary-foreground/80 md:text-lg opacity-90 font-medium">
                We plan, execute, and amplify impactful corporate and lifestyle events that drive visibility, engagement, and measurable growth.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.6}>
              <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                <Link href="/contact">
                  <MagneticButton intensity={30}>
                    <Button size="lg" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 font-bold px-8 h-14 text-[15px] transition-all duration-300">
                      Book a Consultation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </MagneticButton>
                </Link>
                <Link href="/packages">
                  <MagneticButton intensity={20}>
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/70 text-primary-foreground bg-primary-foreground/5 hover:bg-primary-foreground/10 hover:border-primary-foreground font-bold px-8 h-14 text-[15px] transition-all duration-300">
                      View Our Packages
                    </Button>
                  </MagneticButton>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-accent/5 border-y border-accent/10 py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 0.08} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-accent-foreground mb-6 shadow-[0_10px_30px_-10px_rgba(202,163,101,0.6)]">
                  <stat.icon className="h-8 w-8" />
                </div>
                <p className="font-serif text-3xl font-bold text-foreground md:text-4xl">{stat.value}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">{stat.label}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="relative py-16 overflow-hidden md:py-20">
        <AmbientGlow />
        <div className="container relative z-10">
          <AnimatedSection className="text-center max-w-4xl mx-auto mb-8 md:mb-16">
            <div className="glass-card p-6 md:p-16">
              <p className="section-label font-bold">What We Do</p>
              <h2 className="section-heading font-bold">Comprehensive Event & Marketing Solutions</h2>
              <p className="section-subtext font-medium">
                Professional event execution and strategic brand marketing solutions for businesses that want to stand out.
              </p>
            </div>
          </AnimatedSection>

          <ServicesMarquee />
        </div>
      </section>

      <ParallaxImageBreakout src="/assets/gallery/event-30.jpg" alt="Premium Event Setup" />

      <InfiniteMarquee text="PREMIUM EVENTS • STRATEGIC MARKETING • BRAND ACTIVATIONS • " />

      <UpcomingEventSection />

      {/* Why Choose Us */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="glass-card p-6 md:p-10 mb-6 lg:mb-0">
                <AnimatedSection delay={0.1}>
                  <p className="section-label font-bold">Why Choose Us</p>
                </AnimatedSection>
                <AnimatedSection delay={0.2}>
                  <h2 className="section-heading tracking-tight leading-[1.1] font-bold text-foreground">Built on Trust, Driven by Excellence</h2>
                </AnimatedSection>
                <AnimatedSection delay={0.3}>
                  <p className="mt-6 text-muted-foreground leading-[1.8] text-[16px] md:text-lg max-w-lg font-medium">
                    With years of experience delivering premium corporate events across Kenya, we bring strategic thinking, creative execution, and measurable results to every project.
                  </p>
                </AnimatedSection>
              </div>
            <div className="grid gap-3">
              {differentiators.map((d, i) => (
                <AnimatedSection key={d} delay={i * 0.06}>
                  <div className="glass-card flex items-center gap-4 p-5 bg-accent/5">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
                    <span className="text-[15px] font-bold">{d}</span>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 md:py-20 overflow-hidden w-full" style={{ clipPath: 'inset(0)' }}>
        {/* Truly Fixed Background - Position fixed within clipped section */}
        <div 
          className="fixed inset-0 z-[-1] bg-cover bg-no-repeat w-full pointer-events-none"
          style={{ 
            backgroundImage: 'url("/assets/lets-build.jpg")', 
            height: '100vh', 
            width: '100vw',
            backgroundPosition: 'center 0%' 
          }}
        />
        <div className="absolute inset-0 z-[1] bg-white/20" />

        <div className="container relative z-10 text-center">
          <AnimatedSection delay={0.1}>
            <h2 className="font-serif text-4xl font-bold text-foreground md:text-5xl lg:text-[4rem] text-balance tracking-tight leading-[1.1]">
              Let&apos;s Build Something Impactful
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="mx-auto mt-6 max-w-md text-[16px] leading-[1.7] text-foreground/80 font-bold">
              Ready to create events and campaigns that resonate? Let&apos;s start with a conversation.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <Link href="/contact">
              <MagneticButton intensity={25} className="mt-10">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold px-10 h-14 text-[15px] transition-all duration-300">
                  Schedule Your Strategy Call
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </MagneticButton>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </PageTransition>
  );
}
