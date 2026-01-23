
import React, { useState } from 'react';
import { Transaction, Invoice } from '../types';
import { getFinancialInsights } from '../services/geminiService';
import { jsPDF } from 'jspdf';

interface ReportsProps {
  transactions: Transaction[];
  invoices: Invoice[];
}

const Reports: React.FC<ReportsProps> = ({ transactions, invoices }) => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);

  const generateAudit = async () => {
    setLoading(true);
    const result = await getFinancialInsights(transactions, invoices);
    setInsight(result);
    setLoading(false);
  };

  const exportAuditPDF = () => {
    if (!insight) return;
    const doc = new jsPDF();
    const blue = "#4285F4";
    const margin = 20;

    doc.setFillColor(blue);
    doc.rect(0, 0, 210, 15, 'F');
    doc.setTextColor(blue);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("AdvertsGen Executive Audit", margin, 35);
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(`Strategic Financial Intelligence Report - ${new Date().toLocaleDateString()}`, margin, 42);

    doc.setFontSize(10);
    doc.setTextColor(50);
    const splitText = doc.splitTextToSize(insight, 170);
    doc.text(splitText, margin, 60);

    doc.save(`AG_Audit_Report_${Date.now()}.pdf`);
  };

  const formatPKR = (val: number) => `Rs. ${val.toLocaleString('en-PK')}`;

  return (
    <div className="space-y-10">
      <div className="bg-[#4285F4] rounded-3xl p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl relative z-10">
          <h2 className="text-4xl font-black mb-4 tracking-tighter">Senior Audit & Strategy</h2>
          <p className="text-blue-100 mb-8 font-medium leading-relaxed">Run a complete automated financial audit for AdvertsGen.</p>
          <button 
            disabled={loading}
            onClick={generateAudit}
            className={`px-10 py-4 bg-white text-[#4285F4] rounded-2xl font-black shadow-xl flex items-center space-x-3 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
          >
            {loading ? <div className="w-5 h-5 border-4 border-[#4285F4] border-t-transparent animate-spin rounded-full"></div> : null}
            <span className="uppercase text-xs tracking-widest">{loading ? 'Running Audit Logic...' : 'Initiate Full Audit'}</span>
          </button>
        </div>
      </div>

      {insight && (
        <div className="bg-white p-12 rounded-[2.5rem] border-l-8 border-[#34A853] shadow-sm animate-in zoom-in duration-300">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center space-x-4 text-[#34A853]">
               <div className="w-10 h-10 bg-[#34A853]/10 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
               </div>
               <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Audit Findings</h3>
            </div>
            <button onClick={exportAuditPDF} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
               Download Report PDF
            </button>
          </div>
          <div className="prose max-w-none text-slate-700 leading-loose whitespace-pre-wrap font-medium">{insight}</div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[2rem] border-t-8 border-[#FBBC05] shadow-sm">
          <h4 className="font-black text-slate-900 mb-8 text-xs uppercase tracking-widest">Balance Sheet Audit</h4>
          <div className="space-y-4">
            {[
              { label: 'Operating Assets', value: 1250400, color: 'text-slate-600' },
              { label: 'Equity Value', value: 1550400, color: 'text-[#34A853]', bold: true },
            ].map((row, i) => (
              <div key={i} className={`flex justify-between p-4 rounded-2xl ${row.bold ? 'bg-slate-50 border border-slate-100' : ''}`}>
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">{row.label}</span>
                <span className={`text-sm font-black ${row.color}`}>{formatPKR(Math.abs(row.value))}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
