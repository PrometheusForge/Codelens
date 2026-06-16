import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { 
  Home, LayoutDashboard, Target, 
  FileText, Code2, PlaySquare, Menu, X, TerminalSquare 
} from 'lucide-react';

export default function PageLayout({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Challenges', path: '/challenges', icon: Target },
    { name: 'Evaluate', path: '/evaluate', icon: PlaySquare },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Arena', path: '/arena', icon: Code2 },
  ];

  return (
    <div className="flex h-screen w-full bg-[#030305] text-zinc-100 font-['Outfit'] overflow-hidden selection:bg-emerald-500/30">
      
      {/* Sidebar: System Console */}
      <motion.aside 
        initial={false}
        animate={{ width: isOpen ? 256 : 80 }}
        className="relative border-r border-white/5 bg-[#030305] flex flex-col shrink-0 z-40"
      >
        {/* Console Header */}
        <div className={`h-20 flex items-center border-b border-white/5 transition-all duration-300 ${isOpen ? 'justify-between px-5' : 'justify-center'}`}>
          
          <motion.div 
            animate={{ 
              width: isOpen ? 'auto' : 0, 
              opacity: isOpen ? 1 : 0 
            }}
            className="flex items-center gap-3 overflow-hidden"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0">
              <TerminalSquare className="h-4 w-4" />
            </div>
            {/* Note: We removed the motion.span here because the parent motion.div now handles the animation for the whole group */}
            <span className="font-bold tracking-wide text-white whitespace-nowrap">
              CodeLens
            </span>
          </motion.div>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-all ring-1 ring-white/10 shrink-0"
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Console Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                    : 'text-zinc-500 hover:bg-white/[0.02] hover:text-zinc-200'
                }`
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <motion.span 
                animate={{ opacity: isOpen ? 1 : 0, display: isOpen ? 'block' : 'none' }}
                className="font-['JetBrains_Mono'] uppercase tracking-widest text-[10px]"
              >
                {item.name}
              </motion.span>
            </NavLink>
          ))}
        </nav>

        {/* Footer Telemetry */}
        <div className={`p-4 border-t border-white/5 ${isOpen ? 'block' : 'hidden'}`}>
          <div className="rounded-xl bg-black/40 p-4 ring-1 ring-white/5">
            <p className="text-[10px] text-zinc-500 font-['JetBrains_Mono'] mb-2">SYSTEM_STATUS</p>
            <div className="flex items-center gap-2 text-emerald-500 text-xs font-mono">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              ONLINE
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto overflow-x-hidden bg-[#030305]">
        {/* Nested background grid to match the Home page theme */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        
        <div className="relative z-10 h-full">
          {children}
        </div>
      </main>
      
    </div>
  );
}