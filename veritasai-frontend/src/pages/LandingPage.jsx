import { motion } from "framer-motion";
import { ArrowRight, ShieldAlert, Cpu, Layers } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const fade = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  return (
    <div className="w-full flex-grow flex flex-col items-center relative">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-24 lg:py-32 flex flex-col items-start w-full">
        
        <motion.div 
          className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 mb-8"
          initial="hidden" animate="visible" variants={fade}
        >
          <span className="w-2 h-2 rounded-full bg-zinc-400"></span>
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Enterprise Verification</span>
        </motion.div>

        <motion.h1 
          className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 text-zinc-100 leading-tight max-w-3xl"
          initial="hidden" animate="visible" variants={fade}
        >
          Identify AI Hallucinations <br />
          <span className="text-zinc-500">In Real-Time.</span>
        </motion.h1>

        <motion.p 
          className="text-lg text-zinc-400 mb-10 max-w-2xl leading-relaxed"
          initial="hidden" animate="visible" variants={fade}
        >
          VeritasAI is an advanced classification layer that intercepts, analyzes, 
          and fact-checks LLM responses instantly, ensuring reliability in AI-driven outputs.
        </motion.p>

        <motion.div initial="hidden" animate="visible" variants={fade}>
          <Link to="/app">
            <button className="flex items-center gap-2 px-6 py-3 rounded-md bg-white text-black font-medium hover:bg-zinc-200 transition-colors">
              Access Dashboard
              <ArrowRight size={18} />
            </button>
          </Link>
        </motion.div>

        <motion.div 
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 w-full border-t border-zinc-800 pt-16"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}
        >
          <FeatureCard 
            icon={<Cpu size={24} className="text-zinc-400" />}
            title="Claim Extraction"
            description="Isolate declarative statements from unstructured generated text automatically."
          />
          <FeatureCard 
            icon={<Layers size={24} className="text-zinc-400" />}
            title="Vector References"
            description="Retrieve and align authoritative data segments directly relating to claims."
          />
          <FeatureCard 
            icon={<ShieldAlert size={24} className="text-zinc-400" />}
            title="Score Verdicts"
            description="Yield definitive confidence levels on truthfulness, preventing hallucinations out of the box."
          />
        </motion.div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="flex flex-col items-start text-left">
      <div className="w-10 h-10 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 text-zinc-300">
        {icon}
      </div>
      <h3 className="text-base font-semibold mb-2 text-zinc-100">{title}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
    </div>
  );
}
