
import React, { useState } from 'react';
import { Client } from '../types';
import { jsPDF } from 'jspdf';

interface ClientsProps {
  clients: Client[];
  onAddClient: (c: Client) => void;
}

const Clients: React.FC<ClientsProps> = ({ clients, onAddClient }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', industry: '' });

  const exportClientsPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(52, 168, 83); // Google Green
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("CLIENT DIRECTORY AUDIT", 20, 25);
    
    doc.setTextColor(32, 33, 36);
    doc.setFontSize(10);
    let y = 60;
    doc.text("Client Entity", 20, y);
    doc.text("Sector", 80, y);
    doc.text("Total Billed Volume", 140, y);
    y += 10;
    
    doc.setFont("helvetica", "normal");
    clients.forEach(c => {
      doc.text(c.name, 20, y);
      doc.text(c.industry, 80, y);
      doc.text(`RS ${c.totalBilled.toLocaleString()}`, 140, y);
      y += 10;
    });
    doc.save("AdvertsGen_Client_Directory.pdf");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddClient({
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      totalBilled: 0,
      status: 'ACTIVE'
    });
    setShowModal(false);
    setFormData({ name: '', email: '', industry: '' });
  };

  const formatSimple = (val: number) => `RS ${val.toLocaleString()}`;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white p-10 rounded-[2rem] border-l-[12px] border-[#34A853] shadow-xl gap-8">
        <div>
          <h2 className="text-4xl font-medium text-[#202124] tracking-tighter uppercase leading-none">Partners Directory</h2>
          <p className="text-[#5f6368] font-medium text-sm uppercase tracking-widest mt-2">Active Business Ecosystem</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={exportClientsPDF}
             className="bg-white border-2 border-[#34A853] text-[#34A853] px-8 py-4 rounded-xl font-medium text-xs tracking-widest uppercase"
           >
             Download Directory
           </button>
           <button 
             onClick={() => setShowModal(true)} 
             className="bg-[#34A853] text-white px-10 py-5 rounded-xl font-medium shadow-lg hover:bg-[#2d9249] transition-all text-xs tracking-widest uppercase"
           >
             Register Partner
           </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#dadce0] overflow-hidden google-shadow">
        <table className="w-full text-left">
          <thead className="bg-[#f8f9fa] border-b border-[#dadce0] text-[#5f6368] font-semibold uppercase tracking-[0.2em] text-[11px]">
            <tr>
              <th className="px-10 py-6">Entity Identity</th>
              <th className="px-10 py-6">Operational Sector</th>
              <th className="px-10 py-6 text-right">Lifetime Volume</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#dadce0] text-sm text-[#3c4043]">
            {clients.length === 0 ? (
              <tr><td colSpan={3} className="p-40 text-center text-[#bdc1c6] font-medium uppercase tracking-[0.5em]">No Partners Registered</td></tr>
            ) : (
              clients.map((c, idx) => (
                <tr key={c.id} className="hover:bg-[#e6f4ea] transition-colors">
                  <td className="px-10 py-8">
                    <div className="font-semibold text-[#202124] uppercase tracking-tight text-lg leading-none">{c.name}</div>
                    <div className="text-[10px] text-[#5f6368] font-medium tracking-widest uppercase mt-2">{c.email}</div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="px-4 py-2 bg-[#f1f3f4] rounded-lg text-[10px] font-semibold uppercase tracking-widest text-[#5f6368]">{c.industry}</span>
                  </td>
                  <td className="px-10 py-8 text-right font-semibold text-[#202124] text-xl tracking-tight">{formatSimple(c.totalBilled)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#202124]/80 backdrop-blur-md z-[200] flex items-center justify-center p-8">
          <div className="bg-white rounded-3xl w-full max-w-xl p-12 shadow-2xl border-t-[16px] border-[#34A853] animate-in zoom-in duration-200">
            <h3 className="text-3xl font-medium uppercase tracking-tighter text-[#202124] mb-12">Entity Registration</h3>
            <form onSubmit={handleSubmit} className="space-y-8">
               <div className="space-y-4">
                 <label className="text-[11px] font-semibold uppercase tracking-widest text-[#5f6368]">Corporate Name</label>
                 <input required className="w-full p-5 bg-[#f8f9fa] border border-[#dadce0] focus:border-[#34A853] rounded-xl outline-none font-medium text-sm uppercase transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
               </div>
               <div className="space-y-4">
                 <label className="text-[11px] font-semibold uppercase tracking-widest text-[#5f6368]">Billing Intelligence Email</label>
                 <input required type="email" className="w-full p-5 bg-[#f8f9fa] border border-[#dadce0] focus:border-[#34A853] rounded-xl outline-none font-medium text-sm transition-all" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
               </div>
               <div className="space-y-4">
                 <label className="text-[11px] font-semibold uppercase tracking-widest text-[#5f6368]">Industry Sector</label>
                 <input required className="w-full p-5 bg-[#f8f9fa] border border-[#dadce0] rounded-xl outline-none font-medium text-sm uppercase transition-all" value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} />
               </div>
               <div className="flex gap-6 pt-10">
                 <button type="button" onClick={() => setShowModal(false)} className="px-8 py-5 font-semibold text-[#5f6368] uppercase text-xs tracking-widest hover:bg-[#f1f3f4] rounded-xl transition-colors">Discard</button>
                 <button type="submit" className="flex-1 bg-[#34A853] text-white rounded-xl py-5 font-medium uppercase text-xs tracking-widest shadow-xl hover:bg-[#2d9249] transition-transform active:scale-95">Establish Link</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
