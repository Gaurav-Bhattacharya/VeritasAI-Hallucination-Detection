import { Link, useLocation } from "react-router-dom";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-base/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center text-text-main group-hover:text-zinc-300 transition-colors">
              <ShieldCheck size={24} />
            </div>
            <span className="font-semibold text-lg tracking-tight text-text-main group-hover:text-zinc-300 transition-colors">
              VeritasAI
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {location.pathname !== "/app" ? (
              <Link to="/app">
                <button className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-white text-black font-medium hover:bg-zinc-200 transition-colors text-sm">
                  Launch App <ArrowRight size={14} />
                </button>
              </Link>
            ) : (
              <Link to="/">
                <button className="text-sm font-medium text-text-muted hover:text-white transition-colors">
                  Exit
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
