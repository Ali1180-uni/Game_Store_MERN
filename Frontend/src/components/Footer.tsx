import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { motion } from "framer-motion";

function Footer() {
  return (
    <footer className="bg-neutral-950/95 backdrop-blur-sm border-t border-neutral-800 text-neutral-400 py-8 px-8 mt-auto">
      <div className="flex flex-col items-center gap-2 text-sm">
        <p className="text-neutral-500">
          © 2026 GameVault. All rights reserved.
        </p>
        <p className="text-neutral-500">
          Developed by{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400 font-medium">
            Ali
          </span>{" "}
          with ❤️
        </p>

        <div className="flex gap-6 mt-3">
          <motion.a
            href="https://www.linkedin.com/in/hiali1180/"
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-1.5 text-neutral-400 hover:text-blue-400 transition-colors duration-300"
          >
            <LinkedInIcon
              fontSize="small"
              className="transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_rgba(96,165,250,0.6)]"
            />
            <span className="relative">
              LinkedIn
              <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-blue-400 transition-all duration-300 group-hover:w-full" />
            </span>
          </motion.a>

          <motion.a
            href="https://github.com/Ali1180-uni"
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-1.5 text-neutral-400 hover:text-purple-400 transition-colors duration-300"
          >
            <GitHubIcon
              fontSize="small"
              className="transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_rgba(192,132,252,0.6)]"
            />
            <span className="relative">
              GitHub
              <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-purple-400 transition-all duration-300 group-hover:w-full" />
            </span>
          </motion.a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;