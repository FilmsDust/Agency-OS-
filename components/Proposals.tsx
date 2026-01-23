
import React, { useState } from 'react';
import { Proposal, ProposalSection } from '../types';
import { generateTemplateProposal } from '../services/geminiService';
import { jsPDF } from 'jspdf';

interface ProposalsProps {
  proposals: Proposal[];
  onAddProposal: (p: Proposal) => void;
}

const Proposals: React.FC<ProposalsProps> = ({ proposals, onAddProposal }) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeProposal, setActiveProposal] = useState<Proposal | null>(null);
  const [templateType, setTemplateType] = useState<'STARTER' | 'GROWTH' | 'ENTERPRISE'>('GROWTH');
  const [formData, setFormData] = useState({
    client: '',
    industry: '',
    project: '',
    duration: '',
    total: '',
    advance: '',
    scope: ''
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const aiSections = await generateTemplateProposal(formData.client, formData.industry, formData.project, formData.scope);
    
    const newProp: Proposal = {
      id: Math.random().toString(36).substr(2, 9),
      clientName: formData.client,
      clientIndustry: formData.industry,
      projectTitle: formData.project,
      duration: formData.duration || 'Flexible',
      templateType: templateType,
      sections: aiSections,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      quoteNo: `AG-QT-${Math.floor(Math.random() * 9000 + 1000)}`,
      totalAmount: parseFloat(formData.total) || 0,
      advanceAmount: parseFloat(formData.advance) || 0
    };
    
    onAddProposal(newProp);
    setLoading(false);
    setShowModal(false);
    setFormData({ client: '', industry: '', project: '', duration: '', total: '', advance: '', scope: '' });
  };

  const generatePDF = (prop: Proposal) => {
    const doc = new jsPDF();
    const gBlue = "#4285F4";
    doc.setFillColor(gBlue);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.text("ADVERTSGEN", 20, 25);
    doc.setFontSize(10);
    doc.text(`${prop.templateType} PACKAGE • ${prop.quoteNo}`, 20, 32);

    doc.setTextColor(32, 33, 36);
    doc.setFontSize(14);
    doc.text("PROJECT PROPOSAL", 20, 60);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Prepared for: ${prop.clientName}`, 20, 68);
    doc.text(`Date: ${prop.date}`, 20, 73);

    let y = 90;
    prop.sections.forEach(s => {
      doc.setFont("helvetica", "bold");
      doc.text(s.title.toUpperCase(), 20, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      const split = doc.splitTextToSize(s.content, 170);
      doc.text(split, 20, y);
      y += (split.length * 6) + 15;
      if (y > 270) { doc.addPage(); y = 20; }
    });

    doc.save(`${prop.quoteNo}_Proposal.pdf`);
  };

  const templates = [
    { type: 'STARTER', color: '#4285F4', desc: 'Basic Service Package' },
    { type: 'GROWTH', color: '#34A853', desc: 'Standard Strategic Growth' },
    { type: 'ENTERPRISE', color: '#FBBC05', desc: 'Full Scale Operations' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-xl border border-[#dadce0] google-shadow flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-3xl font-medium text-[#202124] tracking-tight uppercase">Proposal Studio</h2>
          <p className="text-[#5f6368] font-medium text-sm uppercase tracking-wider mt-1">Strategic Deal Crafting</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#202124] text-white px-8 py-4 rounded-lg font-medium shadow-md hover:bg-black transition-colors text-xs tracking-widest uppercase"
        >
          Draft Proposal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proposals.length === 0 ? (
          <div className="col-span-full py-20 text-center text-[#bdc1c6] font-medium uppercase tracking-widest">No Strategic Quotes Prepared</div>
        ) : (
          proposals.map(p => (
            <div key={p.id} className="bg-white p-8 rounded-xl border border-[#dadce0] hover:shadow-lg transition-all cursor-pointer group" onClick={() => setActiveProposal(p)}>
               <div className="flex justify-between items-start mb-6">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-xs ${
                    p.templateType === 'ENTERPRISE' ? 'bg-[#FBBC05]' : p.templateType === 'GROWTH' ? 'bg-[#34A853]' : 'bg-[#4285F4]'
                  }`}>
                    {p.templateType[0]}
                  </div>
                  <span className="text-[10px] font-medium text-[#bdc1c6] uppercase tracking-widest">{p.date}</span>
               </div>
               <h3 className="text-xl font-medium text-[#202124] uppercase tracking-tight leading-tight mb-1 group-hover:text-[#4285F4] transition-colors">{p.clientName}</h3>
               <p className="text-[11px] font-medium text-[#5f6368] uppercase tracking-wider mb-8">{p.projectTitle}</p>
               <div className="pt-6 border-t border-[#f1f3f4] flex justify-between items-center">
                  <p className="text-lg font-semibold text-[#202124]">RS {p.totalAmount.toLocaleString()}</p>
                  <div className="w-8 h-8 rounded-full border border-[#dadce0] flex items-center justify-center text-[#bdc1c6] group-hover:bg-[#4285F4] group-hover:text-white group-hover:border-[#4285F4] transition-all">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>

      {activeProposal && (
        <div className="fixed inset-0 bg-[#202124]/90 backdrop-blur-md z-[300] p-6 flex flex-col items-center overflow-y-auto">
           <div className="w-full max-w-4xl mb-8 flex justify-between items-center">
              <button onClick={() => setActiveProposal(null)} className="font-semibold text-white text-xs uppercase tracking-widest flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
                Back to List
              </button>
              <button onClick={() => generatePDF(activeProposal)} className="bg-[#4285F4] text-white px-8 py-3 rounded-lg font-semibold uppercase text-xs tracking-widest shadow-xl">Download PDF</button>
           </div>
           
           <div className="bg-white w-full max-w-4xl rounded-2xl p-16 shadow-2xl relative">
              <div className="absolute top-0 left-0 w-full h-4 bg-[#4285F4] rounded-t-2xl"></div>
              <div className="flex justify-between items-start mb-16">
                 <div>
                    <h1 className="text-4xl font-medium text-[#202124] tracking-tight uppercase leading-none">Strategic Proposal</h1>
                    <p className="text-sm font-medium text-[#4285F4] tracking-[0.2em] mt-4 uppercase">{activeProposal.quoteNo}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-semibold text-[#bdc1c6] uppercase tracking-widest mb-1">Issue Date</p>
                    <p className="text-sm font-medium text-[#202124]">{activeProposal.date}</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 pb-8 border-b border-[#f1f3f4]">
                <div>
                  <p className="text-[10px] font-semibold text-[#bdc1c6] uppercase tracking-widest mb-2">Client</p>
                  <p className="text-2xl font-medium text-[#202124] uppercase tracking-tight">{activeProposal.clientName}</p>
                  <p className="text-[10px] font-medium text-[#4285F4] uppercase tracking-widest mt-1">{activeProposal.clientIndustry}</p>
                </div>
                <div className="md:text-right">
                  <p className="text-[10px] font-semibold text-[#bdc1c6] uppercase tracking-widest mb-2">Duration</p>
                  <p className="text-2xl font-medium text-[#202124] uppercase tracking-tight">{activeProposal.duration}</p>
                </div>
              </div>

              <div className="space-y-12 mb-16">
                {activeProposal.sections.map((s, i) => (
                  <div key={i}>
                    <h4 className="text-[11px] font-semibold text-[#4285F4] uppercase tracking-widest mb-3">{s.title}</h4>
                    <p className="text-lg text-[#3c4043] font-normal leading-relaxed">{s.content}</p>
                  </div>
                ))}
              </div>

              <div className="bg-[#f8f9fa] rounded-xl p-8 border border-[#dadce0]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-semibold text-[#5f6368] uppercase">Project Total</span>
                  <span className="text-2xl font-semibold text-[#202124]">RS {activeProposal.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[#34A853]">
                  <span className="text-xs font-semibold uppercase">Advance (Immediate)</span>
                  <span className="text-xl font-semibold">RS {activeProposal.advanceAmount.toLocaleString()}</span>
                </div>
              </div>
           </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-[#202124]/70 backdrop-blur-sm z-[400] flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-10 shadow-2xl my-auto animate-in zoom-in duration-200 border-t-[12px] border-[#FBBC05]">
            <h3 className="text-2xl font-medium mb-8 tracking-tight uppercase text-[#202124]">Draft Strategy</h3>
            
            <form onSubmit={handleGenerate} className="space-y-6">
               <div className="flex gap-2 p-1 bg-[#f1f3f4] rounded-lg">
                 {templates.map(t => (
                   <button key={t.type} type="button" onClick={() => setTemplateType(t.type as any)} className={`flex-1 py-3 rounded-md font-semibold text-[10px] tracking-widest transition-all ${
                     templateType === t.type ? 'bg-white text-[#202124] shadow-sm' : 'text-[#5f6368] hover:text-[#202124]'
                   }`}>
                     {t.type}
                   </button>
                 ))}
               </div>

               <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-[#5f6368] uppercase tracking-widest">Client Name</label>
                  <input required className="w-full p-4 bg-[#f8f9fa] border border-[#dadce0] rounded-lg outline-none font-medium text-sm uppercase focus:ring-1 focus:ring-[#4285F4]" 
                    value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} />
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                      <label className="text-[11px] font-semibold text-[#5f6368] uppercase tracking-widest">Focus Theme</label>
                      <input required className="w-full p-4 bg-[#f8f9fa] border border-[#dadce0] rounded-lg font-medium text-sm uppercase" 
                        value={formData.project} onChange={e => setFormData({...formData, project: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                      <label className="text-[11px] font-semibold text-[#5f6368] uppercase tracking-widest">Timeline</label>
                      <input required className="w-full p-4 bg-[#f8f9fa] border border-[#dadce0] rounded-lg font-medium text-sm uppercase" 
                        value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                      <label className="text-[11px] font-semibold text-[#5f6368] uppercase tracking-widest">Total Value (RS)</label>
                      <input required type="number" className="w-full p-4 bg-[#f8f9fa] border border-[#dadce0] rounded-lg font-medium text-sm" 
                        value={formData.total} onChange={e => setFormData({...formData, total: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                      <label className="text-[11px] font-semibold text-[#5f6368] uppercase tracking-widest">Advance (RS)</label>
                      <input required type="number" className="w-full p-4 bg-[#f8f9fa] border border-[#dadce0] rounded-lg font-medium text-sm" 
                        value={formData.advance} onChange={e => setFormData({...formData, advance: e.target.value})} />
                  </div>
               </div>

               <div className="flex gap-4 pt-8">
                  <button type="button" onClick={() => setShowModal(false)} className="px-6 py-4 font-semibold text-[#5f6368] uppercase text-xs tracking-widest hover:bg-[#f1f3f4] rounded-lg transition-colors">Abort</button>
                  <button type="submit" disabled={loading} className="flex-1 bg-[#4285F4] text-white rounded-lg py-4 font-medium uppercase text-xs tracking-widest shadow-md flex items-center justify-center gap-3 hover:bg-[#1967d2] transition-colors">
                     {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div> : "Confirm & Build"}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Proposals;
