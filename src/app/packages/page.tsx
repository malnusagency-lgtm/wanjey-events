import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import PageTransition from "@/components/PageTransition";
import { Check, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Packages",
  description:
    "Choose an event and marketing package from Wanjey Events — Essential, Professional, Premium Corporate, or a fully custom solution for your brand.",
  openGraph: {
    title: "Packages — Wanjey Events & Marketing",
    description: "Event and marketing packages for every scale — from SME launches to large corporate events.",
    url: "https://misswanjey.co.ke/packages",
  },
};

const packages = [
  {
    name: "Essential",
    tagline: "Ideal for small corporate events or SME launches",
    features: ["Basic event planning", "Vendor coordination", "On-site event management", "Basic social media coverage"],
  },
  {
    name: "Professional",
    tagline: "Ideal for mid-sized corporate events",
    featured: true,
    features: ["Full event planning & execution", "Vendor sourcing & negotiation", "Event branding & styling", "Live social media coverage", "Post-event recap content"],
  },
  {
    name: "Premium Corporate",
    tagline: "For large-scale or high-profile events",
    features: ["End-to-end strategy & execution", "Full event branding", "Guest management coordination", "Influencer amplification", "Digital marketing integration", "Post-event performance report"],
  },
  {
    name: "Custom",
    tagline: "Tailored entirely to your unique needs",
    features: ["Bespoke event concept", "Dedicated account manager", "Any scale, any format", "Custom marketing integration", "Full post-event debrief", "Ongoing brand partnership available"],
  },
];

export default function PackagesPage() {
  return (
    <PageTransition>
      <section className="py-12 md:py-16">
        <div className="container">
          <AnimatedSection className="text-center max-w-4xl mx-auto mb-16">
            <div className="glass-card p-10 md:p-12">
              <p className="section-label">Packages</p>
              <h1 className="section-heading">Our Event &amp; Marketing Packages</h1>
              <p className="section-subtext">
                Choose a package that fits your needs, or let us create something custom.
              </p>
            </div>
          </AnimatedSection>

          <div className="mt-16 grid gap-4 md:grid-cols-2 xl:grid-cols-4 xl:gap-5">
            {packages.map((pkg, i) => (
              <AnimatedSection key={pkg.name} delay={i * 0.08}>
                <div className={`glass-card relative flex h-full flex-col p-8 transition-all duration-500 ${
                  pkg.featured ? "border-accent/40 bg-accent/10 scale-105 shadow-accent/20 z-10" : ""
                }`}>
                  {pkg.featured && (
                    <span className="absolute -top-3 left-8 inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-accent-foreground shadow-lg">
                      <Star className="h-3 w-3 fill-current" />
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-serif text-2xl font-bold">{pkg.name}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{pkg.tagline}</p>
                  <div className="gradient-separator my-6 opacity-40" />
                  <ul className="flex-1 space-y-4">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-[13px] font-medium leading-relaxed">
                        <div className="mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent/10">
                          <Check className="h-3 w-3 text-accent stroke-[3]" />
                        </div>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact" className="mt-8">
                    <Button className={`w-full font-sans font-bold uppercase tracking-widest text-xs h-12 transition-all duration-300 hover:scale-[1.05] active:scale-[0.95] ${
                      pkg.featured
                        ? "bg-accent text-accent-foreground hover:bg-accent/90 shadow-xl shadow-accent/20"
                        : "bg-white/10 text-foreground hover:bg-white/20 border border-white/10"
                    }`}>
                      Request Pricing
                    </Button>
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <p className="mt-12 text-center text-sm text-muted-foreground">
            All packages can be customised based on client needs.
          </p>
        </div>
      </section>
    </PageTransition>
  );
}
