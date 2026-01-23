
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
    
    // Default strategic content based on template
    const defaultSections: ProposalSection[] = [
      { 
        title: 'PROJECT OBJECTIVE', 
        content: templateType === 'ENTERPRISE' 
          ? `High-scale strategic deployment for ${formData.project} aiming for market dominance.` 
          : `Dedicated growth strategy focused on ${formData.project} execution.`,
        type: 'SUMMARY'
      },
      {
        title: 'EXECUTION TIMELINE',
        content: `Standardized ${formData.duration} roadmap divided into strategic sprints.`,
        type: 'TIMELINE'
      },
      {
        title: 'TERMS & CONDITIONS',
        content: `Standard AdvertsGen service level agreement applies. Advance of ${formData.advance} required.`,
        type: 'TERMS'
      }
    ];

    const aiSections = await generateTemplateProposal(formData.client, formData.industry, formData.project, formData.scope);
    const finalSections = aiSections.length > 0 ? aiSections : defaultSections;
    
    const newProp: Proposal = {
      id: Math.random().toString(36).substr(2, 9),
      clientName: formData.client,
      clientIndustry: formData.industry,
      projectTitle: formData.project,
      duration: formData.duration || 'Not specified',
      templateType: templateType,
      sections: finalSections,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      quoteNo: `AG-QT-${Date.now().toString().slice(-4)}`,
      totalAmount: parseFloat(formData.total) || 0,
      advanceAmount: parseFloat(formData.advance) || 0
    };
    
    onAddProposal(newProp);
    setLoading(false);
    setShowModal(false);
    setFormData({ client: '', industry: '', project: '', duration: '', total: '', advance: '', scope: '' });
  };

  const generateProposalPDF = (prop: Proposal) => {
    const doc = new jsPDF();
    const googleBlue = "#2563eb";
    const margin = 20;

    doc.setFillColor(googleBlue);
    doc.rect(0, 0, 210, 20, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(googleBlue);
    doc.text("ADVERTSGEN", margin, 45);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`${prop.templateType} PROJECT PROPOSAL`, margin, 52);

    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`QUOTE: ${prop.quoteNo}`, 145, 45);
    doc.setFont("helvetica", "normal");
    doc.text(`DATE: ${prop.date}`, 145, 52);

    let y = 75;
    doc.setDrawColor(240);
    doc.line(margin, y, 190, y);
    y += 15;
    
    doc.setFont("helvetica", "bold");
    doc.text("CLIENT ENTITY", margin, y);
    doc.text("DURATION", 145, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.text(prop.clientName.toUpperCase(), margin, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(googleBlue);
    doc.text(prop.duration.toUpperCase(), 145, y);
    
    y += 20;
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("PROJECT FOCUS:", margin, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.text(prop.projectTitle.toUpperCase(), margin, y);

    y += 25;
    prop.sections.forEach(section => {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(50);
      doc.text(section.title.toUpperCase(), margin, y);
      y += 10;
      doc.setTextColor(100);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const splitText = doc.splitTextToSize(section.content, 170);
      doc.text(splitText, margin, y);
      y += (splitText.length * 6) + 15;
    });

    if (y > 230) { doc.addPage(); y = 30; }
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, y, 170, 50, 'F');
    y += 15;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text("TOTAL INVESTMENT:", margin + 10, y);
    doc.text(`RS ${prop.totalAmount.toLocaleString()}`, 145, y);
    y += 12;
    doc.setTextColor(googleBlue);
    doc.text("ADVANCE REQUIRED:", margin + 10, y);
    doc.text(`RS ${prop.advanceAmount.toLocaleString()}`, 145, y);
    y += 12;
    doc.setTextColor(239, 68, 68);
    doc.text("BALANCE ON DELIVERY:", margin + 10, y);
    doc.text(`RS ${(prop.totalAmount - prop.advanceAmount).toLocaleString()}`, 145, y);

    doc.setTextColor(180);
    doc.setFontSize(9);
    doc.text("ADVERTSGEN OPERATIONAL OS | GENERATED VIA SECURE PORTAL", 105, 285, { align: 'center' });

    doc.save(`${prop.quoteNo}_${prop.clientName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white p-10 rounded-[3rem] border-l-[16px] border-amber-400 shadow-xl gap-8">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">DEAL ENGINE</h2>
          <p className="text-slate-400 font-bold text-[12px] uppercase tracking-[0.4em] mt-2">INSTANT STRATEGIC PROPOSALS</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black shadow-2xl hover:scale-105 transition-all text-xs tracking-[0.2em] uppercase"
        >
          GENERATE PROPOSAL
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {proposals.length === 0 ? (
          <div className="col-span-full py-40 text-center text-slate-300 font-black uppercase tracking-[0.6em] text-sm">NO PROJECT QUOTES FOUND</div>
        ) : (
          proposals.map(p => (
            <div key={p.id} className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all border-t-8 border-amber-400 group cursor-pointer" onClick={() => setActiveProposal(p)}>
               <div className="flex justify-between items-center mb-8">
                  <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                    p.templateType === 'ENTERPRISE' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>{p.templateType}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.date}</span>
               </div>
               <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors leading-tight mb-2">{p.clientName}</h3>
               <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">{p.projectTitle}</p>
               <div className="pt-8 border-t border-slate-50 flex justify-between items-center">
                  <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">TOTAL VALUATION</p>
                    <p className="text-xl font-black text-slate-900 tracking-tighter">RS {p.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>

      {activeProposal && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-3xl z-[300] p-10 flex flex-col items-center overflow-y-auto">
           <div className="w-full max-w-5xl mb-12 flex justify-between items-center">
              <button onClick={() => setActiveProposal(null)} className="font-black text-white flex items-center gap-4 uppercase text-xs tracking-[0.3em] hover:text-blue-400 transition-colors">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                 CLOSE PREVIEW
              </button>
              <button onClick={() => generateProposalPDF(activeProposal)} className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] shadow-2xl hover:scale-105 transition-all">
                DOWNLOAD PDF VERSION
              </button>
           </div>
           
           <div className="bg-white w-full max-w-5xl rounded-[3rem] p-24 shadow-2xl border-t-[20px] border-blue-600">
              <div className="flex justify-between items-start mb-24">
                <div>
                   <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white font-black text-2xl mb-6 shadow-xl shadow-blue-600/30">AG</div>
                   <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">STRATEGIC<br/>PROPOSAL</h1>
                   <p className="text-sm font-black text-blue-600 tracking-[0.4em] mt-4 uppercase">{activeProposal.quoteNo}</p>
                </div>
                <div className="text-right">
                   <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest mb-2">ISSUANCE DATE</p>
                   <p className="text-lg font-black text-slate-900 uppercase">{activeProposal.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-16 mb-24 pb-12 border-b-4 border-slate-50">
                <div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">CLIENT ENTITY</p>
                  <p className="text-3xl font-black text-slate-900 uppercase tracking-tight">{activeProposal.clientName}</p>
                  <p className="text-[11px] font-black text-blue-500 uppercase tracking-widest mt-2">{activeProposal.clientIndustry}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">EXPECTED DURATION</p>
                  <p className="text-3xl font-black text-slate-900 uppercase tracking-tight">{activeProposal.duration}</p>
                  <p className="text-[11px] font-black text-amber-500 uppercase tracking-widest mt-2">{activeProposal.projectTitle}</p>
                </div>
              </div>

              <div className="space-y-20">
                {activeProposal.sections.map((s, idx) => (
                  <div key={idx} className="group">
                    <h4 className="text-[12px] font-black text-blue-600 uppercase tracking-[0.5em] mb-6 group-hover:translate-x-2 transition-transform">{s.title}</h4>
                    <p className="text-xl text-slate-700 font-bold leading-relaxed max-w-3xl">{s.content}</p>
                  </div>
                ))}
              </div>

              <div className="mt-24 bg-slate-900 rounded-[3rem] p-16 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-32 -mt-32"></div>
                <div className="flex justify-between items-center mb-10 text-slate-400">
                  <span className="text-[11px] font-black uppercase tracking-[0.4em]">TOTAL PROJECT FEE</span>
                  <span className="text-3xl font-black tracking-tighter text-white">RS {activeProposal.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-10 text-blue-400">
                  <span className="text-[11px] font-black uppercase tracking-[0.4em]">ADVANCE REQUIRED</span>
                  <span className="text-3xl font-black tracking-tighter">RS {activeProposal.advanceAmount.toLocaleString()}</span>
                </div>
                <div className="pt-10 border-t border-white/10 flex justify-between items-center text-red-400">
                  <span className="text-[11px] font-black uppercase tracking-[0.4em]">REMAINING BALANCE</span>
                  <span className="text-4xl font-black tracking-tighter">RS {(activeProposal.totalAmount - activeProposal.advanceAmount).toLocaleString()}</span>
                </div>
              </div>
           </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[400] flex items-center justify-center p-8 overflow-y-auto">
          <div className="bg-white rounded-[3.5rem] w-full max-w-2xl p-16 shadow-2xl my-auto animate-in zoom-in duration-300">
            <h3 className="text-3xl font-black mb-12 tracking-tighter uppercase text-slate-900 border-b-8 border-amber-400 inline-block pb-4">GENERATE DEAL</h3>
            
            <form onSubmit={handleGenerate} className="space-y-8">
               <div className="flex gap-4 p-2 bg-slate-100 rounded-3xl mb-8">
                 {(['STARTER', 'GROWTH', 'ENTERPRISE'] as const).map(type => (
                   <button key={type} type="button" onClick={() => setTemplateType(type)} className={`flex-1 py-4 rounded-2xl font-black text-[10px] tracking-widest transition-all ${
                     templateType === type ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'
                   }`}>
                     {type}
                   </button>
                 ))}
               </div>

               <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">CLIENT ENTITY NAME</label>
                  <input required className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-amber-400 rounded-2xl outline-none font-black text-sm uppercase transition-all" 
                    value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} />
               </div>

               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                      <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">PROJECT THEME</label>
                      <input required className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-amber-400 rounded-2xl outline-none font-black text-sm uppercase transition-all" 
                        value={formData.project} onChange={e => setFormData({...formData, project: e.target.value})} />
                  </div>
                  <div className="space-y-4">
                      <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">DURATION (E.G. 12 WEEKS)</label>
                      <input required className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-amber-400 rounded-2xl outline-none font-black text-sm uppercase transition-all" 
                        value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                      <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">TOTAL FEE RS</label>
                      <input required type="number" className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-amber-400 rounded-2xl outline-none font-black text-sm transition-all" 
                        value={formData.total} onChange={e => setFormData({...formData, total: e.target.value})} />
                  </div>
                  <div className="space-y-4">
                      <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">ADVANCE RS</label>
                      <input required type="number" className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-amber-400 rounded-2xl outline-none font-black text-sm transition-all" 
                        value={formData.advance} onChange={e => setFormData({...formData, advance: e.target.value})} />
                  </div>
               </div>

               <div className="flex gap-8 pt-10">
                  <button type="button" onClick={() => setShowModal(false)} className="px-10 py-6 font-black text-slate-400 uppercase text-xs tracking-widest hover:text-slate-900 transition-colors">ABANDON</button>
                  <button type="submit" disabled={loading} className="flex-1 bg-slate-900 text-white rounded-3xl py-6 font-black uppercase text-xs tracking-[0.2em] shadow-2xl flex items-center justify-center gap-4 hover:scale-105 transition-all">
                     {loading ? <div className="w-6 h-6 border-4 border-white border-t-transparent animate-spin rounded-full"></div> : "GENERATE STRATEGY"}
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
