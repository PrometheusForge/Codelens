import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Target, FileText, Code2, PlaySquare } from 'lucide-react';

export default function PageLayout({ children }) {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Challenges', path: '/challenges', icon: Target },
    { name: 'Evaluate', path: '/evaluate', icon: PlaySquare },
    { name: 'Reports', path: '/reports', icon: FileText },
  ];

  return (
    <div className="flex h-screen w-full bg-[#09090b] text-zinc-100 font-sans overflow-hidden selection:bg-emerald-500/30">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/5 bg-[#0c0c0e] flex flex-col shrink-0">
        
        {/* Logo Area */}
        <div className="h-20 flex items-center gap-3 px-6 border-b border-white/5">
          <div className="bg-emerald-500/10 p-2 rounded-xl ring-1 ring-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <Code2 className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="font-bold tracking-tight text-white text-lg">CodeLens</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10'
                    : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.name}
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