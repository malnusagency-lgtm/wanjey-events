import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import PageTransition from "@/components/PageTransition";
import { Check, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Packages",
  description:
    "Choose an event and marketing package from Miss Wanjey — Essential, Professional, Premium Corporate, or a fully custom solution for your brand.",
  openGraph: {
    title: "Packages — Miss Wanjey Events & Marketing",
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
      <section className="py-24 md:py-32">
        <div className="container">
          <AnimatedSection className="text-center">
            <p className="section-label">Packages</p>
            <h1 className="section-heading">Our Event &amp; Marketing Packages</h1>
            <p className="section-subtext">
              Choose a package that fits your needs, or let us create something custom.
            </p>
          </AnimatedSection>

          <div className="mt-16 grid gap-4 md:grid-cols-2 xl:grid-cols-4 xl:gap-5">
            {packages.map((pkg, i) => (
              <AnimatedSection key={pkg.name} delay={i * 0.08}>
                <div className={`relative flex h-full flex-col rounded-2xl border p-8 transition-all duration-500 ${
                  pkg.featured
                    ? "border-accent/30 bg-accent/[0.03]"
                    : "border-border/80 bg-card hover:border-accent/20"
                }`}>
                  {pkg.featured && (
                    <span className="absolute -top-3 left-8 inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1 text-xs font-medium text-accent-foreground">
                      <Star className="h-3 w-3" />
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-serif text-2xl font-bold">{pkg.name}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{pkg.tagline}</p>
                  <div className="gradient-separator my-6" />
                  <ul className="flex-1 space-y-3">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact" className="mt-8">
                    <Button className={`w-full font-sans transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] ${
                      pkg.featured
                        ? "bg-accent text-accent-foreground hover:bg-accent/90"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
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
