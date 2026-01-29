
import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType } from '../types';

interface PurchaseRecord {
  id: string;
  vendorName: string;
  description: string;
  amount: number;
  date: string;
  status: 'PENDING' | 'PAID';
  category: string;
}

interface PurchaseProps {
  onAddTransaction: (t: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

const PurchaseRecords: React.FC<PurchaseProps> = ({ onAddTransaction, onDeleteTransaction }) => {
  const [purchases, setPurchases] = useState<PurchaseRecord[]>(() => {
    const saved = localStorage.getItem('ag_purchases');
    return saved ? JSON.parse(saved) : [];
  });
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ vendor: '', desc: '', amount: '', cat: 'VENDOR_PURCHASE' });

  const savePurchases = (updated: PurchaseRecord[]) => {
    setPurchases(updated);
    localStorage.setItem('ag_purchases', JSON.stringify(updated));
  };

  const handleAddPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    const newP: PurchaseRecord = {
      id: Math.random().toString(36).substr(2, 9),
      vendorName: formData.vendor,
      description: formData.desc,
      amount: parseFloat(formData.amount) || 0,
      date: new Date().toLocaleDateString('en-GB'),
      status: 'PAID',
      category: formData.cat
    };

    const updated = [newP, ...purchases];
    savePurchases(updated);
    
    // Post to ledger
    onAddTransaction({
      id: newP.id,
      description: `PURCHASE: ${newP.vendorName} (${newP.description})`,
      amount: newP.amount,
      type: TransactionType.EXPENSE,
      date: newP.date,
      category: 'VENDOR_PURCHASE' as any
    });

    setShowModal(false);
    setFormData({ vendor: '', desc: '', amount: '', cat: 'VENDOR_PURCHASE' });
  };

  const deletePurchase = (id: string) => {
    if (!window.confirm("Permanently delete this purchase record? This will also remove the corresponding ledger entry.")) return;
    const updated = purchases.filter(p => p.id !== id);
    savePurchases(updated);
    onDeleteTransaction(id);
  };

  const exportCSV = () => {
    const headers = ["Date", "Vendor", "Description", "Amount", "Status"];
    const rows = purchases.map(p => [p.date, p.vendorName, p.description, p.amount, p.status]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "AG_Purchase_Export.csv");
    link.click();
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
           <div className="w-1.5 h-16 bg-[#EA4335]"></div>
           <div>
             <h1 className="text-4xl font-serif font-black tracking-tighter uppercase text-[#202124]">Procurement</h1>
             <p className="text-[10px] font-bold text-[#5f6368] uppercase tracking-[0.4em] mt-1">Operational OS / Purchases</p>
           </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button onClick={exportCSV} className="bg-white border border-[#dadce0] text-[#5f6368] px-6 py-5 rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-slate-50">CSV Export</button>
          <button onClick={() => setShowModal(true)} className="flex-1 md:flex-none bg-[#EA4335] text-white px-10 py-5 rounded-sm font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-[#c5221f] transition-all transform active:scale-95">Record Bill</button>
        </div>
      </div>

      <div className="bg-white border border-[#dadce0] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#f8f9fa] border-b border-[#dadce0]">
            <tr className="text-[10px] font-black uppercase text-[#5f6368] tracking-widest">
              <th className="px-8 py-6">Reference / Vendor</th>
              <th className="px-8 py-6">Category</th>
              <th className="px-8 py-6 text-right">Volume (PKR)</th>
              <th className="px-8 py-6 text-center">Tools</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f3f4]">
            {purchases.length === 0 ? (
              <tr><td colSpan={4} className="p-32 text-center text-[#bdc1c6] font-bold uppercase tracking-[0.4em] text-xs">No vendor records found</td></tr>
            ) : (
              purchases.map(p => (
                <tr key={p.id} className="hover:bg-red-50/30 group transition-all">
                  <td className="px-8 py-6">
                    <div className="font-bold text-[#202124] uppercase text-sm">{p.vendorName}</div>
                    <div className="text-[9px] font-bold text-[#5f6368] uppercase mt-1 opacity-50">{p.description} • {p.date}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[9px] font-bold bg-white border border-[#dadce0] px-3 py-1 rounded uppercase tracking-widest">{p.category}</span>
                  </td>
                  <td className="px-8 py-6 text-right font-black text-[#EA4335] text-lg">-{p.amount.toLocaleString()}</td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex justify-center items-center gap-4">
                      <span className="px-4 py-1.5 bg-green-50 text-[#34A853] border border-green-100 rounded-full text-[9px] font-black uppercase tracking-widest">Settled</span>
                      <button onClick={() => deletePurchase(p.id)} className="text-[#EA4335] opacity-0 group-hover:opacity-100 transition-opacity hover:underline font-bold text-[10px] uppercase">Delete Manually</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#202124]/90 backdrop-blur-md z-[500] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-xl p-12 rounded-lg shadow-2xl animate-in zoom-in duration-300">
             <h3 className="text-3xl font-serif font-black uppercase text-[#202124] mb-8">Post Vendor Bill</h3>
             <form onSubmit={handleAddPurchase} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#5f6368]">Vendor Entity</label>
                  <input required className="w-full p-4 bg-[#f8f9fa] border border-[#dadce0] rounded font-bold text-xs uppercase outline-none focus:border-[#EA4335]" placeholder="E.G. CLOUD HOSTING INC" value={formData.vendor} onChange={e => setFormData({...formData, vendor: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#5f6368]">Narration</label>
                  <input required className="w-full p-4 bg-[#f8f9fa] border border-[#dadce0] rounded font-bold text-xs uppercase outline-none focus:border-[#EA4335]" placeholder="E.G. JAN-MAR MEDIA BUYING" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#5f6368]">Amount (PKR)</label>
                    <input required type="number" className="w-full p-4 bg-[#f8f9fa] border border-[#dadce0] rounded font-bold text-xs outline-none focus:border-[#EA4335]" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#5f6368]">Classification</label>
                    <select className="w-full p-4 bg-[#f8f9fa] border border-[#dadce0] rounded font-bold text-xs outline-none focus:border-[#EA4335]" value={formData.cat} onChange={e => setFormData({...formData, cat: e.target.value})}>
                      <option value="VENDOR_PURCHASE">VENDOR SETTLEMENT</option>
                      <option value="OFFICE">OPERATIONS</option>
                      <option value="MARKETING">AD SPEND</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest text-[#5f6368] hover:bg-slate-50 transition-all">Cancel</button>
                  <button type="submit" className="flex-1 py-4 bg-[#EA4335] text-white text-[10px] font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all">Post Purchase</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseRecords;
