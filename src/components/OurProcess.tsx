'use client';
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { MessageSquare, Layout, Activity, BarChart2 } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "Consult",
    desc: "We start with a deep dive into your brand objectives, audience, and vision. Strategic alignment is our first priority.",
    color: "bg-blue-500/10 text-blue-500"
  },
  {
    icon: Layout,
    title: "Plan",
    desc: "Every detail—from vendor selection to digital integration—is meticulously mapped out in a comprehensive project blueprint.",
    color: "bg-purple-500/10 text-purple-500"
  },
  {
    icon: Activity,
    title: "Execute",
    desc: "Our on-site team ensures flawless delivery, managing every element in real-time so you can focus on your guests.",
    color: "bg-accent/10 text-accent"
  },
  {
    icon: BarChart2,
    title: "Amplify",
    desc: "Post-event marketing and performance reports ensure your investment continues to deliver value and visibility.",
    color: "bg-green-500/10 text-green-500"
  }
];

export default function OurProcess() {
  return (
    <section className="py-14 md:py-20 relative overflow-hidden">
      <div className="container relative z-10">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <p className="section-label">Strategic Approach</p>
          <h2 className="section-heading">How We Create Impact</h2>
          <p className="section-subtext">
            Our structured process ensures that every event is more than just a gathering—it&apos;s a strategic brand milestone.
          </p>
        </AnimatedSection>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 relative">
          {/* Connecting line for desktop */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 hidden lg:block z-0 opacity-50" />
          
          {stepCard(steps[0], 0)}
          {stepCard(steps[1], 1)}
          {stepCard(steps[2], 2)}
          {stepCard(steps[3], 3)}
        </div>
      </div>
    </section>
  );
}

function stepCard(step: typeof steps[0], index: number) {
  return (
    <AnimatedSection delay={index * 0.1} className="relative z-10 h-full">
      <div className="glass-card group p-8 h-full flex flex-col items-center text-center hover:bg-white/60">
        <div className={`mb-8 flex h-20 w-20 items-center justify-center rounded-2xl ${step.color} border border-current/20 shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
          <step.icon className="h-10 w-10" />
        </div>
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Step 0{index + 1}
        </div>
        <h3 className="font-serif text-2xl font-bold mb-4 tracking-tight">{step.title}</h3>
        <p className="text-[15px] leading-[1.7] text-muted-foreground font-medium">
          {step.desc}
        </p>
      </div>
    </AnimatedSection>
  );
}
