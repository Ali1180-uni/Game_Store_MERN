import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import error from "../../public/images/error.gif";

const Error = () => {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center bg-neutral-950 overflow-hidden px-6">
      <div className="pointer-events-none absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-red-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-purple-500/10 blur-[100px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[7rem] md:text-[9rem] font-thin leading-none text-red-500 tracking-widest drop-shadow-[0_0_30px_rgba(239,68,68,0.35)]"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-xl md:text-2xl font-semibold text-white -mt-2 mb-2"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-neutral-400 text-sm md:text-base mb-8"
        >
          The page you are looking for does not exist or has been moved.
        </motion.p>

        {/* Gif with soft blurred backdrop glow behind it */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative mb-10"
        >
          <div className="absolute inset-0 bg-red-500/15 blur-3xl rounded-full scale-90" />
          <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900/40 backdrop-blur-sm p-2">
            <img
              src={error}
              alt="Lost caveman illustration"
              className="w-64 md:w-80 h-auto rounded-xl"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <NavLink
            to="/"
            className="inline-flex items-center gap-2 bg-white text-black px-7 py-3 rounded-full font-medium text-sm hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-shadow"
          >
            Back to Home
          </NavLink>
        </motion.div>
      </div>
    </section>
  );
};

export default Error;