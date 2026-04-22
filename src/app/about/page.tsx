import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import PageTransition from "@/components/PageTransition";
import { Heart, Shield, Lightbulb, Award, Users, ArrowRight, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Miss Wanjey Digital Consultant and Toto Kingdom — brands under the Miss Wanjey umbrella dedicated to excellence in Kenya.",
  openGraph: {
    title: "About Miss Wanjey Brands",
    description: "Mission, vision, and values behind the Miss Wanjey brand ecosystem.",
    url: "https://misswanjey.co.ke/about",
  },
};

const values = [
  { icon: Shield, label: "Professionalism" },
  { icon: Heart, label: "Integrity" },
  { icon: Lightbulb, label: "Creativity" },
  { icon: Award, label: "Excellence" },
  { icon: Users, label: "Client-Centered" },
];

export default function AboutPage() {
  return (
    <PageTransition>
      {/* Hero About */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
            <AnimatedSection>
              <div className="relative mx-auto max-w-md lg:mx-0">
                <Image
                  src="/assets/hero-bg.jpg"
                  alt="Wanjey Events & Marketing"
                  width={600}
                  height={700}
                  className="relative w-full rounded-2xl object-cover"
                  quality={90}
                />
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <p className="section-label">About Us</p>
              <h1 className="section-heading">About Wanjey Events &amp; Marketing</h1>
              <p className="mt-8 text-[15px] leading-[1.7] text-muted-foreground md:text-base">
                Founded to bridge the gap between exceptional event execution and strategic brand visibility, <strong className="text-foreground">Wanjey Events &amp; Marketing</strong> combines creativity, structure, and marketing expertise to deliver experiences that leave lasting impressions.
              </p>
              <p className="mt-4 text-[15px] leading-[1.7] text-muted-foreground md:text-base">
                We are a proud brand under the <strong className="text-foreground">Miss Wanjey</strong> umbrella — a dynamic personal brand built on passion, excellence, and entrepreneurship. Miss Wanjey is more than a name — it&apos;s a movement that powers multiple ventures dedicated to elevating communities and experiences across Kenya.
              </p>
              <div className="mt-8 space-y-3">
                <div className="premium-card p-6">
                  <h3 className="font-serif text-lg font-semibold">Our Mission</h3>
                  <p className="mt-2 text-sm leading-[1.7] text-muted-foreground">To create impactful events and marketing campaigns that elevate brands and connect audiences.</p>
                </div>
                <div className="premium-card p-6">
                  <h3 className="font-serif text-lg font-semibold">Our Vision</h3>
                  <p className="mt-2 text-sm leading-[1.7] text-muted-foreground">To become a leading corporate events and marketing agency in Kenya and East Africa.</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <div className="gradient-separator" />

      {/* The Miss Wanjey Brand Family */}
      <section className="py-12 md:py-16">
        <div className="container">
          <AnimatedSection className="text-center">
            <p className="section-label">The Brand Family</p>
            <h2 className="section-heading">Miss Wanjey Brand Family</h2>
            <p className="section-subtext">
              Miss Wanjey is a personal brand that champions excellence across multiple ventures. Here&apos;s what we&apos;re building.
            </p>
          </AnimatedSection>

          <div className="mt-10 grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            {/* Wanjey Events Card */}
            <AnimatedSection delay={0.08}>
              <div className="premium-card group p-8 h-full flex flex-col bg-accent/[0.03] border-accent/20">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 mb-5">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-serif text-xl font-bold">Miss Wanjey Digital Consultant</h3>
                <p className="mt-3 flex-1 text-sm leading-[1.7] text-muted-foreground">
                  Premium corporate events management, brand activations, and strategic digital marketing for businesses that want to stand out.
                </p>
                <Link href="/services" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline">
                  Explore Our Services <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </AnimatedSection>

            {/* Toto Kingdom Card */}
            <AnimatedSection delay={0.16}>
              <div className="premium-card group p-8 h-full flex flex-col">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 mb-5">
                  <Heart className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-serif text-xl font-bold">Toto Kingdom</h3>
                <p className="mt-3 flex-1 text-sm leading-[1.7] text-muted-foreground">
                  A vibrant children&apos;s entertainment and events brand creating unforgettable experiences for kids — from themed parties to interactive play events.
                </p>
                <a href="https://totokingdom.co.ke" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline">
                  Visit Toto Kingdom <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <div className="gradient-separator" />

      {/* Our Values */}
      <section className="py-12 md:py-16">
        <div className="container text-center">
          <AnimatedSection>
            <p className="section-label">Our Values</p>
            <h2 className="section-heading">What Guides Us</h2>
          </AnimatedSection>
          <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {values.map((v, i) => (
              <AnimatedSection key={v.label} delay={i * 0.06}>
                <div className="premium-card flex flex-col items-center gap-3 p-6">
                  <v.icon className="h-6 w-6 text-accent" />
                  <span className="text-sm font-medium">{v.label}</span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
