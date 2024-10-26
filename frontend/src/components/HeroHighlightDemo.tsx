"use client";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { FlipWords } from "@/components/ui/flip-words";

const words = ["Fun!", "Sad :(", "Indifferent...", "Excited!", "Busy :/"];

export function HeroHighlightDemo() {
  return (
    <HeroHighlight>
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
      >
        How is{" "}
        <Highlight className="text-black dark:text-white">
          Georgia Tech
        </Highlight>
        {" "}life?
        <FlipWords words={words} /> <br />
      </motion.h1>
    </HeroHighlight>
  );
}
