import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutDashboard, Target, FileText, Code2, PlaySquare, Menu, X } from 'lucide-react'; // Added 'Home' here

export default function PageLayout({ children }) {
  // State to track if the sidebar is expanded or collapsed
  const [isOpen, setIsOpen] = useState(true);

  // Added the Home route to the top of the array
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Challenges', path: '/challenges', icon: Target },
    { name: 'Evaluate', path: '/evaluate', icon: PlaySquare },
    { name: 'Reports', path: '/reports', icon: FileText },
  ];

  return (
    <div className="flex h-screen w-full bg-[#09090b] text-zinc-100 font-sans overflow-hidden selection:bg-emerald-500/30">
      
      {/* Sidebar Navigation */}
      <aside 
        className={`border-r border-white/5 bg-[#0c0c0e] flex flex-col shrink-0 transition-all duration-300 ease-in-out relative ${
          isOpen ? 'w-64' : 'w-20'
        }`}
      >
        
        {/* Logo Area & Hamburger Toggle */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-white/5">
          {/* Logo - Fades and shrinks when closed */}
          <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${isOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
            <div className="bg-emerald-500/10 p-2 rounded-xl ring-1 ring-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)] shrink-0">
              <Code2 className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="font-bold tracking-tight text-white text-lg whitespace-nowrap">CodeLens</span>
          </div>

          {/* Toggle Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors focus:outline-none"
            aria-label="Toggle Sidebar"
          >
            {isOpen ? <X className="w-5 h-5 shrink-0" /> : <Menu className="w-5 h-5 shrink-0" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10'
                    : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
                }`
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              
              {/* Link Label - Fades out when closed */}
              <span className={`whitespace-nowrap transition-all duration-300 ${
                isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 hidden'
              }`}>
                {item.name}
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto overflow-x-hidden">
        {children}
      </main>
      
    </div>
  );
}