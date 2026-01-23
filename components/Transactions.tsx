
import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { jsPDF } from 'jspdf';

interface TransactionsProps {
  transactions: Transaction[];
  onAddTransaction: (t: Transaction) => void;
}

const Transactions: React.FC<TransactionsProps> = ({ transactions, onAddTransaction }) => {
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
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white p-10 rounded-[2rem] border-l-[12px] border-[#FBBC05] shadow-xl gap-8">
        <div>
          <h2 className="text-4xl font-medium text-[#202124] tracking-tighter uppercase leading-none">Financial Ledger</h2>
          <p className="text-[#5f6368] font-medium text-sm uppercase tracking-widest mt-2">Source-of-truth Transaction History</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={exportLedgerPDF}
             className="bg-white border-2 border-[#FBBC05] text-[#202124] px-8 py-4 rounded-xl font-medium text-xs tracking-widest uppercase hover:bg-[#fef7e0]"
           >
             Export Ledger PDF
           </button>
           <button 
             onClick={() => setShowModal(true)} 
             className="bg-[#202124] text-white px-10 py-5 rounded-xl font-medium shadow-lg hover:bg-black transition-all text-xs tracking-widest uppercase"
           >
             Post Transaction
           </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#dadce0] overflow-hidden google-shadow">
        <table className="w-full text-left">
          <thead className="bg-[#f8f9fa] border-b border-[#dadce0] text-[#5f6368] font-semibold uppercase tracking-[0.2em] text-[11px]">
            <tr>
              <th className="px-10 py-6">Timeline / Detail</th>
              <th className="px-10 py-6">Classification</th>
              <th className="px-10 py-6 text-right">Volume</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#dadce0] text-sm text-[#3c4043]">
            {transactions.length === 0 ? (
              <tr><td colSpan={3} className="p-40 text-center text-[#bdc1c6] font-medium uppercase tracking-[0.5em]">No Ledger Entries</td></tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id} className="hover:bg-[#fef7e0]/50 transition-colors">
                  <td className="px-10 py-8">
                    <div className="font-semibold text-[#202124] uppercase tracking-tight text-lg leading-none">{t.description}</div>
                    <div className="text-[10px] text-[#5f6368] font-medium tracking-widest uppercase mt-2">{t.date}</div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="px-4 py-2 bg-[#f1f3f4] rounded-lg text-[10px] font-semibold uppercase tracking-widest text-[#5f6368]">{t.category}</span>
                  </td>
                  <td className={`px-10 py-8 text-right font-semibold text-xl tracking-tight ${t.type === TransactionType.INCOME ? 'text-[#34A853]' : 'text-[#EA4335]'}`}>
                    {t.type === TransactionType.EXPENSE ? '-' : '+'}{formatSimple(t.amount)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#202124]/80 backdrop-blur-md z-[200] flex items-center justify-center p-8">
          <div className="bg-white rounded-3xl w-full max-w-xl p-12 shadow-2xl border-t-[16px] border-[#FBBC05] animate-in zoom-in duration-200">
            <h3 className="text-3xl font-medium uppercase tracking-tighter text-[#202124] mb-12">Manual Entry Posting</h3>
            <form onSubmit={handleSubmit} className="space-y-8">
               <div className="space-y-4">
                 <label className="text-[11px] font-semibold uppercase tracking-widest text-[#5f6368]">Narration</label>
                 <input required className="w-full p-5 bg-[#f8f9fa] border border-[#dadce0] focus:border-[#FBBC05] rounded-xl outline-none font-medium text-sm uppercase transition-all" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
               </div>
               <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-4">
                   <label className="text-[11px] font-semibold uppercase tracking-widest text-[#5f6368]">Quantum (RS)</label>
                   <input required type="number" className="w-full p-5 bg-[#f8f9fa] border border-[#dadce0] rounded-xl outline-none font-medium text-sm transition-all" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                 </div>
                 <div className="space-y-4">
                   <label className="text-[11px] font-semibold uppercase tracking-widest text-[#5f6368]">Polarity</label>
                   <select className="w-full p-5 bg-[#f8f9fa] border border-[#dadce0] rounded-xl outline-none font-medium text-sm uppercase transition-all" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                     <option value={TransactionType.EXPENSE}>EXPENSE (-)</option>
                     <option value={TransactionType.INCOME}>INCOME (+)</option>
                   </select>
                 </div>
               </div>
               <div className="space-y-4">
                 <label className="text-[11px] font-semibold uppercase tracking-widest text-[#5f6368]">Classification</label>
                 <select className="w-full p-5 bg-[#f8f9fa] border border-[#dadce0] rounded-xl outline-none font-medium text-sm uppercase transition-all" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})}>
                   <option value="PROJECT">PROJECT REVENUE</option>
                   <option value="PAYROLL">PAYROLL / HR</option>
                   <option value="OFFICE">OFFICE OPERATIONS</option>
                   <option value="PETTY_CASH">PETTY CASH</option>
                   <option value="MARKETING">MARKETING / SALES</option>
                   <option value="TAX">GOVT TAXES</option>
                 </select>
               </div>
               <div className="flex gap-6 pt-10">
                 <button type="button" onClick={() => setShowModal(false)} className="px-8 py-5 font-semibold text-[#5f6368] uppercase text-xs tracking-widest hover:bg-[#f1f3f4] rounded-xl transition-colors">Discard</button>
                 <button type="submit" className="flex-1 bg-[#202124] text-white rounded-xl py-5 font-medium uppercase text-xs tracking-widest shadow-xl hover:bg-black transition-transform active:scale-95">Commit Posting</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
