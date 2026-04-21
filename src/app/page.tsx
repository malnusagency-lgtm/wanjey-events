import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import PageTransition from "@/components/PageTransition";
import ParallaxImageBreakout from "@/components/ParallaxImageBreakout";
import InfiniteMarquee from "@/components/InfiniteMarquee";
import AmbientGlow from "@/components/AmbientGlow";
import { Calendar, Megaphone, BarChart3, Zap, CheckCircle2, ArrowRight, Users, Star, Trophy, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Strategic Events & Marketing That Elevate Your Brand",
  description:
    "Miss Wanjey Events & Marketing — corporate events, brand activations, and digital marketing in Nairobi, Kenya. Book a consultation today.",
  openGraph: {
    title: "Miss Wanjey Events & Marketing",
    description: "Premium event management and brand marketing in Kenya.",
    url: "https://misswanjey.co.ke",
  },
};

const services = [
  { icon: Calendar, title: "Corporate Events", desc: "Product launches, conferences, corporate dinners, and networking events executed with precision." },
  { icon: Megaphone, title: "Brand Activations", desc: "Experiential marketing, in-store activations, and promotional campaigns that captivate audiences." },
  { icon: BarChart3, title: "Digital Marketing", desc: "Social media strategy, content production, campaign management, and influencer collaborations." },
  { icon: Zap, title: "Event Amplification", desc: "Live social coverage, influencer integration, and post-event marketing for maximum reach." },
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
      <section className="relative flex min-h-[90vh] items-center overflow-hidden">
        <Image
          src="/assets/hero-bg.jpg"
          alt="Miss Wanjey Events hero"
          fill
          className="object-cover object-top"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="container relative z-10 py-24 md:py-32">
          <AnimatedSection className="max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-accent">
              Miss Wanjey Events &amp; Marketing
            </p>
            <h1 className="mt-6 font-serif text-4xl font-bold leading-[1.1] text-primary-foreground md:text-5xl lg:text-6xl text-balance">
              Strategic Events &amp; Marketing That Elevate Your Brand
            </h1>
            <p className="mt-8 max-w-lg text-[15px] leading-[1.7] text-primary-foreground/80 md:text-base">
              We plan, execute, and amplify impactful corporate and lifestyle events that drive visibility, engagement, and measurable growth.
            </p>
            <div className="mt-12 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-sans px-8 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                  Book a Consultation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/packages">
                <Button size="lg" variant="outline" className="border-primary-foreground/70 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 hover:border-primary-foreground font-sans px-8 transition-all duration-300">
                  View Our Packages
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-accent/5 border-y border-accent/10 py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 0.08} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 mb-4">
                  <stat.icon className="h-6 w-6 text-accent" />
                </div>
                <p className="font-serif text-3xl font-bold text-foreground md:text-4xl">{stat.value}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">{stat.label}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="relative py-24 overflow-hidden md:py-32">
        <AmbientGlow />
        <div className="container relative z-10">
          <AnimatedSection className="text-center">
            <p className="section-label">What We Do</p>
            <h2 className="section-heading">Comprehensive Event &amp; Marketing Solutions</h2>
            <p className="section-subtext">
              Professional event execution and strategic brand marketing solutions for businesses that want to stand out.
            </p>
          </AnimatedSection>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 0.08}>
                <div className="premium-card group p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/8 transition-colors duration-500 group-hover:bg-accent/12">
                    <s.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="mt-6 font-serif text-lg font-semibold">{s.title}</h3>
                  <p className="mt-3 text-sm leading-[1.7] text-muted-foreground">{s.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <ParallaxImageBreakout src="/assets/gallery/event-11.jpg" alt="Premium Event Setup" />

      <InfiniteMarquee text="PREMIUM EVENTS • STRATEGIC MARKETING • BRAND ACTIVATIONS • " />

      {/* Why Choose Us */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
            <AnimatedSection>
              <p className="section-label">Why Choose Us</p>
              <h2 className="section-heading">Built on Trust, Driven by Excellence</h2>
              <p className="mt-6 text-muted-foreground leading-[1.7] text-[15px] md:text-base">
                With years of experience delivering premium corporate events across Kenya, we bring strategic thinking, creative execution, and measurable results to every project.
              </p>
            </AnimatedSection>
            <div className="grid gap-3">
              {differentiators.map((d, i) => (
                <AnimatedSection key={d} delay={i * 0.06}>
                  <div className="premium-card flex items-center gap-4 p-5">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
                    <span className="text-[15px] font-medium">{d}</span>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-24 md:py-32">
        <div className="container text-center">
          <AnimatedSection>
            <h2 className="font-serif text-3xl font-bold text-primary-foreground md:text-4xl lg:text-[2.75rem] text-balance" style={{ lineHeight: "1.12" }}>
              Let&apos;s Build Something Impactful
            </h2>
            <p className="mx-auto mt-6 max-w-md text-[15px] text-primary-foreground/70">
              Ready to create events and campaigns that resonate? Let&apos;s start with a conversation.
            </p>
            <Link href="/contact">
              <Button size="lg" className="mt-10 bg-accent text-accent-foreground hover:bg-accent/90 font-sans px-10 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                Schedule Your Strategy Call
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </PageTransition>
  );
}
