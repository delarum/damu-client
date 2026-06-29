import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import heroImg from "../assets/hero.png";
import "./VideoIntro.css";

const INTRO_DURATION = 4000;

export default function VideoIntro({ onComplete }) {
  const [startPeel, setStartPeel] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartPeel(true);
    }, INTRO_DURATION);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!startPeel) return;

    const timer = setTimeout(() => {
      setFinished(true);
      onComplete?.();
    }, 1800);

    return () => clearTimeout(timer);
  }, [startPeel, onComplete]);

  function skipIntro() {
    setStartPeel(true);
  }

  return (
    <AnimatePresence>
      {!finished && (
        <div className="intro-container">

          {/* Landing page already exists underneath */}

          {/* Ruby layer */}

          <motion.div
            className="ruby-layer"
            initial={{ opacity: 1 }}
            animate={{
              opacity: startPeel ? 0 : 1,
            }}
            transition={{
              delay: 1,
              duration: 0.8,
              ease: "easeInOut",
            }}
          />

          {/* Paper */}

          <motion.div
            className="paper-page"
            initial={false}
            animate={
              startPeel
                ? {
                    rotateY: -115,
                    rotateX: 8,
                    x: "45%",
                    y: "-6%",
                    scale: 0.98,
                  }
                : {}
            }
            transition={{
              duration: 1.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="paper-shadow" />

            <img
              src={heroImg}
              className="hero-image"
              alt="DamuLink Intro"
            />

            <button
              className="skip-btn"
              onClick={skipIntro}
            >
              Enter →
            </button>

          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}