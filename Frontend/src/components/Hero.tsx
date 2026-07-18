import { useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import consoleImg from "../../public/images/ps5.png";

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  // Cursor ambient glow
  const fieldX = useMotionValue(50);
  const fieldY = useMotionValue(50);

  function handleHeroMouseMove(e: React.MouseEvent) {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    fieldX.set(x);
    fieldY.set(y);
  }

  const fieldGlowBackground = useTransform(
    [fieldX, fieldY],
    ([x, y]) =>
      `radial-gradient(650px circle at ${x}% ${y}%, rgba(110,70,255,0.10), transparent 70%)`
  );

  return (
    <section
      ref={heroRef}
      onMouseMove={handleHeroMouseMove}
      className="relative min-h-screen overflow-hidden bg-linear-to-b from-neutral-950 via-neutral-900 to-black flex items-center justify-center"
    >
      {/* Cursor Ambient Glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: fieldGlowBackground }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg,#fff 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 py-24 md:grid-cols-2">

        {/* LEFT */}
        <div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .5 }}
            className="mb-4 uppercase tracking-[0.25em] text-sm font-medium text-violet-400"
          >
            Play Has No Limits
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .6 }}
            className="text-5xl md:text-7xl font-black leading-[1.05] text-white"
          >
            Power Meets
            <br />

            <span className="bg-linear-to-r from-violet-400 via-fuchsia-300 to-sky-400 bg-clip-text text-transparent">
              Silence
            </span>

          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .15 }}
            className="mt-7 max-w-lg text-neutral-400 leading-8"
          >
            Ultra-fast loading, breathtaking visuals, and immersive haptics.
            Experience the next generation of gaming with the PlayStation 5 Slim.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: .25 }}
            className="mt-10 flex gap-5"
          >

            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 40px rgba(255,255,255,.18)",
              }}
              whileTap={{ scale: .95 }}
              className="rounded-full bg-white px-8 py-3 font-semibold text-black"
            >
              Shop Now
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.05,
                borderColor: "#8B5CF6",
              }}
              whileTap={{ scale: .95 }}
              className="rounded-full border border-neutral-700 px-8 py-3 font-semibold text-white"
            >
              Learn More
            </motion.button>

          </motion.div>

        </div>

        {/* RIGHT */}
        <motion.div
          initial="rest"
          whileHover="hover"
          className="relative flex items-center justify-center"
        >

          {/* Purple Glow */}
          <motion.div
            variants={{
              rest: {
                opacity: .45,
                scale: 1,
              },
              hover: {
                opacity: .95,
                scale: 1.18,
              },
            }}
            transition={{
              duration: .4,
              ease: "easeOut",
            }}
            className="absolute h-90 w-90 rounded-full bg-violet-600/30 blur-[120px]"
          />

          {/* Console */}
          <motion.img
            src={consoleImg}
            alt="PlayStation 5 Slim"
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: [0, -10, 0],
            }}
            whileHover={{
              scale: 1.04,
            }}
            transition={{
              opacity: {
                duration: .8,
              },
              y: {
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut",
              },
              scale: {
                duration: .3,
              },
            }}
            className="relative z-10 w-full max-w-110 select-none drop-shadow-[0_40px_80px_rgba(0,0,0,.65)]"
            draggable={false}
          />

        </motion.div>

      </div>
    </section>
  );
};

export default Hero;