'use client';
import { motion } from "framer-motion";

interface Props {
  text: string;
}

const InfiniteMarquee = ({ text }: Props) => {
  return (
    <div className="relative flex w-full overflow-hidden border-y border-border/40 bg-accent/5 py-4 md:py-6">
      <motion.div
        className="flex whitespace-nowrap font-serif text-xl font-bold tracking-widest text-accent/80 opacity-60 mix-blend-multiply sm:text-3xl md:text-5xl"
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
