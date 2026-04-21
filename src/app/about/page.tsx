import type { Metadata } from "next";
import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";
import PageTransition from "@/components/PageTransition";
import { Heart, Shield, Lightbulb, Award, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Miss Wanjey Events & Marketing — our mission, vision, and the values that drive our premium corporate event and marketing work in Kenya.",
  openGraph: {
    title: "About Miss Wanjey Events & Marketing",
    description: "Mission, vision, and values behind Kenya's premium events agency.",
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
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
            <AnimatedSection>
              <div className="relative mx-auto max-w-md lg:mx-0">
                <Image
                  src="/assets/hero-bg.jpg"
                  alt="Miss Wanjey"
                  width={600}
                  height={700}
                  className="relative w-full rounded-2xl object-cover"
                  quality={90}
                />
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <p className="section-label">About Us</p>
              <h1 className="section-heading">About Miss Wanjey Events &amp; Marketing</h1>
              <p className="mt-8 text-[15px] leading-[1.7] text-muted-foreground md:text-base">
                Founded to bridge the gap between exceptional event execution and strategic brand visibility, we combine creativity, structure, and marketing expertise to deliver experiences that leave lasting impressions.
              </p>
              <div className="mt-10 space-y-3">
                <div className="premium-card p-6">
                  <h3 className="font-serif text-lg font-semibold">Our Mission</h3>
                  <p className="mt-2 text-sm leading-[1.7] text-muted-foreground">To create impactful events and marketing campaigns that elevate brands and connect audiences.</p>
                </div>
                <div className="premium-card p-6">
                  <h3 className="font-serif text-lg font-semibold">Our Vision</h3>
                  <p className="mt-2 text-sm leading-[1.7] text-muted-foreground">To become a leading corporate events and marketing agency in Kenya.</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <div className="gradient-separator" />

      <section className="py-24 md:py-32">
        <div className="container text-center">
          <AnimatedSection>
            <p className="section-label">Our Values</p>
            <h2 className="section-heading">What Guides Us</h2>
          </AnimatedSection>
          <div className="mx-auto mt-14 grid max-w-3xl gap-3 sm:grid-cols-3 lg:grid-cols-5">
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
