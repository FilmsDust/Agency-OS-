
import React, { useState } from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'DASHBOARD' as View, label: 'MAIN VIEW' },
    { id: 'INVOICES' as View, label: 'BILLING' },
    { id: 'CLIENTS' as View, label: 'CLIENTS' },
    { id: 'PROPOSALS' as View, label: 'PROJECT DEALS' },
    { id: 'STAFF' as View, label: 'TEAM' },
    { id: 'TRANSACTIONS' as View, label: 'HISTORY' },
    { id: 'ASSISTANT' as View, label: 'AI CHAT' },
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-6 right-6 z-[100] bg-blue-600 text-white p-4 rounded-2xl shadow-2xl"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d={isOpen ? "M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      <div className={`
        w-72 h-screen fixed left-0 top-0 bg-slate-900 flex flex-col transition-all duration-500 z-[90]
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-10">
          <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-white text-xl">AG</div>
              <h1 className="text-xl font-black tracking-tighter uppercase text-white">ADVERTSGEN</h1>
          </div>
          <p className="text-[11px] text-slate-500 mt-4 uppercase tracking-[0.4em] font-bold">SYSTEM HUB</p>
        </div>
        
        <nav className="flex-1 px-6 space-y-3 mt-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setView(item.id); setIsOpen(false); }}
              className={`w-full text-left px-6 py-4 rounded-2xl transition-all duration-300 text-[11px] tracking-widest uppercase font-bold ${
                currentView === item.id 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-10">
          <div className="flex items-center space-x-4 p-5 bg-slate-950/50 rounded-3xl border border-slate-800">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xs uppercase">ADM</div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-black text-white uppercase truncate">ADMIN PORTAL</p>
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">VERIFIED</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
