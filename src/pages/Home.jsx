import { motion } from 'framer-motion';
import { 
  ArrowRight, TerminalSquare, Swords, 
  Activity, ShieldAlert, Zap, Cpu
} from 'lucide-react';

// --- ACETERNITY-STYLE BACKGROUND EFFECT ---
const AuroraBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-[#030305]">
    {/* Grid Substrate with Radial Fade */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
    
    {/* Floating Light Beams */}
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 0.15, scale: 1 }}
      transition={{ duration: 2, ease: "easeOut" }}
      className="absolute top-[-10%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/20 blur-[120px] mix-blend-screen"
    />
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 0.1, scale: 1 }}
      transition={{ duration: 2.5, ease: "easeOut", delay: 0.2 }}
      className="absolute top-[10%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-violet-600/20 blur-[100px] mix-blend-screen"
    />
  </div>
);

// --- ACETERNITY-STYLE GLOWING BENTO CARD ---
const GlowingCard = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    whileHover={{ y: -5 }}
    className={`group relative rounded-3xl bg-[#09090b] ring-1 ring-white/10 p-8 overflow-hidden ${className}`}
  >
    {/* Hover Gradient that follows the top edge */}
    <div className="absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent via-emerald-500/0 to-transparent group-hover:via-emerald-500/50 transition-all duration-700" />
    
    {/* Soft inner glow on hover */}
    <div className="absolute -inset-4 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    
    <div className="relative z-10 h-full flex flex-col">
      {children}
    </div>
  </motion.div>
);

export default function Home() {
  return (
    <div className="relative min-h-screen w-full text-zinc-100 font-['Outfit'] selection:bg-emerald-500/30">
      
      <AuroraBackground />

      {/* TOP NAVIGATION */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 py-6"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <TerminalSquare className="h-4 w-4" />
          </div>
          <span className="font-bold tracking-wide text-lg">CodeLens</span>
        </div>
        
        <button className="relative px-6 py-2 rounded-full bg-white/[0.05] ring-1 ring-white/10 text-sm font-medium hover:bg-white/[0.1] transition-colors backdrop-blur-md overflow-hidden group">
          <span className="relative z-10">Access Terminal</span>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-violet-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </motion.nav>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-40 pb-32">
        
        {/* HERO SECTION */}
        <section className="flex flex-col items-center text-center mb-32">
          
          {/*<motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full bg-[#0c0c0e] px-4 py-1.5 ring-1 ring-white/10 shadow-xl"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-['JetBrains_Mono'] uppercase tracking-widest text-zinc-400">
              Aegis Engine Now Live
            </span>
          </motion.div>*/}

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tighter leading-[1.05] mb-6"
          >
            Evaluate Intelligence. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 via-zinc-400 to-zinc-600">
              Benchmarking Weaponized.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-2xl text-lg text-zinc-400 leading-relaxed mb-10"
          >
            The definitive battleground for Large Language Models. Deploy code generation arenas, automate grading via the Universal Judge, and extract real-time telemetry.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <button className="group relative flex h-12 items-center gap-3 rounded-full bg-zinc-100 pl-4 pr-6 text-sm font-bold text-black transition-all hover:scale-[1.02] hover:bg-white active:scale-[0.98]">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 transition-transform group-hover:rotate-12">
                <Swords className="h-4 w-4" />
              </div>
              Initialize Arena
            </button>
            <button className="flex h-12 items-center gap-2 rounded-full px-6 text-sm font-medium text-zinc-300 hover:text-white transition-colors">
              View Telemetry <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </section>

        {/* BENTO GRID (The Refero / Aceternity standard layout) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[380px]">
          
          {/* Main Feature: Arena */}
          <GlowingCard className="md:col-span-8" delay={0.1}>
            <div className="flex flex-col h-full justify-between">
              <div>
                <Swords className="h-6 w-6 text-emerald-400 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Simultaneous Generation</h2>
                <p className="text-zinc-400 text-sm max-w-md">
                  Pit Llama 3, Gemini, and Mistral against each other in real-time. CodeLens captures response times, token efficiency, and syntax structures side-by-side.
                </p>
              </div>
              
              {/* Abstract Terminal UI inside the card */}
              <div className="h-32 w-full rounded-xl bg-black/50 ring-1 ring-white/10 p-4 font-['JetBrains_Mono'] text-xs text-zinc-500 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
                <p><span className="text-emerald-500">➜</span>  model_id: "llama-3-70b"</p>
                <p className="mt-1"><span className="text-emerald-500">➜</span>  evaluating parameters...</p>
                <p className="mt-1 text-emerald-400/70">✔ Execution time: 1.2s</p>
              </div>
            </div>
          </GlowingCard>

          {/* Secondary Feature: Judge */}
          <GlowingCard className="md:col-span-4" delay={0.2}>
            <ShieldAlert className="h-6 w-6 text-violet-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">The Aegis Judge</h2>
            <p className="text-zinc-400 text-sm mb-auto">
              Every line of code is routed through a secondary Qwen-3-32b arbiter model to score correctness and security.
            </p>
            <div className="mt-8 flex items-end gap-2 text-violet-400 font-['JetBrains_Mono'] text-4xl font-bold">
              98.4<span className="text-lg text-zinc-500 mb-1">avg score</span>
            </div>
          </GlowingCard>

          {/* Feature 3: Radar Chart Mock */}
          <GlowingCard className="md:col-span-4" delay={0.3}>
            <Activity className="h-6 w-6 text-amber-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Live Radar</h2>
            <p className="text-zinc-400 text-sm">
              Dimensional telemetry charts mapping efficiency vs readability.
            </p>
            {/* Visual representation of radar points */}
            <div className="absolute bottom-8 right-8 w-32 h-32 opacity-20 pointer-events-none">
              <svg viewBox="0 0 100 100" className="w-full h-full stroke-emerald-500 fill-emerald-500/20" strokeWidth="2">
                <polygon points="50,5 95,40 75,95 25,95 5,40" />
              </svg>
            </div>
          </GlowingCard>

          {/* Feature 4: The Database */}
          <GlowingCard className="md:col-span-8" delay={0.4}>
             <div className="flex flex-col h-full justify-center pl-4 md:pl-8 border-l border-white/10">
               <h2 className="text-3xl font-bold mb-4">Permanent Evaluation Matrices.</h2>
               <p className="text-zinc-400 text-sm max-w-lg leading-relaxed">
                 Stop guessing which model performs best for your specific edge cases. CodeLens logs every battle into Supabase, structuring a time-traveling evaluation matrix for your engineering team.
               </p>
             </div>
          </GlowingCard>

        </div>
      </main>
    </div>
  );
}