
import React, { useState } from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'DASHBOARD' as View, label: 'Dashboard', icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
    { id: 'INVOICES' as View, label: 'Invoices', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-2h5v-2h-5v2zm0-4h5v-2h-5v2zm-5 4h3v-2H7v2zm0-4h3v-2H7v2z' },
    { id: 'PROPOSALS' as View, label: 'Proposals', icon: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z' },
    { id: 'STAFF' as View, label: 'Team', icon: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z' },
    { id: 'TRANSACTIONS' as View, label: 'Ledger', icon: 'M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z' },
    { id: 'ASSISTANT' as View, label: 'AI Support', icon: 'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z' },
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[100] bg-[#4285F4] text-white p-4 rounded-full shadow-lg"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d={isOpen ? "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" : "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"} />
        </svg>
      </button>

      <div className={`
        w-64 h-screen fixed left-0 top-0 bg-white border-r border-[#dadce0] flex flex-col transition-all duration-300 z-[90]
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 mb-4">
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#4285F4] rounded-lg flex items-center justify-center font-black text-white text-lg">A</div>
              <h1 className="text-xl font-bold tracking-tight text-[#5f6368]">AdvertsGen</h1>
          </div>
        </div>
        
        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setView(item.id); setIsOpen(false); }}
              className={`w-full flex items-center gap-4 px-6 py-3 rounded-full transition-all duration-200 text-sm font-bold ${
                currentView === item.id 
                  ? 'bg-[#e8f0fe] text-[#1967d2]' 
                  : 'text-[#5f6368] hover:bg-[#f1f3f4]'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d={item.icon} />
              </svg>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6">
          <div className="bg-[#f8f9fa] rounded-2xl p-4 border border-[#dadce0]">
            <p className="text-[10px] font-black text-[#5f6368] uppercase tracking-widest mb-1">Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#34A853] rounded-full"></div>
              <span className="text-[11px] font-bold text-[#202124]">Enterprise Active</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
