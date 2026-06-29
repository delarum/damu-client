import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import heroImg from "../assets/hero.png";
import "./VideoIntro.css";

const WAIT_TIME = 800;
const PEEL_TIME = 4000;

export default function VideoIntro({ onComplete }) {
  const [startPeel, setStartPeel] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {

    const timer = setTimeout(() => {

        setStartPeel(true);

    }, WAIT_TIME);

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

            rotateY:-118,

            rotateX:12,

            rotateZ:-3,

            x:"52%",

            y:"-10%",

            scale:.96

        }
        : {}
}
            transition={{
              duration: PEEL_TIME / 1000,
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