
import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';

interface TransactionsProps {
  transactions: Transaction[];
  onAddTransaction: (t: Transaction) => void;
}

const Transactions: React.FC<TransactionsProps> = ({ transactions, onAddTransaction }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ description: '', amount: '', category: 'OFFICE' as any, type: TransactionType.EXPENSE });

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

  const formatSimple = (val: number) => `RS ${val.toFixed(0)}`;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white p-10 rounded-[2.5rem] border-l-[12px] border-slate-900 shadow-sm gap-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">GENERAL LEDGER</h2>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest mt-1">UNIFIED TRANSACTION HISTORY</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black shadow-2xl hover:scale-105 transition-all text-xs tracking-[0.2em] uppercase"
        >
          POST TRANSACTION
        </button>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b-2 border-slate-100 text-slate-500 font-black uppercase tracking-[0.3em] text-[11px]">
            <tr>
              <th className="px-12 py-8">DESCRIPTION / DATE</th>
              <th className="px-12 py-8">CATEGORY</th>
              <th className="px-12 py-8 text-right">VOLUME</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[14px] font-medium text-slate-700">
            {transactions.length === 0 ? (
              <tr><td colSpan={3} className="p-32 text-center text-slate-300 font-black uppercase tracking-[0.5em] text-xs">NO LEDGER ENTRIES</td></tr>
            ) : (
              transactions.map((t, idx) => (
                <tr key={t.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'} hover:bg-slate-100/50 transition-colors`}>
                  <td className="px-12 py-8">
                    <div className="font-black text-slate-900 uppercase tracking-tight">{t.description}</div>
                    <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1">{t.date}</div>
                  </td>
                  <td className="px-12 py-8">
                    <span className="px-4 py-1.5 bg-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-600">{t.category}</span>
                  </td>
                  <td className={`px-12 py-8 text-right font-black ${t.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === TransactionType.EXPENSE ? '-' : '+'}{formatSimple(t.amount)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[200] flex items-center justify-center p-8">
          <div className="bg-white rounded-[3rem] w-full max-w-xl p-16 shadow-2xl animate-in slide-in-from-bottom-12 duration-500">
            <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 mb-12 border-b-8 border-slate-900 inline-block pb-3">MANUAL POSTING</h3>
            <form onSubmit={handleSubmit} className="space-y-8">
               <div className="space-y-4">
                 <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">ENTRY DESCRIPTION</label>
                 <input required className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-black text-sm uppercase border-2 border-transparent focus:border-slate-900 transition-all" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
               </div>
               <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-4">
                   <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">AMOUNT RS</label>
                   <input required type="number" className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-black text-sm" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                 </div>
                 <div className="space-y-4">
                   <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">TYPE</label>
                   <select className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-black text-sm" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                     <option value={TransactionType.EXPENSE}>EXPENSE</option>
                     <option value={TransactionType.INCOME}>INCOME</option>
                   </select>
                 </div>
               </div>
               <div className="space-y-4">
                 <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">CATEGORY</label>
                 <select className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-black text-sm uppercase" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})}>
                   <option value="PROJECT">PROJECT REVENUE</option>
                   <option value="PAYROLL">PAYROLL / HR</option>
                   <option value="OFFICE">OFFICE OPERATIONS</option>
                   <option value="PETTY_CASH">PETTY CASH</option>
                   <option value="MARKETING">MARKETING / SALES</option>
                   <option value="TAX">GOVT TAXES</option>
                 </select>
               </div>
               <div className="flex gap-8 pt-8">
                 <button type="button" onClick={() => setShowModal(false)} className="px-8 py-5 font-black text-slate-400 uppercase text-xs tracking-widest hover:text-slate-900 transition-colors">ABORT</button>
                 <button type="submit" className="flex-1 bg-slate-900 text-white rounded-2xl py-5 font-black uppercase text-xs tracking-widest shadow-2xl transition-transform hover:scale-105">POST TO LEDGER</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
