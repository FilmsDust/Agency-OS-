
import React, { useState } from 'react';
import { Lead, Client } from '../types';

interface CRMViewProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  onConvertToClient: (c: Client) => void;
}

const CRMView: React.FC<CRMViewProps> = ({ leads, setLeads, onConvertToClient }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ company: '', contact: '', value: '', status: 'NEW' as any });

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    const newLead: Lead = {
      id: Math.random().toString(36).substr(2, 9),
      companyName: formData.company,
      contactName: formData.contact,
      value: parseFloat(formData.value) || 0,
      status: formData.status,
      source: 'Direct Entry',
      dateAdded: new Date().toLocaleDateString('en-GB')
    };
    setLeads([newLead, ...leads]);
    setShowModal(false);
    setFormData({ company: '', contact: '', value: '', status: 'NEW' });
  };

  const updateLeadStatus = (id: string, status: Lead['status']) => {
    setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
  };

  const convertToClient = (lead: Lead) => {
    const client: Client = {
      id: lead.id,
      name: lead.companyName,
      email: `${lead.contactName.toLowerCase().replace(' ', '.')}@${lead.companyName.toLowerCase().replace(' ', '')}.com`,
      industry: 'Unknown',
      totalBilled: 0,
      status: 'ACTIVE'
    };
    onConvertToClient(client);
    setLeads(leads.filter(l => l.id !== lead.id));
    alert("LEAD CONVERTED TO PARTNER ACCOUNT");
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="bg-white p-10 rounded-3xl border border-[#dadce0] shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
           <h2 className="text-4xl font-serif font-black text-[#202124] uppercase tracking-tighter leading-none">Pipeline</h2>
           <p className="text-[#4285F4] font-bold text-xs uppercase tracking-[0.4em] mt-3">Sales Funnel & Prospecting</p>
        </div>
        <button onClick={() => setShowModal(true)} className="w-full md:w-auto bg-[#202124] text-white px-10 py-5 rounded-xl font-bold uppercase text-xs tracking-widest shadow-xl hover:bg-black transition-all">New Opportunity</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {['NEW', 'CONTACTED', 'NEGOTIATION'].map(stage => (
          <div key={stage} className="space-y-6">
            <h4 className="text-[11px] font-black text-[#4285F4] uppercase tracking-[0.5em] mb-4 text-center">{stage}</h4>
            <div className="space-y-6">
              {leads.filter(l => l.status === stage).length === 0 ? (
                <div className="p-10 border border-dashed border-[#dadce0] rounded-3xl text-center text-[#bdc1c6] font-bold text-[9px] uppercase tracking-widest">Stage Empty</div>
              ) : (
                leads.filter(l => l.status === stage).map(lead => (
                  <div key={lead.id} className="bg-white p-8 rounded-3xl border border-[#dadce0] shadow-sm hover:border-[#4285F4] transition-all group">
                    <h5 className="text-2xl font-serif font-black text-[#202124] uppercase tracking-tighter leading-none mb-2">{lead.companyName}</h5>
                    <p className="text-[10px] font-bold text-[#5f6368] uppercase tracking-widest mb-6">{lead.contactName}</p>
                    <div className="flex justify-between items-end border-t border-[#f1f3f4] pt-6">
                       <div>
                         <p className="text-[9px] font-bold text-[#bdc1c6] uppercase tracking-widest">Est. Value</p>
                         <p className="text-xl font-black text-[#202124] tabular-nums">PKR {lead.value.toLocaleString()}</p>
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => updateLeadStatus(lead.id, 'NEGOTIATION')} className="p-3 bg-slate-50 text-[#4285F4] rounded-lg hover:bg-blue-50">
                             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
                          </button>
                          <button onClick={() => convertToClient(lead)} className="p-3 bg-green-50 text-[#34A853] rounded-lg hover:bg-green-100 font-black text-[8px] uppercase tracking-widest">Won</button>
                       </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#202124]/90 backdrop-blur-xl z-[500] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg p-12 rounded-[2.5rem] shadow-2xl border-t-[16px] border-[#4285F4] animate-in zoom-in duration-300">
             <h3 className="text-4xl font-serif font-black text-[#202124] uppercase tracking-tighter mb-10">New Opportunity</h3>
             <form onSubmit={handleAddLead} className="space-y-8">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-[#5f6368] uppercase tracking-widest">Company Identity</label>
                   <input required className="w-full p-5 bg-[#f8f9fa] border-2 border-[#dadce0] font-black text-sm uppercase outline-none focus:border-[#4285F4] rounded-2xl transition-all" placeholder="LEGAL NAME" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-[#5f6368] uppercase tracking-widest">Primary Contact</label>
                   <input required className="w-full p-5 bg-[#f8f9fa] border-2 border-[#dadce0] font-black text-sm uppercase outline-none focus:border-[#4285F4] rounded-2xl transition-all" placeholder="FULL NAME" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-[#5f6368] uppercase tracking-widest">Deal Quantum (PKR)</label>
                   <input required type="number" className="w-full p-5 bg-[#f8f9fa] border-2 border-[#dadce0] font-black text-sm outline-none focus:border-[#4285F4] rounded-2xl transition-all" placeholder="0" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} />
                </div>
                <div className="flex gap-4 pt-8">
                   <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-5 font-black text-[#5f6368] uppercase text-xs tracking-widest hover:bg-[#f8f9fa] rounded-xl transition-all">Discard</button>
                   <button type="submit" className="flex-1 bg-[#202124] text-white py-5 font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-black rounded-xl transition-all">Establish Lead</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMView;
