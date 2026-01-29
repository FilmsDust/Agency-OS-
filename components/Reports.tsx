
import React, { useState, useMemo } from 'react';
import { Transaction, Invoice, Staff, TransactionType, InvoiceStatus } from '../types';
import { getFinancialInsights } from '../services/geminiService';
import { jsPDF } from 'jspdf';

interface ReportsProps {
  transactions: Transaction[];
  invoices: Invoice[];
  staff: Staff[];
}

const Reports: React.FC<ReportsProps> = ({ transactions, invoices, staff }) => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'FAVOURITE' | 'ALL'>('ALL');

  const reportCategories = [
    { title: 'Sales', items: ['Sales Order Summary', 'Client Contribution Report', 'Overdue Receivables'], color: 'text-[#4285F4]' },
    { title: 'Purchase', items: ['Vendor Purchase Records', 'Utility Expense Audit', 'Recurring Vendor Costs'], color: 'text-[#FBBC05]' },
    { title: 'Inventory Report', items: ['Service Catalog Usage', 'Project Allocation Ratios'], color: 'text-[#34A853]' },
    { title: 'Profit & Loss', items: ['Net Revenue Audit', 'Cash Burn Summary', 'EBITDA Insight'], color: 'text-[#EA4335]' },
    { title: 'Tax', items: ['GST Liability Summary', 'Withholding Audit'], color: 'text-[#5f6368]' },
    { title: 'Other', items: ['Team Payroll Analysis', 'AI Support History'], color: 'text-[#bdc1c6]' },
  ];

  const financials = useMemo(() => {
    const cashOnHand = transactions.reduce((acc, t) => t.type === TransactionType.INCOME ? acc + t.amount : acc - t.amount, 0);
    const receivables = invoices.filter(i => i.status !== InvoiceStatus.PAID).reduce((acc, i) => acc + i.total, 0);
    const equity = cashOnHand + receivables;
    return { cashOnHand, receivables, equity };
  }, [transactions, invoices]);

  const runAudit = async () => {
    setLoading(true);
    const result = await getFinancialInsights(transactions, invoices);
    setInsight(result);
    setLoading(false);
  };

  const formatPKR = (val: number) => `Rs. ${val.toLocaleString('en-PK')}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex border-b border-[#dadce0] gap-10">
        <button onClick={() => setActiveTab('FAVOURITE')} className={`pb-4 px-2 font-bold text-[11px] uppercase tracking-widest transition-all ${activeTab === 'FAVOURITE' ? 'border-b-4 border-[#4285F4] text-[#4285F4]' : 'text-[#bdc1c6]'}`}>Favourite</button>
        <button onClick={() => setActiveTab('ALL')} className={`pb-4 px-2 font-bold text-[11px] uppercase tracking-widest transition-all ${activeTab === 'ALL' ? 'border-b-4 border-[#4285F4] text-[#4285F4]' : 'text-[#bdc1c6]'}`}>All Reports</button>
      </div>

      {activeTab === 'ALL' && (
        <div className="space-y-4">
          {reportCategories.map((cat, i) => (
            <div key={i} className="bg-white rounded-xl border border-[#dadce0] overflow-hidden hover:shadow-md transition-all group">
              <button className="w-full flex justify-between items-center p-6 text-left focus:bg-[#f8f9fa]">
                <div className="flex items-center gap-4">
                  <div className={`w-1 h-6 rounded-full ${cat.color.replace('text', 'bg')}`}></div>
                  <span className="font-bold text-sm text-[#202124] uppercase tracking-tight">{cat.title}</span>
                </div>
                <svg className="w-5 h-5 text-[#bdc1c6] group-hover:text-[#4285F4] transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>
              </button>
              <div className="px-10 pb-6 space-y-3 opacity-0 group-hover:opacity-100 hidden group-hover:block animate-in slide-in-from-top-2">
                {cat.items.map((item, j) => (
                  <div key={j} className="flex items-center justify-between py-2 border-b border-[#f1f3f4] last:border-0 cursor-pointer hover:text-[#4285F4]">
                    <span className="text-[11px] font-medium text-[#5f6368] uppercase tracking-wider">{item}</span>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'FAVOURITE' && (
        <div className="bg-white p-20 rounded-3xl border border-dashed border-[#dadce0] flex flex-col items-center justify-center text-center opacity-50">
          <svg className="w-16 h-16 text-[#bdc1c6] mb-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#5f6368]">No reports favorited yet</p>
        </div>
      )}

      <div className="bg-[#4285F4]/5 p-10 rounded-3xl border border-[#4285F4]/20 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="max-w-xl">
           <h3 className="text-xl font-bold uppercase text-[#202124] tracking-tight mb-2">Synthetic Audit Insights</h3>
           <p className="text-xs text-[#5f6368] leading-relaxed">Let AdvertsGen AI analyze your general ledger and invoice stream to find hidden operational opportunities.</p>
        </div>
        <button onClick={runAudit} disabled={loading} className="bg-[#4285F4] text-white px-10 py-5 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-[#1967d2] transition-all active:scale-95 disabled:opacity-50">
          {loading ? 'Synthesizing...' : 'Run Analysis'}
        </button>
      </div>

      {insight && (
        <div className="bg-white p-10 rounded-2xl border border-[#34A853] shadow-lg animate-in zoom-in duration-300">
           <h4 className="text-[10px] font-black uppercase tracking-widest text-[#34A853] mb-6">AI Strategic Findings</h4>
           <div className="text-sm text-[#3c4043] leading-relaxed whitespace-pre-wrap font-medium">{insight}</div>
        </div>
      )}
    </div>
  );
};

export default Reports;
