
import React, { useState } from 'react';
import { Client } from '../types';

interface ClientsProps {
  clients: Client[];
  onAddClient: (c: Client) => void;
}

const Clients: React.FC<ClientsProps> = ({ clients, onAddClient }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', industry: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddClient({
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      totalBilled: 0
    });
    setShowModal(false);
    setFormData({ name: '', email: '', industry: '' });
  };

  const formatSimple = (val: number) => `RS ${val.toFixed(0)}`;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white p-10 rounded-[2.5rem] border-l-[12px] border-emerald-500 shadow-sm gap-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">CLIENT DIRECTORY</h2>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest mt-1">ACTIVE BUSINESS ACCOUNTS</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black shadow-2xl shadow-emerald-600/20 hover:scale-105 transition-all text-xs tracking-[0.2em] uppercase"
        >
          ADD NEW CLIENT
        </button>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b-2 border-slate-100 text-slate-500 font-black uppercase tracking-[0.3em] text-[11px]">
            <tr>
              <th className="px-12 py-8">ENTITY NAME</th>
              <th className="px-12 py-8">SECTOR</th>
              <th className="px-12 py-8 text-right">TOTAL VOLUME</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[14px] font-medium text-slate-700">
            {clients.length === 0 ? (
              <tr><td colSpan={3} className="p-32 text-center text-slate-300 font-black uppercase tracking-[0.5em] text-xs">DIRECTORY EMPTY</td></tr>
            ) : (
              clients.map((c, idx) => (
                <tr key={c.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'} hover:bg-emerald-50/50 transition-colors`}>
                  <td className="px-12 py-8">
                    <div className="font-black text-slate-900 uppercase tracking-tight">{c.name}</div>
                    <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1">{c.email}</div>
                  </td>
                  <td className="px-12 py-8">
                    <span className="px-4 py-1.5 bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500">{c.industry}</span>
                  </td>
                  <td className="px-12 py-8 text-right font-black text-slate-900">{formatSimple(c.totalBilled)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[200] flex items-center justify-center p-8">
          <div className="bg-white rounded-[3rem] w-full max-w-xl p-16 shadow-2xl animate-in slide-in-from-bottom-12 duration-500">
            <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 mb-12 border-b-8 border-emerald-600 inline-block pb-3">NEW REGISTRATION</h3>
            <form onSubmit={handleSubmit} className="space-y-10">
               <div className="space-y-4">
                 <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">COMPANY ENTITY NAME</label>
                 <input required className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-black text-sm uppercase border-2 border-transparent focus:border-emerald-600 transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
               </div>
               <div className="space-y-4">
                 <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">CONTACT EMAIL</label>
                 <input required type="email" className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-black text-sm border-2 border-transparent focus:border-emerald-600 transition-all" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
               </div>
               <div className="space-y-4">
                 <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">BUSINESS SECTOR</label>
                 <input required className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-black text-sm uppercase border-2 border-transparent focus:border-emerald-600 transition-all" value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} />
               </div>
               <div className="flex gap-8 pt-8">
                 <button type="button" onClick={() => setShowModal(false)} className="px-8 py-5 font-black text-slate-400 uppercase text-xs tracking-widest hover:text-slate-900">DISCARD</button>
                 <button type="submit" className="flex-1 bg-emerald-600 text-white rounded-2xl py-5 font-black uppercase text-xs tracking-widest shadow-2xl transition-transform hover:scale-105">CREATE PROFILE</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
