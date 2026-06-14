'use client';
import { motion } from "framer-motion";

const items = [
  "Big Voices Festival",
  "The Don Effect",
  "Sunday Hangout",
  "Desagu Goat Eating",
  "Corporate & Hospitality Campaigns",
  "Influencer & Brand Ambassador Programs",
  "Talent Management & Partnerships",
];

export default function BrandsMarquee() {
  const text = items.map(b => b.toUpperCase()).join(" ✦ ") + " ✦ ";
  
  return (
    <div className="relative flex w-full overflow-hidden border-y border-[#CAA365]/30 bg-transparent py-5 md:py-6 z-10 shadow-sm">
      <motion.div
        className="flex whitespace-nowrap font-serif text-lg font-black tracking-widest text-[#CAA365] sm:text-2xl md:text-4xl will-change-transform transform-gpu"
        initial={{ x: "0%" }}
        animate={{ x: "-50%" }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 35, // Smooth scrolling speed
        }}
      >
        <div className="flex shrink-0">
          <span className="mx-6 md:mx-12">{text}</span>
          <span className="mx-6 md:mx-12">{text}</span>
        </div>
        <div className="flex shrink-0">
          <span className="mx-6 md:mx-12">{text}</span>
          <span className="mx-6 md:mx-12">{text}</span>
        </div>
      </motion.div>
    </div>
  );
}

