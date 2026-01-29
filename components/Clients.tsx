
import React, { useState, useMemo } from 'react';
import { Client, Project, Invoice } from '../types';
import { jsPDF } from 'jspdf';

interface ClientsProps {
  clients: Client[];
  projects: Project[];
  invoices: Invoice[];
  onAddClient: (c: Client) => void;
  onBillClient: (clientId: string) => void;
  onDeleteClient: (id: string) => void;
}

const Clients: React.FC<ClientsProps> = ({ clients, projects, invoices, onAddClient, onBillClient, onDeleteClient }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', industry: '' });

  const exportClientsPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(52, 168, 83); // Google Green
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
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
    if (!formData.name.trim()) return;
    
    onAddClient({
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      industry: formData.industry,
      totalBilled: 0,
      status: 'ACTIVE'
    });
    setShowModal(false);
    setFormData({ name: '', email: '', industry: '' });
  };

  const getClientStats = useMemo(() => {
    return (clientId: string) => {
      const clientProjects = projects.filter(p => p.clientId === clientId);
      const clientInvoices = invoices.filter(i => i.clientId === clientId);
      return {
        activeProjects: clientProjects.filter(p => p.status === 'ACTIVE').length,
        totalProjects: clientProjects.length,
        unpaidInvoices: clientInvoices.filter(i => i.status !== 'PAID').length,
      };
    };
  }, [projects, invoices]);

  const formatSimple = (val: number) => `RS ${val.toLocaleString()}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white p-6 sm:p-10 rounded-2xl border-l-8 border-[#34A853] shadow-sm gap-6">
        <div className="text-left">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#202124] tracking-tight uppercase leading-none">Partners</h2>
          <p className="text-[#4285F4] font-semibold text-[9px] sm:text-[10px] uppercase tracking-[0.3em] mt-2">Active Corporate Ecosystem</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
           <button 
             onClick={exportClientsPDF}
             className="flex-1 bg-white border border-[#dadce0] text-[#5f6368] px-6 py-3 rounded-xl font-semibold text-[10px] tracking-widest uppercase hover:bg-slate-50 transition-all"
           >
             Audit File
           </button>
           <button 
             onClick={() => setShowModal(true)} 
             className="flex-1 bg-[#34A853] text-white px-8 py-3.5 rounded-xl font-bold shadow-md hover:bg-[#2d9249] transition-all text-[10px] tracking-[0.2em] uppercase active:scale-95"
           >
             + Add Partner
           </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#dadce0] overflow-hidden shadow-sm">
        <div className="block md:hidden">
          {clients.length === 0 ? (
            <div className="p-12 text-center text-[#bdc1c6] font-semibold uppercase tracking-widest text-[10px]">No records found</div>
          ) : (
            <div className="divide-y divide-[#f1f3f4]">
              {clients.map(c => {
                const stats = getClientStats(c.id);
                return (
                  <div key={c.id} className="p-6 space-y-4" onClick={() => setSelectedClient(c)}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-bold text-[#202124] uppercase tracking-tight">{c.name}</h4>
                        <p className="text-[9px] text-[#5f6368] font-medium tracking-widest">{c.email}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-green-50 text-[#34A853] rounded-full text-[8px] font-bold uppercase tracking-widest">Active</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-[#f8f9fa] border-b border-[#dadce0] text-[#5f6368] font-semibold uppercase tracking-[0.2em] text-[10px]">
              <tr>
                <th className="px-10 py-6">Entity Identity</th>
                <th className="px-10 py-6 text-center">Active Projects</th>
                <th className="px-10 py-6 text-right">Lifetime Volume</th>
                <th className="px-10 py-6 text-right">Utility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f3f4] text-sm text-[#3c4043]">
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-32 text-center opacity-20">
                    <span className="text-[12px] font-bold uppercase tracking-[0.5em]">Partnership Ledger Empty</span>
                  </td>
                </tr>
              ) : (
                clients.map((c) => {
                  const stats = getClientStats(c.id);
                  return (
                    <tr key={c.id} className="hover:bg-green-50/20 transition-all group cursor-pointer" onClick={() => setSelectedClient(c)}>
                      <td className="px-10 py-8">
                        <div className="font-bold text-[#202124] uppercase tracking-tight text-xl leading-none group-hover:text-[#34A853] transition-colors">{c.name}</div>
                        <div className="text-[10px] text-[#5f6368] font-medium tracking-[0.1em] uppercase mt-2 opacity-60">{c.email}</div>
                      </td>
                      <td className="px-10 py-8 text-center">
                        <span className="px-4 py-2 bg-white border border-[#dadce0] rounded-xl text-[10px] font-semibold uppercase tracking-tight text-[#4285F4]">{stats.activeProjects} Campaigns</span>
                      </td>
                      <td className="px-10 py-8 text-right font-bold text-[#202124] text-xl tracking-tight tabular-nums">{formatSimple(c.totalBilled)}</td>
                      <td className="px-10 py-8 text-right" onClick={e => e.stopPropagation()}>
                         <div className="flex justify-end gap-4 items-center opacity-0 group-hover:opacity-100 transition-all">
                           <button onClick={() => onBillClient(c.id)} className="text-[#4285F4] font-bold text-[9px] uppercase tracking-widest hover:underline">Quick Bill</button>
                           <button onClick={() => onDeleteClient(c.id)} className="text-[#EA4335] font-bold text-[9px] uppercase hover:underline tracking-widest">Unlink</button>
                         </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedClient && (
        <div className="fixed inset-0 bg-[#202124]/90 backdrop-blur-xl z-[600] flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white rounded-[1.5rem] w-full max-w-2xl p-8 md:p-12 shadow-2xl relative border-t-8 border-[#4285F4] my-auto animate-in fade-in zoom-in duration-300">
            <button onClick={() => setSelectedClient(null)} className="absolute top-6 right-6 text-[#5f6368] hover:text-[#202124] p-2 transition-all">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
            </button>
            
            <div className="mb-10">
              <span className="text-[9px] font-semibold text-[#4285F4] uppercase tracking-[0.3em] block mb-2">Partner Profile</span>
              <h3 className="text-2xl md:text-4xl font-serif font-bold uppercase tracking-tight text-[#202124] leading-none">{selectedClient.name}</h3>
              <p className="text-[11px] font-medium text-[#5f6368] uppercase tracking-[0.1em] mt-3 opacity-60">{selectedClient.industry} Sector</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
               <div className="p-6 bg-[#f8f9fa] border border-[#dadce0] rounded-xl">
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-[#bdc1c6] mb-1">Lifetime Volume</p>
                  <p className="text-xl font-bold text-[#202124] tabular-nums">{formatSimple(selectedClient.totalBilled)}</p>
               </div>
               <div className="p-6 bg-[#f8f9fa] border border-[#dadce0] rounded-xl">
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-[#bdc1c6] mb-1">Live Projects</p>
                  <p className="text-xl font-bold text-[#4285F4] tabular-nums">{getClientStats(selectedClient.id).activeProjects}</p>
               </div>
               <div className="p-6 bg-[#fce8e6] border border-[#f5c2c7] rounded-xl">
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-[#EA4335] mb-1">Unpaid</p>
                  <p className="text-xl font-bold text-[#EA4335] tabular-nums">{getClientStats(selectedClient.id).unpaidInvoices}</p>
               </div>
            </div>

            <div className="flex gap-4 pt-8 border-t border-[#f1f3f4]">
               <button onClick={() => onBillClient(selectedClient.id)} className="flex-1 bg-[#4285F4] text-white py-4 rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] shadow-md hover:bg-[#1967d2] transition-all transform active:scale-95">Generate Invoice</button>
               <button onClick={() => setSelectedClient(null)} className="flex-1 bg-[#202124] text-white py-4 rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] shadow-md hover:bg-black transition-all">View Projects</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-[#202124]/90 backdrop-blur-xl z-[500] flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white rounded-[1.5rem] w-full max-w-lg p-8 md:p-12 shadow-2xl border-t-8 border-[#34A853] animate-in slide-in-from-bottom-10 my-auto relative">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-[#5f6368] hover:text-[#202124] p-2 hover:bg-slate-100 rounded-full transition-all">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
            </button>
            <div className="mb-10">
              <h3 className="text-2xl md:text-3xl font-serif font-bold uppercase tracking-tight text-[#202124]">Register Entity</h3>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5f6368] mt-2">New partnership link</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#5f6368]">Legal Identity</label>
                 <input required className="w-full p-4 bg-[#f8f9fa] border border-[#dadce0] focus:border-[#34A853] rounded-xl outline-none font-bold text-[11px] uppercase transition-all" placeholder="E.G. ACME CORP LTD." value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#5f6368]">Disbursement Email</label>
                 <input required type="email" className="w-full p-4 bg-[#f8f9fa] border border-[#dadce0] focus:border-[#34A853] rounded-xl outline-none font-medium text-[11px] transition-all" placeholder="finance@acme.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#5f6368]">Sector</label>
                 <input required className="w-full p-4 bg-[#f8f9fa] border border-[#dadce0] focus:border-[#34A853] rounded-xl outline-none font-bold text-[11px] uppercase transition-all" placeholder="E.G. FINTECH" value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} />
               </div>
               <div className="flex gap-4 pt-8 border-t border-[#f1f3f4]">
                 <button type="button" onClick={() => setShowModal(false)} className="px-6 py-4 font-bold text-[#5f6368] uppercase text-[10px] tracking-widest hover:bg-[#f1f3f4] rounded-xl transition-all">Cancel</button>
                 <button type="submit" className="flex-1 bg-[#34A853] text-white rounded-xl py-4 font-bold uppercase text-[10px] tracking-widest shadow-md hover:bg-[#2d9249] active:scale-95 transition-all">Register</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
