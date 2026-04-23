'use client';
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Calendar, Megaphone, BarChart3, Zap } from "lucide-react";

const services = [
  { icon: Calendar, title: "Corporate Events", desc: "Product launches, conferences, corporate dinners, and networking events executed with precision." },
  { icon: Megaphone, title: "Brand Activations", desc: "Experiential marketing, in-store activations, and promotional campaigns that captivate audiences." },
  { icon: BarChart3, title: "Digital Marketing", desc: "Social media strategy, content production, campaign management, and influencer collaborations." },
  { icon: Zap, title: "Event Amplification", desc: "Live social coverage, influencer integration, and post-event marketing for maximum reach." },
];

export default function ServicesMarquee() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Calculate the horizontal move based on the number of items
  // We want to move from 0% to -75% (since there are 4 items and we see one at a time roughly, or we just want to reach the end)
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-65%"]);

  return (
    <section ref={targetRef} className="relative h-[250vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-8 px-6 md:px-20">
          {services.map((s, i) => (
            <div key={i} className="min-w-[320px] md:min-w-[450px]">
              <div className="glass-card group bg-accent/5 backdrop-blur-md border border-accent/10 hover:bg-accent/10 hover:border-accent/20 transition-all duration-500 rounded-[2.5rem] relative overflow-hidden flex flex-col h-full p-10 md:p-14 whitespace-normal shadow-2xl">
                <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent text-accent-foreground border border-accent/20 transition-transform duration-500 group-hover:scale-110 shadow-[0_20px_50px_-10px_rgba(202,163,101,0.6)]">
                  <s.icon className="h-10 w-10" />
                </div>
                <h3 className="relative z-10 mt-10 font-serif text-3xl font-black tracking-tight text-foreground transition-colors duration-300">{s.title}</h3>
                <p className="relative z-10 mt-6 text-[16px] md:text-[18px] leading-[1.8] text-muted-foreground font-medium opacity-90">{s.desc}</p>
                
                {/* Visual accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl -mr-16 -mt-16 group-hover:bg-accent/10 transition-colors duration-500" />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
