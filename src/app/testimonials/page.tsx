import type { Metadata } from "next";
import AnimatedSection from "@/components/AnimatedSection";
import PageTransition from "@/components/PageTransition";
import { Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "See what corporate clients say about Miss Wanjey Events & Marketing — trusted by leading companies across Kenya for premium event experiences.",
  openGraph: {
    title: "Testimonials — Miss Wanjey Events & Marketing",
    description: "Client testimonials from Kenya's leading companies.",
    url: "https://misswanjey.co.ke/testimonials",
  },
};

const testimonials = [
  {
    name: "Sarah Kimani",
    company: "TechVentures Kenya",
    rating: 5,
    quote: "Miss Wanjey transformed our product launch into an unforgettable experience. Their attention to detail and creative vision exceeded every expectation we had.",
  },
  {
    name: "James Odhiambo",
    company: "Capital Finance Group",
    rating: 5,
    quote: "Professional, strategic, and incredibly organized. Our annual corporate dinner was flawlessly executed from start to finish. Highly recommended.",
  },
  {
    name: "Amina Hassan",
    company: "Bloom Lifestyle Brand",
    rating: 5,
    quote: "The brand activation campaign they designed for us generated incredible engagement. Their digital marketing integration made all the difference.",
  },
  {
    name: "David Mwangi",
    company: "Savannah Holdings",
    rating: 5,
    quote: "We've worked with several event planners, but Miss Wanjey stands out for their strategic approach and reliable execution. They truly understand corporate events.",
  },
  {
    name: "Grace Wambui",
    company: "Urban Eats Co.",
    rating: 5,
    quote: "From concept to execution, every detail was handled with care. The post-event marketing amplified our reach far beyond what we expected.",
  },
  {
    name: "Peter Njoroge",
    company: "Metro Consulting",
    rating: 5,
    quote: "A truly premium experience. Their team is responsive, creative, and delivers on time. Our conference was a resounding success thanks to them.",
  },
];

export default function TestimonialsPage() {
  return (
    <PageTransition>
      <section className="py-24 md:py-32">
        <div className="container">
          <AnimatedSection className="text-center">
            <p className="section-label">Testimonials</p>
            <h1 className="section-heading">What Our Clients Say</h1>
            <p className="section-subtext">
              Trusted by leading companies across Kenya for premium event experiences.
            </p>
          </AnimatedSection>

          <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 0.06}>
                <div className="premium-card flex h-full flex-col p-7">
                  {/* Star rating */}
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="flex-1 text-[15px] leading-[1.7] text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-6 h-px w-full bg-border" />
                  <div className="flex items-center gap-3 pt-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 font-serif text-sm font-bold text-accent">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.company}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
