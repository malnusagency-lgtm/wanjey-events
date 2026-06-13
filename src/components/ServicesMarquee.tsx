'use client';
import { Calendar, Megaphone, BarChart3, Zap } from "lucide-react";

const services = [
  { icon: Calendar, title: "Corporate Events", desc: "Product launches, conferences, corporate dinners, and networking events executed with precision." },
  { icon: Megaphone, title: "Brand Activations", desc: "Experiential marketing, in-store activations, and promotional campaigns that captivate audiences." },
  { icon: BarChart3, title: "Digital Marketing", desc: "Social media strategy, content production, campaign management, and influencer collaborations." },
  { icon: Zap, title: "Event Amplification", desc: "Live social coverage, influencer integration, and post-event marketing for maximum reach." },
];

export default function ServicesMarquee() {
  return (
    <div className="relative flex overflow-hidden py-12 border-y border-[#CAA365]/30 bg-[#2D1A10] shadow-sm my-6 rounded-2xl">
      <div className="flex animate-marquee whitespace-nowrap gap-6 px-6">
        {/* Double items for seamless loop */}
        {[...services, ...services].map((s, i) => (
          <div key={i} className="min-w-[300px] md:min-w-[350px]">
            <div className="glass-card group bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 rounded-2xl relative overflow-hidden flex flex-col h-full p-8 whitespace-normal">
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 transition-transform duration-500 group-hover:scale-110">
                <s.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="relative z-10 mt-6 font-serif text-xl font-bold tracking-wide text-[#FFE5B4] group-hover:text-white transition-colors duration-300">{s.title}</h3>
              <p className="relative z-10 mt-3 text-[14px] leading-[1.7] text-white/70 font-medium">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
