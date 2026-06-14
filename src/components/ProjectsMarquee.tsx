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
    const textStr = items.map(item => item.toUpperCase()).join("   ✦   ") + "   ✦   ";
    
    return (
      <div className="relative flex w-full overflow-hidden border-y border-[#CAA365]/30 bg-transparent py-5 md:py-6 shadow-sm my-1 z-10">
        <motion.div
          className="flex whitespace-nowrap font-serif text-lg font-black tracking-widest text-[#CAA365] sm:text-2xl md:text-4xl will-change-transform transform-gpu"
          initial={{ x: direction === "left" ? "0%" : "-50%" }}
          animate={{ x: direction === "left" ? "-50%" : "0%" }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 35,
          }}
        >
          <div className="flex shrink-0">
            <span className="mx-6 md:mx-12">{textStr}</span>
            <span className="mx-6 md:mx-12">{textStr}</span>
          </div>
          <div className="flex shrink-0">
            <span className="mx-6 md:mx-12">{textStr}</span>
            <span className="mx-6 md:mx-12">{textStr}</span>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="w-full py-4 overflow-hidden flex flex-col gap-3">
      {renderRow(row1, "left")}
      {renderRow(row2, "right")}
    </div>
  );
}

