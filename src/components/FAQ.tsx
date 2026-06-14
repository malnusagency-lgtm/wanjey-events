'use client';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const faqs = [
  {
    question: "How far in advance should we book Wanjey Events?",
    answer: "For large corporate events and product launches, we recommend booking at least 4-8 weeks in advance. For brand activations and lifestyle events, 2-4 weeks is often sufficient, though earlier booking ensures better vendor availability."
  },
  {
    question: "Do you handle events outside of Nairobi?",
    answer: "Yes, we execute events across Kenya and are fully equipped to handle destination activations and corporate retreats in coastal regions, the rift valley, and beyond."
  },
  {
    question: "How do you handle vendor selection and management?",
    answer: "We have a vetted database of reliable partners for catering, sound, lighting, and décor. We handle all negotiations and coordination to ensure quality and consistency without you having to manage multiple contacts."
  },
  {
    question: "What is 'Digital Amplification' in your services?",
    answer: "It goes beyond just social media posts. We integrate live coverage, influencer collaborations, and strategic post-event content production to ensure your event reaches a massive audience online, generating ROI long after the event ends."
  },
  {
    question: "Can we request a fully custom package?",
    answer: "Absolutely. While we offer structured packages (Essential, Professional, Premium), most of our corporate clients prefer a bespoke solution tailored specifically to their brand objectives and budget."
  }
];

const FAQItem = ({ faq, index }: { faq: typeof faqs[0], index: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AnimatedSection delay={index * 0.05}>
      <div className={`glass-card mb-4 overflow-hidden transition-all duration-300 ${isOpen ? 'border-[#8C1B11]/60 bg-accent/10' : ''}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between p-6 text-left"
        >
          <span className="font-serif text-lg font-bold tracking-tight text-foreground">{faq.question}</span>
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${isOpen ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground'}`}>
            {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </div>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="px-6 pb-6 pt-0 text-[15px] leading-[1.7] text-muted-foreground font-medium max-w-2xl">
                {faq.answer}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedSection>
  );
};

export default function FAQ() {
  return (
    <section className="py-16 md:py-24 bg-accent/5 relative overflow-hidden">
      <div className="container relative z-10">
        <div className="grid gap-16 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <AnimatedSection>
              <p className="section-label">Common Questions</p>
              <h2 className="section-heading text-left">Frequently Asked Questions</h2>
              <p className="mt-6 text-muted-foreground leading-[1.8] font-medium">
                Find answers to common inquiries about our event management and marketing processes. 
              </p>
              <div className="mt-10 h-1 w-20 bg-accent" />
            </AnimatedSection>
          </div>
          <div className="lg:col-span-2">
            {faqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
