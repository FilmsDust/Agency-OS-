
import React, { useState } from 'react';
import { Proposal, ProposalSection } from '../types';
import { generateTemplateProposal } from '../services/geminiService';
import { jsPDF } from 'jspdf';

// Define the available proposal templates
const templates = [
  { type: 'STARTER' },
  { type: 'GROWTH' },
  { type: 'ENTERPRISE' },
];

interface ProposalsProps {
  proposals: Proposal[];
  onAddProposal: (p: Proposal) => void;
  onDeleteProposal: (id: string) => void;
  onConvertToInvoice: (p: Proposal) => void;
}

const Proposals: React.FC<ProposalsProps> = ({ proposals, onAddProposal, onDeleteProposal, onConvertToInvoice }) => {
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
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      quoteNo: `${Math.floor(Math.random() * 9000 + 1000)}`,
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
    const yellow = "#FBBC05";
    const lightGray = "#f8f9fa";
    const dark = "#202124";

    // PAGE 1: COVER
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, 'F');

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    // Fix: Pass RGB values for grayscale to avoid TS errors with single number argument
    doc.setTextColor(150, 150, 150);
    doc.text(`DATE: ${prop.date}`, 190, 20, { align: 'right' });

    // Fix: Pass RGB values for grayscale to avoid TS errors with single number argument
    doc.setFillColor(200, 200, 200);
    doc.rect(20, 50, 1.5, 30, 'F');

    doc.setTextColor(dark);
    doc.setFontSize(42);
    doc.setFont("helvetica", "bold");
    doc.text("QUOTATION", 28, 72);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    // Fix: Pass RGB values for grayscale to avoid TS errors with single number argument
    doc.setTextColor(120, 120, 120);
    doc.text(prop.projectTitle.toUpperCase(), 28, 80);

    doc.setFillColor(lightGray);
    doc.rect(20, 240, 170, 30, 'F');
    // Fix: Pass RGB values for grayscale to avoid TS errors with single number argument
    doc.setTextColor(150, 150, 150);
    doc.text(`REFERENCE ID: ${prop.quoteNo}`, 30, 257);

    // PAGE 2: DETAILS
    doc.addPage();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, 'F');

    doc.setTextColor(dark);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("ADVERTSGEN AGENCY PVT LTD.", 20, 30);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    // Fix: Pass RGB values for grayscale to avoid TS errors with single number argument
    doc.setTextColor(150, 150, 150);
    doc.text("EMPIRE PLAZA, SERVICE ROAD, GOLRA MOR, H-13, ISLAMABAD", 20, 36);
    
    doc.setFontSize(8);
    // Fix: Pass RGB values for grayscale to avoid TS errors with single number argument
    doc.setTextColor(150, 150, 150);
    doc.text("PRESENTED TO", 140, 30);
    doc.setTextColor(dark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(prop.clientName.toUpperCase(), 140, 38);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`DATE: ${prop.date}`, 140, 44);

    doc.setFillColor(yellow);
    doc.rect(20, 60, 1, 20, 'F');
    
    doc.setFontSize(9);
    doc.setTextColor(dark);
    const intro = "Concerning the subject requirement, we feel the pleasure of submitting our quotation for the requested project. Detailed scope and assessment follows.";
    const splitIntro = doc.splitTextToSize(intro, 150);
    doc.text(splitIntro, 28, 68);

    let y = 100;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("PROPOSAL SCOPE", 20, y);
    y += 10;

    prop.sections.forEach(sec => {
      doc.setFillColor(lightGray);
      doc.rect(20, y, 170, 25, 'F');
      doc.setTextColor(dark);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(sec.title.toUpperCase(), 25, y + 10);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      const content = doc.splitTextToSize(sec.content, 110);
      doc.text(content, 70, y + 10);
      y += 28;
      if (y > 270) { doc.addPage(); y = 20; }
    });

    // PAGE 3: PRICING
    doc.addPage();
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE SUMMARY", 20, 30);
    
    doc.setDrawColor(240);
    doc.line(20, 45, 190, 45);
    doc.text("TOTAL PROJECT PRICE", 25, 55);
    doc.setTextColor(yellow);
    doc.text(`PKR ${prop.totalAmount.toLocaleString()}/-`, 185, 55, { align: 'right' });
    
    doc.setTextColor(dark);
    doc.line(20, 65, 190, 65);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    // Fix: Pass RGB values for grayscale to avoid TS errors with single number argument
    doc.setTextColor(150, 150, 150);
    doc.text("EXCLUSIVE OF GOVT TAXES", 25, 75);
    doc.text("-", 185, 75, { align: 'right' });
    
    doc.line(20, 85, 190, 85);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("GRAND SETTLEMENT TOTAL", 25, 95);
    doc.text(`PKR ${prop.totalAmount.toLocaleString()}/-`, 185, 95, { align: 'right' });
    doc.line(20, 105, 190, 105);

    doc.save(`AG_QUOTE_${prop.quoteNo}.pdf`);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
           <div className="w-1.5 h-16 bg-[#FBBC05]"></div>
           <div>
             <h1 className="text-4xl font-serif font-black tracking-tighter uppercase text-[#202124]">Strategic</h1>
             <p className="text-[10px] font-bold text-[#5f6368] uppercase tracking-[0.4em] mt-1">Operational OS / Quotes</p>
           </div>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="w-full md:w-auto bg-[#FBBC05] text-[#202124] px-10 py-5 rounded-sm font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-[#e0a800] transition-all transform active:scale-95"
        >
          Draft Proposal
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {proposals.length === 0 ? (
          <div className="col-span-full py-32 text-center text-[#bdc1c6] font-bold uppercase tracking-[0.5em] text-xs">No Strategic Quotes Prepared</div>
        ) : (
          proposals.map(p => (
            <div key={p.id} className="bg-white p-8 md:p-10 border border-[#dadce0] hover:shadow-2xl transition-all cursor-pointer group relative shadow-sm" onClick={() => setActiveProposal(p)}>
               <div className="absolute top-4 right-4 flex gap-2">
                 <button 
                   onClick={(e) => { e.stopPropagation(); onConvertToInvoice(p); }}
                   className="opacity-0 group-hover:opacity-100 transition-opacity bg-green-50 text-green-600 p-2 rounded-full hover:bg-green-100"
                   title="Convert to Invoice"
                 >
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
                 </button>
                 <button 
                   onClick={(e) => { e.stopPropagation(); onDeleteProposal(p.id); }}
                   className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-red-500 hover:bg-red-50 rounded-full"
                   title="Delete Proposal"
                 >
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                 </button>
               </div>
               <div className="flex justify-between items-start mb-8">
                  <div className={`w-10 h-10 flex items-center justify-center text-white font-black text-xs ${
                    p.templateType === 'ENTERPRISE' ? 'bg-[#FBBC05]' : p.templateType === 'GROWTH' ? 'bg-[#34A853]' : 'bg-[#4285F4]'
                  }`}>
                    {p.templateType[0]}
                  </div>
                  <span className="text-[9px] font-bold text-[#bdc1c6] uppercase tracking-widest">{p.date}</span>
               </div>
               <h3 className="text-2xl font-serif font-black text-[#202124] uppercase tracking-tighter leading-none mb-3 group-hover:text-[#FBBC05] transition-colors">{p.clientName}</h3>
               <p className="text-[10px] font-bold text-[#5f6368] uppercase tracking-widest mb-10">{p.projectTitle}</p>
               <div className="pt-8 border-t border-[#f1f3f4] flex justify-between items-center">
                  <p className="text-xl font-black text-[#202124] tabular-nums">{p.totalAmount.toLocaleString()}</p>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#bdc1c6] group-hover:text-[#FBBC05]">View File →</div>
               </div>
            </div>
          ))
        )}
      </div>

      {activeProposal && (
        <div className="fixed inset-0 bg-[#202124]/95 backdrop-blur-lg z-[300] p-4 md:p-10 flex flex-col items-center overflow-y-auto">
           <div className="w-full max-w-5xl mb-10 flex justify-between items-center px-4">
              <button onClick={() => setActiveProposal(null)} className="font-bold text-white text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full hover:bg-white/20 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
                Close View
              </button>
              <div className="flex gap-4">
                <button onClick={() => onConvertToInvoice(activeProposal)} className="bg-green-600 text-white px-8 py-4 rounded-sm font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-green-700 transition-all">Convert to Invoice</button>
                <button onClick={() => generatePDF(activeProposal)} className="bg-[#FBBC05] text-[#202124] px-10 py-4 rounded-sm font-black uppercase text-[10px] tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">Download PDF</button>
              </div>
           </div>
           
           <div className="bg-white w-full max-w-4xl p-10 md:p-24 shadow-2xl relative mb-20 min-h-screen">
              <div className="text-right text-[10px] font-bold text-[#bdc1c6] uppercase mb-16">
                Date: {activeProposal.date}
              </div>

              <div className="flex items-center gap-10 mb-24">
                <div className="w-3 h-24 bg-[#bdc1c6]"></div>
                <div>
                  <h1 className="text-7xl font-serif font-black text-[#202124] tracking-tighter uppercase leading-none">Quotation</h1>
                  <p className="text-lg font-medium text-[#5f6368] uppercase tracking-[0.3em] mt-2">{activeProposal.projectTitle}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-24 pb-12 border-b border-[#f1f3f4]">
                <div>
                  <p className="text-[10px] font-black text-[#bdc1c6] uppercase tracking-widest mb-4">Presented To</p>
                  <p className="text-3xl font-serif font-black text-[#202124] uppercase tracking-tighter">{activeProposal.clientName}</p>
                  <p className="text-[10px] font-bold text-[#FBBC05] uppercase tracking-widest mt-2">{activeProposal.clientIndustry}</p>
                </div>
                <div className="md:text-right">
                  <p className="text-[10px] font-black text-[#bdc1c6] uppercase tracking-widest mb-4">Project Window</p>
                  <p className="text-3xl font-serif font-black text-[#202124] uppercase tracking-tighter">{activeProposal.duration}</p>
                </div>
              </div>

              <div className="space-y-16 mb-24">
                {activeProposal.sections.map((s, i) => (
                  <div key={i} className="flex flex-col md:flex-row gap-10">
                    <div className="md:w-1/3">
                      <h4 className="text-[11px] font-black text-[#FBBC05] uppercase tracking-widest">{s.title}</h4>
                    </div>
                    <div className="md:w-2/3">
                      <p className="text-lg text-[#3c4043] font-light leading-relaxed">{s.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="absolute bottom-0 left-0 w-full h-[150px] bg-[#f8f9fa] border-t border-[#dadce0] flex items-center justify-between px-16">
                 <div className="transform -rotate-90 text-[10px] font-black text-[#bdc1c6] uppercase tracking-[0.5em] origin-left whitespace-nowrap">
                   Quote No: {activeProposal.quoteNo}
                 </div>
                 <div className="text-right">
                   <p className="text-[10px] font-black text-[#5f6368] uppercase tracking-widest mb-2">Grand Total Payable</p>
                   <p className="text-5xl font-serif font-black text-[#202124] tracking-tighter tabular-nums">PKR {activeProposal.totalAmount.toLocaleString()}/-</p>
                 </div>
              </div>
           </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-[#202124]/95 backdrop-blur-md z-[400] flex items-center justify-center p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl p-10 md:p-16 shadow-2xl my-auto relative border-t-[16px] border-[#FBBC05]">
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-[#5f6368] hover:text-[#202124] p-2 hover:bg-slate-100 rounded-full transition-all">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
            </button>
            <div className="mb-12">
              <h3 className="text-4xl font-serif font-black tracking-tighter uppercase text-[#202124]">Draft Proposal</h3>
              <p className="text-[10px] font-bold text-[#5f6368] uppercase tracking-[0.4em] mt-2">New Strategic Asset</p>
            </div>
            
            <form onSubmit={handleGenerate} className="space-y-8">
               <div className="flex gap-2 p-1 bg-[#f1f3f4] rounded-sm overflow-x-auto no-scrollbar">
                 {templates.map(t => (
                   <button key={t.type} type="button" onClick={() => setTemplateType(t.type as any)} className={`flex-1 min-w-[80px] py-4 rounded-sm font-black text-[10px] tracking-widest transition-all ${
                     templateType === t.type ? 'bg-white text-[#202124] shadow-md' : 'text-[#5f6368] hover:text-[#202124]'
                   }`}>
                     {t.type}
                   </button>
                 ))}
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black text-[#5f6368] uppercase tracking-widest">Client Identity</label>
                  <input required className="w-full p-5 bg-white border-2 border-[#dadce0] font-bold text-sm uppercase outline-none focus:border-[#FBBC05] transition-all" 
                    placeholder="E.G. ASTRA CONSULTING LTD."
                    value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                      <label className="text-[10px] font-black text-[#5f6368] uppercase tracking-widest">Project Narrative</label>
                      <input required className="w-full p-5 bg-white border-2 border-[#dadce0] font-bold text-sm uppercase outline-none focus:border-[#FBBC05] transition-all" 
                        placeholder="E.G. Q4 SOCIAL CAMPAIGN"
                        value={formData.project} onChange={e => setFormData({...formData, project: e.target.value})} />
                  </div>
                  <div className="space-y-3">
                      <label className="text-[10px] font-black text-[#5f6368] uppercase tracking-widest">Timeline</label>
                      <input required className="w-full p-5 bg-white border-2 border-[#dadce0] font-bold text-sm uppercase outline-none focus:border-[#FBBC05] transition-all" 
                        placeholder="E.G. 6 MONTHS RETAINER"
                        value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                      <label className="text-[10px] font-black text-[#5f6368] uppercase tracking-widest">Gross Value (PKR)</label>
                      <input required type="number" className="w-full p-5 bg-white border-2 border-[#dadce0] font-bold text-sm outline-none focus:border-[#FBBC05] transition-all" 
                        placeholder="E.G. 1500000"
                        value={formData.total} onChange={e => setFormData({...formData, total: e.target.value})} />
                  </div>
                  <div className="space-y-3">
                      <label className="text-[10px] font-black text-[#5f6368] uppercase tracking-widest">Mobilization (RS)</label>
                      <input required type="number" className="w-full p-5 bg-white border-2 border-[#dadce0] font-bold text-sm outline-none focus:border-[#FBBC05] transition-all" 
                        placeholder="E.G. 500000"
                        value={formData.advance} onChange={e => setFormData({...formData, advance: e.target.value})} />
                  </div>
               </div>

               <div className="flex flex-col-reverse sm:flex-row gap-6 pt-10 border-t border-[#f1f3f4]">
                  <button type="button" onClick={() => setShowModal(false)} className="px-10 py-5 font-black text-[#5f6368] uppercase text-xs tracking-widest hover:bg-[#f1f3f4]">Discard</button>
                  <button type="submit" disabled={loading} className="flex-1 bg-[#202124] text-white py-5 font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-black active:scale-95 transition-all">
                     {loading ? "Synthesizing..." : "Confirm & Build"}
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
