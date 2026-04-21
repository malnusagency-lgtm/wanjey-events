import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import PageTransition from "@/components/PageTransition";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "This page could not be found.",
};

export default function NotFound() {
  return (
    <PageTransition>
      <section className="flex min-h-[70vh] items-center py-24">
        <div className="container text-center">
          <AnimatedSection>
            <p className="section-label">404</p>
            <h1 className="section-heading">Page Not Found</h1>
            <p className="section-subtext">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Link href="/" className="mt-10 inline-block">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-sans px-8">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </PageTransition>
  );
}
