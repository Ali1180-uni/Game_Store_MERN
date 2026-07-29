import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { motion } from "framer-motion";

function Footer() {
  return (
    <footer className="w-full border-t border-neutral-900 bg-neutral-950/95 px-6 py-6 text-neutral-400 backdrop-blur-sm md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex flex-col items-center gap-1 text-center sm:items-start sm:text-left">
          <p className="text-sm font-medium text-neutral-300">
            © 2026 GameVault. All rights reserved.
          </p>
          <p className="text-xs text-neutral-500">
            Developed by{" "}
            <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text font-medium text-transparent">
              Ali
            </span>{" "}
            with ❤️
          </p>
        </div>
        <div className="flex items-center gap-4">
          <motion.a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -3, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex h-9 w-9 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900/50 text-neutral-400 transition-all duration-300 hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400 hover:shadow-[0_0_15px_rgba(96,165,250,0.15)]"
          >
            <LinkedInIcon fontSize="small" />
          </motion.a>

          <motion.a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -3, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex h-9 w-9 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900/50 text-neutral-400 transition-all duration-300 hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-purple-400 hover:shadow-[0_0_15px_rgba(192,132,252,0.15)]"
          >
            <GitHubIcon fontSize="small" />
          </motion.a>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
