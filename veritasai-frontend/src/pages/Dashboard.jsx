import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ShieldAlert, ShieldQuestion, Loader2, Search } from "lucide-react";
import clsx from "clsx";

export default function Dashboard() {
  const [llmResponse, setLlmResponse] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (!llmResponse.trim()) {
      setError("Please provide an LLM response to verify.");
      return;
    }
    
    setError("");
    setIsVerifying(true);

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ llmResponse })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Verification failed");
      }

      setResults(data.data);
    } catch (err) {
      console.error(err);
      setError(err.message || "An exception occurred.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="w-full grow flex flex-col items-center bg-base py-12 px-4 relative">
      <div className="max-w-4xl w-full flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex flex-col pb-4 border-b border-border">
          <h1 className="text-2xl font-semibold text-white">Fact Verification</h1>
          <p className="text-sm text-zinc-400 mt-1">Submit text below to run cross-validation against verified datasets.</p>
        </div>

        {/* Action Panel */}
        <div className="flex flex-col gap-4 relative">
          <textarea
            value={llmResponse}
            onChange={(e) => setLlmResponse(e.target.value)}
            disabled={isVerifying}
            placeholder="Input raw LLM completion here..."
            className="w-full min-h-[250px] bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-md p-5 outline-none focus:border-zinc-500 transition-colors resize-y leading-relaxed text-[15px] placeholder:text-zinc-600 disabled:opacity-50"
            spellCheck="false"
          />
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-zinc-500">Max tokens: 4096</span>
            <button 
              onClick={handleVerify}
              disabled={isVerifying || !llmResponse.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-md bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              <Search size={16} />
              Process Text
            </button>
          </div>

          {/* Loading Overlay */}
          <AnimatePresence>
            {isVerifying && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 bg-zinc-950/80 backdrop-blur-[2px] rounded-md flex flex-col items-center justify-center border border-zinc-800"
              >
                <Loader2 className="animate-spin text-white mb-4" size={32} />
                <h3 className="text-white font-medium text-lg">Analyzing Claims</h3>
                <p className="text-zinc-400 text-sm mt-1">Performing vector lookups...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {error && (
          <div className="p-4 rounded-md bg-red-950/50 border border-red-900 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Results Area */}
        {results && !isVerifying && (
          <div className="flex flex-col gap-4 mt-8 pt-8 border-t border-border">
            <div className="flex justify-between items-end mb-2">
              <h2 className="text-lg font-semibold text-white">Detection Results</h2>
              <span className="text-sm text-zinc-500">ID: {results.auditId}</span>
            </div>
            
            {results.claims.length === 0 ? (
              <div className="p-8 rounded-md bg-zinc-900 border border-zinc-800 text-center text-zinc-500 text-sm">
                <p>{results.message || "No verifiable explicit claims identified."}</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {results.claims.map((claim, idx) => (
                  <ClaimCard key={idx} claimData={claim} />
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

function ClaimCard({ claimData }) {
  const [expanded, setExpanded] = useState(false);
  const { claim, verdict, confidence, reason, evidence } = claimData;

  const isVerified = verdict === "verified";
  const isFalse = verdict === "false";
  
  const statusColor = isVerified ? "text-emerald-400" : isFalse ? "text-rose-400" : "text-amber-400";
  const bgColor = isVerified ? "bg-emerald-500/10" : isFalse ? "bg-rose-500/10" : "bg-amber-500/10";
  const borderColor = isVerified ? "border-emerald-500/20" : isFalse ? "border-rose-500/20" : "border-amber-500/20";
  const indicatorColor = isVerified ? "bg-emerald-500" : isFalse ? "bg-rose-500" : "bg-amber-500";

  return (
    <div className="rounded-md border border-border bg-zinc-900 overflow-hidden flex flex-col">
      <div 
        className="p-4 cursor-pointer flex items-start gap-4 hover:bg-zinc-800/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${indicatorColor}`} />
        <div className="flex-grow min-w-0">
          <p className="text-zinc-100 text-[15px] font-medium leading-normal mb-1">"{claim}"</p>
          <div className="flex items-center gap-3">
            <span className={clsx("text-xs font-semibold uppercase tracking-wider", statusColor)}>
              {verdict}
            </span>
            <span className="text-xs text-zinc-500">
              Confidence: {confidence}%
            </span>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border bg-zinc-950 overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-5">
              {reason && (
                <div>
                  <h4 className="text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider">Reasoning Logic</h4>
                  <p className="text-zinc-300 text-sm leading-relaxed">{reason}</p>
                </div>
              )}
              
              {evidence && evidence.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wider">Matched Vectors</h4>
                  <div className="flex flex-col gap-2">
                    {evidence.map((ev, i) => (
                      <div key={i} className="px-3 py-2 rounded border border-border bg-zinc-900 flex flex-col gap-1.5">
                        <p className="text-zinc-400 text-[13px] italic">"{ev.text}"</p>
                        <div className="flex justify-between items-center text-[11px] text-zinc-500">
                          <span className="font-mono">{ev.source}</span>
                          <span>Sim: {ev.score.toFixed(3)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
