
import React, { useState, useMemo } from 'react';
import { Invoice, InvoiceStatus, Client, InvoiceItem } from '../types';

interface InvoicesProps {
  invoices: Invoice[];
  clients: Client[];
  onAddInvoice: (invoice: Invoice) => void;
  onMarkAsPaid: (id: string) => void;
}

const Invoices: React.FC<InvoicesProps> = ({ invoices, clients, onAddInvoice, onMarkAsPaid }) => {
  const [showModal, setShowModal] = useState(false);
  const [clientId, setClientId] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Core Strategy & Design', quantity: 1, unitPrice: 50000 }
  ]);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0), [items]);
  const tax = subtotal * 0.16; // Standard 16% Tax
  const grandTotal = subtotal + tax;

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(), description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) setItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedClient = clients.find(c => c.id === clientId);
    if (!selectedClient) return;

    const newInvoice: Invoice = {
      id: Math.random().toString(36).substr(2, 9),
      invoiceNumber: `AG-INV-${invoices.length + 101}`,
      clientId,
      clientName: selectedClient.name,
      clientEmail: selectedClient.email,
      date: new Date().toLocaleDateString('en-GB'),
      dueDate: new Date(Date.now() + 7*24*60*60*1000).toLocaleDateString('en-GB'),
      items: items,
      status: InvoiceStatus.SENT,
      taxRate: 16,
      advancePayment: 0,
      paidAmount: 0,
      total: grandTotal,
      currency: 'PKR'
    };
    onAddInvoice(newInvoice);
    setShowModal(false);
    setClientId('');
    setItems([{ id: '1', description: 'Core Strategy & Design', quantity: 1, unitPrice: 50000 }]);
  };

  const formatCurrency = (val: number) => `RS ${val.toLocaleString()}`;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white p-10 rounded-[3rem] border-b-[12px] border-blue-600 shadow-xl gap-8">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">BILLING ENGINE</h2>
          <p className="text-slate-400 font-bold text-[12px] uppercase tracking-[0.4em] mt-2">ITEMIZED ACCOUNTS RECEIVABLE</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black shadow-2xl shadow-blue-600/30 hover:scale-105 transition-all text-xs tracking-[0.2em] uppercase"
        >
          CREATE NEW BILL
        </button>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b-4 border-slate-100 text-slate-500 font-black uppercase tracking-[0.3em] text-[11px]">
              <tr>
                <th className="px-12 py-10">ENTITY & BILL NO</th>
                <th className="px-12 py-10 text-right">FEE (INC TAX)</th>
                <th className="px-12 py-10 text-right">STATUS</th>
                <th className="px-12 py-10 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100 text-[15px] font-bold text-slate-700">
              {invoices.length === 0 ? (
                <tr><td colSpan={4} className="p-40 text-center text-slate-300 font-black uppercase tracking-[0.6em] text-sm">ZERO ACTIVE BILLS</td></tr>
              ) : (
                invoices.map((inv, idx) => (
                  <tr key={inv.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/20'} hover:bg-blue-50/50 transition-colors`}>
                    <td className="px-12 py-10">
                      <div className="font-black text-slate-900 uppercase tracking-tight text-lg">{inv.clientName}</div>
                      <div className="text-[11px] text-slate-400 font-black tracking-widest uppercase mt-2">{inv.invoiceNumber} • DUE {inv.dueDate}</div>
                    </td>
                    <td className="px-12 py-10 text-right font-black text-slate-900 text-lg">{formatCurrency(inv.total)}</td>
                    <td className="px-12 py-10 text-right">
                      <span className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-md ${inv.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-12 py-10 text-right">
                       <button className="text-slate-400 hover:text-blue-600 font-black text-[12px] uppercase tracking-widest transition-colors">VIEW LEDGER</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[200] flex items-center justify-center p-8 overflow-y-auto">
          <div className="bg-white rounded-[3.5rem] w-full max-w-4xl p-16 shadow-2xl my-auto animate-in zoom-in duration-300">
            <div className="flex justify-between items-start mb-16 border-b-8 border-blue-600 pb-6">
              <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900">INSTANT BILLING</h3>
              <div className="text-right">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">SYSTEM DATE</p>
                <p className="text-sm font-black text-slate-900 uppercase">{new Date().toLocaleDateString('en-GB')}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
               <div className="space-y-5">
                 <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">TARGET CLIENT ENTITY</label>
                 <select required className="w-full p-6 bg-slate-50 rounded-2xl outline-none font-black text-sm uppercase border-2 border-transparent focus:border-blue-600 transition-all shadow-inner" value={clientId} onChange={e => setClientId(e.target.value)}>
                   <option value="">SELECT FROM DIRECTORY</option>
                   {clients.map(c => <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>)}
                 </select>
               </div>

               <div className="space-y-6">
                 <div className="flex justify-between items-end">
                    <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">BILLABLE LINE ITEMS</label>
                    <button type="button" onClick={addItem} className="text-[10px] font-black uppercase text-blue-600 tracking-widest">+ ADD ROW</button>
                 </div>
                 
                 <div className="space-y-4">
                    {items.map((item, idx) => (
                      <div key={item.id} className="grid grid-cols-12 gap-4 items-center animate-in slide-in-from-left-4">
                        <div className="col-span-6">
                          <input required placeholder="Service Description" className="w-full p-4 bg-slate-50 rounded-xl font-bold text-xs" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} />
                        </div>
                        <div className="col-span-2">
                          <input required type="number" placeholder="Qty" className="w-full p-4 bg-slate-50 rounded-xl font-bold text-xs text-center" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)} />
                        </div>
                        <div className="col-span-3">
                          <input required type="number" placeholder="Unit Price" className="w-full p-4 bg-slate-50 rounded-xl font-bold text-xs" value={item.unitPrice} onChange={e => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)} />
                        </div>
                        <div className="col-span-1 text-center">
                          <button type="button" onClick={() => removeItem(item.id)} className="text-red-400 font-bold hover:text-red-600">✕</button>
                        </div>
                      </div>
                    ))}
                 </div>
               </div>

               <div className="bg-slate-900 rounded-[2.5rem] p-12 text-white shadow-2xl">
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-slate-400">
                      <span className="text-[11px] font-black uppercase tracking-widest">SUBTOTAL VOLUME</span>
                      <span className="font-black tracking-tighter">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span className="text-[11px] font-black uppercase tracking-widest">GST / TAX (16%)</span>
                      <span className="font-black tracking-tighter">{formatCurrency(tax)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-6 border-t border-white/10">
                      <span className="text-xl font-black uppercase tracking-tighter">GRAND TOTAL</span>
                      <span className="text-3xl font-black tracking-tighter text-blue-400">{formatCurrency(grandTotal)}</span>
                    </div>
                 </div>
               </div>

               <div className="flex gap-8 pt-6">
                 <button type="button" onClick={() => setShowModal(false)} className="px-10 py-6 font-black text-slate-400 uppercase text-xs tracking-widest hover:text-slate-900 transition-colors">DISCARD ENTRY</button>
                 <button type="submit" className="flex-1 bg-blue-600 text-white rounded-3xl py-6 font-black uppercase text-xs tracking-[0.2em] shadow-2xl transition-transform hover:scale-105">DISPATCH INVOICE</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
