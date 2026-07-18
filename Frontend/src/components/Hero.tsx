import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import controllerImg from "../../public/images/controller.png";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);

  const translateX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), springConfig);
  const translateY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-20, 20]), springConfig);

  const bgTranslateX = useTransform(translateX, (v) => v * 1.4);
  const bgTranslateY = useTransform(translateY, (v) => v * 1.4);

  function handleMouseMove(e: React.MouseEvent) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-neutral-950 via-neutral-900 to-black overflow-hidden">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 items-center gap-10 px-8">
        <div className="z-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-blue-400 text-sm font-medium tracking-widest uppercase mb-4"
          >
            Next-gen precision
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
          >
            Feel every
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              vibration
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-neutral-400 text-base max-w-md mb-8 leading-relaxed"
          >
            Haptic feedback and adaptive triggers put you inside the game.
            The DualSense controller redefines how you play.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-black px-8 py-3 rounded-full font-medium text-sm"
          >
            Shop now
          </motion.button>
        </div>

        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative flex items-center justify-center h-[420px]"
          style={{ perspective: "1200px" }}
        >
          <motion.div
            className="pointer-events-none absolute w-72 h-72 rounded-full bg-blue-500/20 blur-3xl"
            style={{ x: translateX, y: translateY }}
          />

          <motion.img
            src={controllerImg}
            alt=""
            aria-hidden="true"
            className="absolute w-3/4 max-w-[380px] opacity-30 blur-md"
            style={{
              x: bgTranslateX,
              y: bgTranslateY,
              rotateX,
              rotateY,
            }}
          />

          <motion.img
            src={controllerImg}
            alt="Sony DualSense PS5 controller"
            className="relative z-10 w-3/4 max-w-[380px] drop-shadow-2xl"
            style={{
              x: translateX,
              y: translateY,
              rotateX,
              rotateY,
            }}
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;