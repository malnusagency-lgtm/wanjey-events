'use client';
import { motion } from "framer-motion";

interface Props {
  text: string;
}

const InfiniteMarquee = ({ text }: Props) => {
  return (
    <div className="relative flex w-full overflow-hidden border-y border-[#CAA365]/30 bg-[#FFE5D9] py-5 md:py-6 z-10 shadow-sm">
      <motion.div
        className="flex whitespace-nowrap font-serif text-lg font-black tracking-widest text-[#FFE5B4] sm:text-2xl md:text-4xl"
        style={{
          textShadow: '1px 1px 0px #2D1A10, -1px -1px 0px #2D1A10, 1px -1px 0px #2D1A10, -1px 1px 0px #2D1A10'
        }}
        initial={{ x: "0%" }}
        animate={{ x: "-50%" }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 30, // Adjust this for speed
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
};

export default InfiniteMarquee;
