
import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { jsPDF } from 'jspdf';

interface TransactionsProps {
  transactions: Transaction[];
  onAddTransaction: (t: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

const Transactions: React.FC<TransactionsProps> = ({ transactions, onAddTransaction, onDeleteTransaction }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ description: '', amount: '', category: 'OFFICE' as any, type: TransactionType.EXPENSE });

  const exportLedgerPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(251, 188, 5); // Google Yellow
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(32, 33, 36);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("GENERAL LEDGER AUDIT", 20, 25);
    
    doc.setFontSize(10);
    let y = 60;
    doc.text("Date", 20, y);
    doc.text("Description", 50, y);
    doc.text("Category", 120, y);
    doc.text("Amount (PKR)", 160, y);
    y += 10;
    
    doc.setFont("helvetica", "normal");
    transactions.forEach(t => {
      doc.text(t.date, 20, y);
      doc.text(t.description.substring(0, 30), 50, y);
      doc.text(t.category, 120, y);
      const prefix = t.type === TransactionType.INCOME ? "+" : "-";
      doc.text(`${prefix} ${t.amount.toLocaleString()}`, 160, y);
      y += 10;
      if (y > 280) { doc.addPage(); y = 20; }
    });
    doc.save("AdvertsGen_General_Ledger.pdf");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTransaction({
      id: Math.random().toString(36).substr(2, 9),
      description: formData.description,
      amount: parseFloat(formData.amount) || 0,
      type: formData.type,
      date: new Date().toLocaleDateString('en-GB'),
      category: formData.category
    });
    setShowModal(false);
    setFormData({ description: '', amount: '', category: 'OFFICE' as any, type: TransactionType.EXPENSE });
  };

  const formatSimple = (val: number) => `RS ${val.toLocaleString()}`;

  return (
    <div className="space-y-6 md:space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white p-6 md:p-10 rounded-[1.5rem] md:rounded-[2rem] border-l-[8px] md:border-l-[12px] border-[#FBBC05] shadow-sm gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-4xl font-medium text-[#202124] tracking-tighter uppercase leading-none">Financial Ledger</h2>
          <p className="text-[#5f6368] font-medium text-[10px] md:text-sm uppercase tracking-widest mt-2">Source-of-truth Transaction History</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
           <button 
             onClick={exportLedgerPDF}
             className="flex-1 bg-white border-2 border-[#FBBC05] text-[#202124] px-6 py-3 md:py-4 rounded-xl font-medium text-xs tracking-widest uppercase hover:bg-[#fef7e0]"
           >
             Export Ledger
           </button>
           <button 
             onClick={() => setShowModal(true)} 
             className="flex-1 bg-[#202124] text-white px-8 py-3 md:py-4 rounded-xl font-medium shadow-lg hover:bg-black transition-all text-xs tracking-widest uppercase"
           >
             Post Entry
           </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#dadce0] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[500px]">
            <thead className="bg-[#f8f9fa] border-b border-[#dadce0] text-[#5f6368] font-semibold uppercase tracking-[0.2em] text-[10px]">
              <tr>
                <th className="px-6 py-4 md:px-10 md:py-6">Timeline / Detail</th>
                <th className="px-6 py-4 md:px-10 md:py-6">Classification</th>
                <th className="px-6 py-4 md:px-10 md:py-6 text-right">Volume</th>
                <th className="px-6 py-4 md:px-10 md:py-6 text-right">Tools</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dadce0] text-sm text-[#3c4043]">
              {transactions.length === 0 ? (
                <tr><td colSpan={4} className="p-32 text-center text-[#bdc1c6] font-medium uppercase tracking-[0.4em] text-xs">No ledger entries recorded</td></tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-[#fef7e0]/50 transition-colors group">
                    <td className="px-6 py-5 md:px-10 md:py-8">
                      <div className="font-semibold text-[#202124] uppercase tracking-tight text-sm md:text-lg leading-none">{t.description}</div>
                      <div className="text-[9px] md:text-[10px] text-[#5f6368] font-medium tracking-widest uppercase mt-2">{t.date}</div>
                    </td>
                    <td className="px-6 py-5 md:px-10 md:py-8">
                      <span className="px-3 py-1.5 md:px-4 md:py-2 bg-[#f1f3f4] rounded-lg text-[9px] md:text-[10px] font-semibold uppercase tracking-widest text-[#5f6368]">{t.category}</span>
                    </td>
                    <td className={`px-6 py-5 md:px-10 md:py-8 text-right font-semibold text-sm md:text-xl tracking-tight ${t.type === TransactionType.INCOME ? 'text-[#34A853]' : 'text-[#EA4335]'}`}>
                      {t.type === TransactionType.EXPENSE ? '-' : '+'}{formatSimple(t.amount)}
                    </td>
                    <td className="px-6 py-5 md:px-10 md:py-8 text-right">
                       <button onClick={() => onDeleteTransaction(t.id)} className="text-[#EA4335] opacity-0 group-hover:opacity-100 transition-opacity hover:underline font-bold text-[10px] uppercase">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#202124]/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-xl p-6 md:p-12 shadow-2xl border-t-[12px] md:border-t-[16px] border-[#FBBC05] animate-in zoom-in duration-200 my-auto">
            <h3 className="text-2xl md:text-3xl font-medium uppercase tracking-tighter text-[#202124] mb-8 md:mb-12">Manual Entry Posting</h3>
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
               <div className="space-y-3 md:space-y-4">
                 <label className="text-[10px] md:text-[11px] font-semibold uppercase tracking-widest text-[#5f6368]">Narration / Description</label>
                 <input required className="w-full p-4 md:p-5 bg-[#f8f9fa] border border-[#dadce0] focus:border-[#FBBC05] rounded-xl outline-none font-medium text-sm md:text-base uppercase" placeholder="e.g. Utility Bill Payment - Jan 2025" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                 <div className="space-y-3 md:space-y-4">
                   <label className="text-[10px] md:text-[11px] font-semibold uppercase tracking-widest text-[#5f6368]">Quantum (RS)</label>
                   <input required type="number" className="w-full p-4 md:p-5 bg-[#f8f9fa] border border-[#dadce0] rounded-xl outline-none font-medium text-sm" placeholder="e.g. 5000" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                 </div>
                 <div className="space-y-3 md:space-y-4">
                   <label className="text-[10px] md:text-[11px] font-semibold uppercase tracking-widest text-[#5f6368]">Polarity</label>
                   <select className="w-full p-4 md:p-5 bg-[#f8f9fa] border border-[#dadce0] rounded-xl outline-none font-medium text-sm uppercase" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                     <option value={TransactionType.EXPENSE}>EXPENSE (-)</option>
                     <option value={TransactionType.INCOME}>INCOME (+)</option>
                   </select>
                 </div>
               </div>
               <div className="space-y-3 md:space-y-4">
                 <label className="text-[10px] md:text-[11px] font-semibold uppercase tracking-widest text-[#5f6368]">Classification</label>
                 <select className="w-full p-4 md:p-5 bg-[#f8f9fa] border border-[#dadce0] rounded-xl outline-none font-medium text-sm uppercase" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})}>
                   <option value="PROJECT">PROJECT REVENUE</option>
                   <option value="PAYROLL">PAYROLL / HR</option>
                   <option value="OFFICE">OFFICE OPERATIONS</option>
                   <option value="PETTY_CASH">PETTY CASH</option>
                   <option value="MARKETING">MARKETING / SALES</option>
                   <option value="TAX">GOVT TAXES</option>
                   <option value="EQUIPMENT">CAPITAL ASSETS</option>
                 </select>
               </div>
               <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6 md:pt-10">
                 <button type="button" onClick={() => setShowModal(false)} className="px-8 py-4 font-semibold text-[#5f6368] uppercase text-[10px] md:text-xs tracking-widest hover:bg-[#f1f3f4] rounded-xl">Discard</button>
                 <button type="submit" className="flex-1 bg-[#202124] text-white rounded-xl py-4 font-medium uppercase text-[10px] md:text-xs tracking-widest shadow-xl hover:bg-black active:scale-95">Commit Posting</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
