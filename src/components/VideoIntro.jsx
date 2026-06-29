import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import heroImg from "../assets/hero.png";

const PEEL_DELAY = 3 * 1000; // exactly 3 seconds

export default function VideoIntro({ onComplete }) {
  const [peeled, setPeeled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPeeled(true);
    }, PEEL_DELAY);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (peeled) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [peeled, onComplete]);

  function skip() {
    setPeeled(true);
  }

  return (
    <AnimatePresence>
      {!peeled && (
        <div style={{ perspective: 1200 }}>
          <motion.div
            key="hero-overlay"
            initial={{ rotateY: 0 }}
            exit={{
              rotateY: -90,
            }}
            transition={{
              duration: 1.0,
              ease: [0.76, 0, 0.24, 1],
            }}
            style={{ transformOrigin: "left center" }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          >
            <div className="relative w-full h-screen overflow-hidden bg-black">
              <img
                src={heroImg}
                alt="DamuLink intro"
                className="w-full h-full object-cover"
              />

              {/* Skip / Enter button */}
              <button
                onClick={skip}
                className="absolute bottom-8 right-8 z-20 font-body text-xs font-semibold px-5 py-2.5 rounded-full bg-cream/90 text-ruby-night backdrop-blur hover:bg-cream transition-colors"
              >
                Enter DamuLink →
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
