
import React, { useState, useMemo } from 'react';
import { Invoice, InvoiceStatus, Client, InvoiceItem } from '../types';
import { jsPDF } from 'jspdf';

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
    { id: '1', description: 'Strategic Planning', quantity: 1, unitPrice: 25000 }
  ]);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0), [items]);
  const tax = subtotal * 0.16; // 16% GST
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

  const exportInvoicesPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(66, 133, 244);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE DIRECTORY", 20, 25);
    
    doc.setTextColor(32, 33, 36);
    doc.setFontSize(10);
    let y = 60;
    doc.text("Ref", 20, y);
    doc.text("Client", 50, y);
    doc.text("Amount", 140, y);
    doc.text("Status", 180, y);
    y += 10;
    
    doc.setFont("helvetica", "normal");
    invoices.forEach(inv => {
      doc.text(inv.invoiceNumber, 20, y);
      doc.text(inv.clientName.substring(0, 20), 50, y);
      doc.text(`RS ${inv.total.toLocaleString()}`, 140, y);
      doc.text(inv.status, 180, y);
      y += 10;
      if (y > 280) { doc.addPage(); y = 20; }
    });
    doc.save("AdvertsGen_Invoices.pdf");
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
    setItems([{ id: '1', description: 'Strategic Planning', quantity: 1, unitPrice: 25000 }]);
  };

  const formatCurrency = (val: number) => `RS ${val.toLocaleString()}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-xl border-l-[12px] border-[#4285F4] google-shadow flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-3xl font-medium text-[#202124] tracking-tight uppercase">Billing Hub</h2>
          <p className="text-[#5f6368] font-medium text-sm uppercase tracking-wider mt-1">Accounts Receivable & Dispatches</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={exportInvoicesPDF}
            className="bg-white border-2 border-[#4285F4] text-[#4285F4] px-6 py-4 rounded-xl font-medium text-xs tracking-widest uppercase hover:bg-[#e8f0fe] transition-colors"
          >
            Export List PDF
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#4285F4] text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:bg-[#1967d2] transition-colors text-xs tracking-widest uppercase"
          >
            Create Invoice
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#dadce0] overflow-hidden google-shadow">
        <table className="w-full text-left">
          <thead className="bg-[#f8f9fa] border-b border-[#dadce0] text-[#5f6368] font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-8 py-6">Reference / Entity</th>
              <th className="px-8 py-6 text-right">Volume (PKR)</th>
              <th className="px-8 py-6 text-right">State</th>
              <th className="px-8 py-6 text-right">Utility</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#dadce0] text-sm text-[#3c4043]">
            {invoices.length === 0 ? (
              <tr><td colSpan={4} className="p-32 text-center text-[#bdc1c6] font-medium uppercase tracking-widest">Ledger Empty</td></tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#f8f9fa] transition-colors">
                  <td className="px-8 py-6">
                    <div className="font-semibold text-[#202124] uppercase tracking-tight text-base leading-none">{inv.clientName}</div>
                    <div className="text-[10px] text-[#5f6368] font-medium tracking-widest uppercase mt-2">{inv.invoiceNumber}</div>
                  </td>
                  <td className="px-8 py-6 text-right font-semibold text-[#202124] text-lg">{formatCurrency(inv.total)}</td>
                  <td className="px-8 py-6 text-right">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-widest ${
                      inv.status === 'PAID' ? 'bg-[#e6f4ea] text-[#34A853]' : 'bg-[#e8f0fe] text-[#4285F4]'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-[#4285F4] hover:underline font-semibold text-[11px] uppercase tracking-widest">Detail View</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#202124]/80 backdrop-blur-md z-[200] flex items-center justify-center p-8 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl p-12 shadow-2xl animate-in zoom-in duration-200 my-auto border-t-[16px] border-[#4285F4]">
            <div className="flex justify-between items-center mb-10 border-b border-[#dadce0] pb-6">
              <h3 className="text-3xl font-medium uppercase tracking-tighter text-[#202124]">Instant Generation</h3>
              <button onClick={() => setShowModal(false)} className="text-[#5f6368] hover:text-[#202124] transition-colors">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-4">
                   <label className="text-[11px] font-semibold uppercase tracking-widest text-[#5f6368]">Entity Search</label>
                   <select required className="w-full p-5 bg-[#f8f9fa] border border-[#dadce0] focus:border-[#4285F4] rounded-xl font-medium text-sm uppercase transition-all outline-none" value={clientId} onChange={e => setClientId(e.target.value)}>
                     <option value="">-- Search Directory --</option>
                     {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                   </select>
                 </div>
                 <div className="space-y-4">
                   <label className="text-[11px] font-semibold uppercase tracking-widest text-[#5f6368]">Disbursement Window</label>
                   <div className="p-5 bg-[#f8f9fa] border border-[#dadce0] rounded-xl font-medium text-sm text-[#5f6368] uppercase tracking-widest">Immediate Release</div>
                 </div>
               </div>

               <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-[#5f6368]">Billable Deliverables</label>
                    <button type="button" onClick={addItem} className="text-[#4285F4] font-semibold text-xs uppercase hover:underline tracking-widest">+ Add Line</button>
                 </div>
                 
                 <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-6">
                          <input required placeholder="Deliverable Description" className="w-full p-4 bg-[#f8f9fa] border border-[#dadce0] rounded-xl font-medium text-xs" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} />
                        </div>
                        <div className="col-span-2">
                          <input required type="number" placeholder="Qty" className="w-full p-4 bg-[#f8f9fa] border border-[#dadce0] rounded-xl font-medium text-xs text-center" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)} />
                        </div>
                        <div className="col-span-3">
                          <input required type="number" placeholder="Valuation" className="w-full p-4 bg-[#f8f9fa] border border-[#dadce0] rounded-xl font-medium text-xs" value={item.unitPrice} onChange={e => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)} />
                        </div>
                        <div className="col-span-1 text-center">
                          <button type="button" onClick={() => removeItem(item.id)} className="text-[#EA4335] font-semibold hover:bg-[#fce8e6] w-10 h-10 rounded-full transition-colors">✕</button>
                        </div>
                      </div>
                    ))}
                 </div>
               </div>

               <div className="bg-[#f8f9fa] p-10 rounded-2xl border border-[#dadce0] flex justify-end">
                 <div className="space-y-4 w-full max-w-sm">
                    <div className="flex justify-between text-sm text-[#5f6368] font-medium uppercase tracking-widest">
                      <span>Volume</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-[#5f6368] font-medium uppercase tracking-widest">
                      <span>Service Tax (16%)</span>
                      <span>{formatCurrency(tax)}</span>
                    </div>
                    <div className="flex justify-between pt-6 border-t border-[#dadce0] text-2xl font-semibold text-[#202124] tracking-tight">
                      <span>Total Value</span>
                      <span className="text-[#4285F4]">{formatCurrency(grandTotal)}</span>
                    </div>
                 </div>
               </div>

               <div className="flex justify-end gap-6 pt-10">
                 <button type="button" onClick={() => setShowModal(false)} className="px-8 py-5 font-semibold text-[#5f6368] uppercase text-xs tracking-widest hover:bg-[#f1f3f4] rounded-xl transition-colors">Discard</button>
                 <button type="submit" className="bg-[#4285F4] text-white px-12 py-5 rounded-xl font-medium uppercase text-xs tracking-widest shadow-xl hover:bg-[#1967d2] transition-transform active:scale-95">Dispatch Statement</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
