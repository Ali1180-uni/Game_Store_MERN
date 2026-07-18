import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { MessageCircle, Gamepad2, Headphones, ShieldCheck } from "lucide-react";
import Map from "./Map/Map";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const WHATSAPP_NUMBER: number = 923001234567;

const features = [
  {
    icon: Gamepad2,
    title: "Latest Games",
    desc: "PS5, Xbox & PC titles — physical and digital, always in stock.",
  },
  {
    icon: Headphones,
    title: "Genuine Accessories",
    desc: "Controllers, headsets, and add-ons sourced from authorized dealers.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Service",
    desc: "Real support, fair pricing, and a team that actually plays games.",
  },
];

export default function About() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    console.log("Contact form submitted:", data);
    await new Promise((r) => setTimeout(r, 800));
    reset();
  };

  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-100"
        >
          <source src="/Videos/backVideo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-blue-400 text-xs font-medium tracking-[0.2em] uppercase mb-4">
            About GameVault
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Games. Gear. Community.
          </h2>
          <p className="text-neutral-400 text-base leading-relaxed">
            GameVault started as a Faisalabad game store and is now taking
            everything we've built online — the same curated inventory,
            genuine accessories, and honest service, wherever you are.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="border border-neutral-800 bg-neutral-900/50 backdrop-blur rounded-2xl p-6 hover:border-neutral-700 transition-colors"
            >
              <f.icon className="text-blue-400 mb-4" size={28} />
              <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="border border-neutral-800 bg-neutral-900/60 backdrop-blur rounded-2xl p-8 flex flex-col justify-center"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Get in touch</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input
                  {...register("name", { 
                    required: "Name is required",
                    minLength: { value: 3, message: "Name must be at least 3 characters" }
                  })}
                  placeholder="Full name"
                  className={`w-full bg-neutral-800/60 border rounded-lg px-4 py-3 text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:border-blue-500 transition-colors ${
                    errors.name ? "border-red-500/50 focus:border-red-500" : "border-neutral-700"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1 font-medium">{errors.name.message}</p>
                )}
              </div>

              <div>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: { 
                      value: /^[a-zA-Z0-0._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
                      message: "Please enter a valid email address" 
                    },
                  })}
                  placeholder="Email address"
                  className={`w-full bg-neutral-800/60 border rounded-lg px-4 py-3 text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:border-blue-500 transition-colors ${
                    errors.email ? "border-red-500/50 focus:border-red-500" : "border-neutral-700"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1 font-medium">{errors.email.message}</p>
                )}
              </div>

              <div>
                <input
                  {...register("phone", { 
                    required: "Phone number is required",
                    pattern: {
                      value: /^((\+92)|(0092)|(0))?3[0-9]{2}[0-9]{7}$/,
                      message: "Enter a valid mobile number (e.g. 03001234567)"
                    }
                  })}
                  placeholder="Phone number"
                  className={`w-full bg-neutral-800/60 border rounded-lg px-4 py-3 text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:border-blue-500 transition-colors ${
                    errors.phone ? "border-red-500/50 focus:border-red-500" : "border-neutral-700"
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-400 text-xs mt-1 font-medium">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <textarea
                  {...register("message", { 
                    required: "Message is required",
                    minLength: { value: 10, message: "Please detail your message (min 10 chars)" }
                  })}
                  placeholder="How can we help?"
                  rows={4}
                  className={`w-full bg-neutral-800/60 border rounded-lg px-4 py-3 text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:border-blue-500 transition-colors resize-none ${
                    errors.message ? "border-red-500/50 focus:border-red-500" : "border-neutral-700"
                  }`}
                />
                {errors.message && (
                  <p className="text-red-400 text-xs mt-1 font-medium">{errors.message.message}</p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-white text-black font-semibold py-3 rounded-lg text-sm transition-opacity disabled:opacity-60"
              >
                {isSubmitting ? "Sending..." : "Send message"}
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden border border-neutral-800 h-full min-h-105"
          >
            <Map />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center border-t border-neutral-800 pt-14"
        >
          <p className="text-neutral-400 text-sm mb-3">Prefer to chat directly?</p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 transition-colors text-black font-semibold px-6 py-3 rounded-full text-sm"
          >
            <MessageCircle size={18} />
            Message us on WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
