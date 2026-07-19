import Hero from "./Hero";
import img from "../../public/images/poster.jpg";
import ShowCase from "./ShowCase";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import Games from "../../public/images/Games/data.json";
import Accesssories from "../../public/images/Accessories/data.json";

const Home = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

const { scrollYProgress } = useScroll({
  target: sectionRef,
  offset: ["start 90%", "start 35%"],
});

const smooth = useSpring(scrollYProgress, {
  stiffness: 100,
  damping: 20,
});

const textX = useTransform(smooth, [0, 1], [-80, 0]);
const imageX = useTransform(smooth, [0, 1], [80, 0]);
const textY = useTransform(smooth, [0, 1], [20, 0]);
const imageY = useTransform(smooth, [0, 1], [20, 0]);
const opacity = useTransform(smooth, [0, 0.3], [0, 1]);
const scale = useTransform(smooth, [0, 1], [0.98, 1]);

  return (
    <div className="bg-neutral-950">
      <Hero />

      <section ref={sectionRef} className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="relative container mx-auto grid grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 md:px-10">
          <motion.div
            style={{
              x: textX,
              y: textY,
              opacity,
              scale,
            }}
            className="text-left"
          >
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-blue-400">
              Welcome to GameVault
            </p>

            <h2 className="mb-4 text-3xl font-bold leading-tight text-white md:text-5xl">
              Your one-stop shop for
              <br />
              <span className="bg-linear-to-r from-blue-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
                every gaming need
              </span>
            </h2>

            <p className="max-w-md leading-8 text-neutral-400">
              From the latest console launches to rare collector's editions,
              genuine accessories, and unbeatable pre-order deals — GameVault
              brings Faisalabad's favorite game store online. Real stock, real
              prices, and a team that plays what it sells.
            </p>
          </motion.div>

          {/* Right Image */}
          <motion.div
            style={{
              x: imageX,
              y: imageY,
              opacity,
              scale,
            }}
            className="flex justify-center md:justify-end"
          >
            <div className="relative overflow-hidden rounded-3xl border border-neutral-800 shadow-2xl">
              <img
                src={img}
                alt="Game Store"
                className="h-auto w-full max-w-md object-cover"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      <ShowCase games={Games} accessories={Accesssories} />
    </div>
  );
};

export default Home;
