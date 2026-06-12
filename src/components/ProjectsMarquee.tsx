'use client';
import { motion } from "framer-motion";

const row1 = [
  "Big Voices Festival",
  "The Don Effect",
  "Sunday Hangout",
  "Desagu Goat Eating",
];

const row2 = [
  "Corporate & Hospitality Campaigns",
  "Influencer & Brand Ambassador Programs",
  "Talent Management & Partnerships",
];

export default function ProjectsMarquee() {
  const renderRow = (items: string[], direction: "left" | "right") => {
    const textStr = items.join("   ✦   ") + "   ✦   ";
    
    return (
      <div className="relative flex w-full overflow-hidden border-y border-[#CAA365]/25 bg-[#FFE5D9] py-5 my-1.5 shadow-sm">
        {/* Left fade gradient */}
        <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#FFE5D9] via-[#FFE5D9]/50 to-transparent z-20 w-16 pointer-events-none" />
        
        <motion.div
          className="flex whitespace-nowrap font-serif text-[14px] md:text-[17px] font-black uppercase tracking-[0.22em] text-[#2D1A10]"
          initial={{ x: direction === "left" ? "0%" : "-50%" }}
          animate={{ x: direction === "left" ? "-50%" : "0%" }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 35,
          }}
        >
          <div className="flex shrink-0">
            <span className="mx-4">{textStr}</span>
            <span className="mx-4">{textStr}</span>
            <span className="mx-4">{textStr}</span>
          </div>
          <div className="flex shrink-0">
            <span className="mx-4">{textStr}</span>
            <span className="mx-4">{textStr}</span>
            <span className="mx-4">{textStr}</span>
          </div>
        </motion.div>
        
        {/* Right fade gradient */}
        <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-[#FFE5D9] via-[#FFE5D9]/50 to-transparent z-20 w-16 pointer-events-none" />
      </div>
    );
  };

  return (
    <div className="w-full py-4 overflow-hidden flex flex-col gap-1">
      {renderRow(row1, "left")}
      {renderRow(row2, "right")}
    </div>
  );
}
