
import React, { useState, useMemo, useEffect } from 'react';
import { Invoice, InvoiceStatus, Client, InvoiceItem, Product } from '../types';
import { jsPDF } from 'jspdf';

interface InvoicesProps {
  invoices: Invoice[];
  clients: Client[];
  products: Product[];
  onAddInvoice: (invoice: Invoice) => void;
  onMarkAsPaid: (id: string) => void;
  onDeleteInvoice: (id: string) => void;
  onAddClient: (c: Client) => void;
  initialClientId?: string | null;
  onClearSelection?: () => void;
}

const Invoices: React.FC<InvoicesProps> = ({ 
  invoices, 
  clients, 
  products, 
  onAddInvoice, 
  onMarkAsPaid, 
  onDeleteInvoice, 
  onAddClient,
  initialClientId,
  onClearSelection
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showQuickClientModal, setShowQuickClientModal] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  
  const [clientId, setClientId] = useState('');
  const [advance, setAdvance] = useState<string>('0');
  const [discount, setDiscount] = useState<string>('0');
  const [notes, setNotes] = useState('1. All payments should be made in PKR via Bank Transfer.\n2. Payment is due within 14 calendar days.\n3. Goods or services remain the property of the agency until full settlement.');
  const [dueDateStr, setDueDateStr] = useState<string>(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0 }
  ]);

  const [newClientData, setNewClientData] = useState({ name: '', email: '', industry: '' });

  useEffect(() => {
    if (initialClientId) {
      setClientId(initialClientId);
      setShowModal(true);
      if (onClearSelection) onClearSelection();
    }
  }, [initialClientId, onClearSelection]);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0), [items]);
  const discountVal = parseFloat(discount) || 0;
  const taxableAmount = subtotal - discountVal;
  const tax = taxableAmount * 0.16;
  const grandTotal = taxableAmount + tax;
  const advanceVal = parseFloat(advance) || 0;

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(), description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) setItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const handleQuickAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientData.name.trim()) return;

    const newClient: Client = {
      id: Math.random().toString(36).substr(2, 9),
      name: newClientData.name,
      email: newClientData.email,
      industry: newClientData.industry,
      totalBilled: 0,
      status: 'ACTIVE'
    };
    onAddClient(newClient);
    setClientId(newClient.id);
    setShowQuickClientModal(false);
    setNewClientData({ name: '', email: '', industry: '' });
  };

  const exportInvoicePDF = (inv: Invoice) => {
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const bluePrimary = "#074a8d"; 
    const blackHeader = "#000000";
    const textDark = "#202124";
    const textGray = "#5f6368";
    
    // 1. Header (Black & Blue Split)
    doc.setFillColor(blackHeader);
    doc.rect(0, 0, 110, 45, 'F');
    doc.setFillColor(bluePrimary);
    doc.rect(110, 0, 100, 45, 'F');
    
    // Slant Transition (matching the requested design exactly)
    doc.setFillColor(bluePrimary);
    doc.triangle(110, 0, 90, 45, 110, 45, 'F');

    // Company Logo/Text on Black
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("ADVERTS GEN", 15, 22);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("CREATIVE MARKETING AGENCY", 15, 28);

    // Invoice Meta on Blue
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(32);
    doc.text("INVOICE", 195, 22, { align: 'right' });
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice Number: ${inv.invoiceNumber}`, 195, 30, { align: 'right' });
    doc.text(`Invoice Date: ${inv.date}`, 195, 35, { align: 'right' });
    doc.text(`Web: www.advertsgen.com`, 195, 40, { align: 'right' });

    // 2. Client & Payment Section
    let y = 65;
    doc.setTextColor(textGray);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("INVOICE TO:", 15, y);
    doc.text("Payment Method", 130, y);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(textDark);
    doc.setFontSize(11);
    doc.text(inv.clientName.toUpperCase(), 15, y + 8);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(textGray);
    doc.text(inv.clientEmail, 15, y + 14);
    doc.text("Strategic Business Partner", 15, y + 20);

    doc.setTextColor(textDark);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Bank: Meezan Bank G 8 Islamabad", 130, y + 8);
    doc.setFontSize(9);
    doc.setTextColor(textGray);
    doc.text("Title: Digital Adverts Gen SMC Pvt Ltd.", 130, y + 14);
    doc.setTextColor(textDark);
    doc.text("A/C No: 0319 010 7212 176", 130, y + 20);
    doc.text("Branch Code: 0319", 130, y + 26);

    // Intro Text
    y += 45;
    doc.setFontSize(9);
    doc.setTextColor(textGray);
    doc.text("Dear Client,", 15, y);
    doc.text("Thank you for choosing our services. Below is the detailed breakdown of the work performed.", 15, y + 6);

    // 3. Table Header
    y += 15;
    doc.setFillColor(bluePrimary);
    doc.rect(15, y, 180, 10, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("No.", 20, y + 6.5);
    doc.text("Product Description", 35, y + 6.5);
    doc.text("Price", 135, y + 6.5, { align: 'center' });
    doc.text("Quantity", 160, y + 6.5, { align: 'center' });
    doc.text("Total", 190, y + 6.5, { align: 'right' });

    // 4. Table Rows
    y += 10;
    doc.setTextColor(textDark);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    
    inv.items.forEach((item, index) => {
        doc.text((index + 1).toString().padStart(2, '0'), 20, y + 8);
        const desc = item.description;
        const splitDesc = doc.splitTextToSize(desc, 90);
        doc.text(splitDesc, 35, y + 8);
        doc.text(item.unitPrice.toLocaleString(), 135, y + 8, { align: 'center' });
        doc.text(item.quantity.toString(), 160, y + 8, { align: 'center' });
        doc.text((item.quantity * item.unitPrice).toLocaleString(), 190, y + 8, { align: 'right' });
        
        const lines = splitDesc.length;
        y += (lines > 1 ? lines * 6 : 12);
        
        doc.setDrawColor(240);
        doc.line(15, y, 195, y);
    });

    // 5. Summary & Signature
    y += 15;
    
    // Left: Terms
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(textDark);
    doc.text("Terms & Conditions:", 15, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(textGray);
    const splitTerms = doc.splitTextToSize(inv.notes || "1. Due in 14 days.\n2. Standard taxes apply.", 90);
    doc.text(splitTerms, 15, y + 7);

    // Right: Calculation
    const summaryX = 145;
    doc.setFontSize(9);
    doc.text("Subtotal:", summaryX, y);
    doc.text(inv.items.reduce((s,i) => s + (i.quantity*i.unitPrice), 0).toLocaleString(), 195, y, { align: 'right' });

    y += 7;
    doc.text("Discount:", summaryX, y);
    doc.text(`- ${inv.discountAmount.toLocaleString()}`, 195, y, { align: 'right' });

    y += 7;
    doc.text("Tax (16%):", summaryX, y);
    const taxValue = (inv.total - (inv.items.reduce((s,i) => s + (i.quantity*i.unitPrice), 0) - inv.discountAmount));
    doc.text(taxValue.toLocaleString(), 195, y, { align: 'right' });

    // Big Blue Total Box
    y += 10;
    doc.setFillColor(bluePrimary);
    doc.rect(summaryX - 5, y, 55, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Total:", summaryX, y + 8);
    doc.text(`PKR ${inv.total.toLocaleString()}`, 190, y + 8, { align: 'right' });

    // 6. Signature
    y += 35;
    doc.setTextColor(textDark);
    doc.setFontSize(10);
    doc.text("Authorized Signature", 195, y, { align: 'right' });
    doc.setDrawColor(textGray);
    doc.line(155, y + 2, 195, y + 2);

    // 7. Geometric Footer (Bottom Slant mirroring the screenshot)
    doc.setFillColor(bluePrimary);
    doc.triangle(0, 297, 130, 297, 0, 280, 'F');
    doc.triangle(130, 297, 110, 280, 0, 280, 'F');

    doc.save(`${inv.invoiceNumber}_AdvertsGen.pdf`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedClient = clients.find(c => c.id === clientId);
    if (!selectedClient) return;

    const newInvoice: Invoice = {
      id: Math.random().toString(36).substr(2, 9),
      invoiceNumber: `AG-INV-${invoices.length + 3001}`,
      clientId,
      clientName: selectedClient.name,
      clientEmail: selectedClient.email,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      dueDate: new Date(dueDateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      items: items,
      status: InvoiceStatus.SENT,
      taxRate: 16,
      discountAmount: discountVal,
      advancePayment: advanceVal,
      paidAmount: 0,
      total: grandTotal,
      currency: 'PKR',
      notes
    };
    onAddInvoice(newInvoice);
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setClientId('');
    setAdvance('0');
    setDiscount('0');
    setItems([{ id: '1', description: '', quantity: 1, unitPrice: 0 }]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-12 font-sans">
      <div className="bg-white p-6 rounded-3xl border border-[#dadce0] shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-left w-full md:w-auto">
          <h2 className="text-xl md:text-2xl font-serif font-bold text-[#202124] tracking-tight uppercase">Invoices</h2>
          <p className="text-[#4285F4] font-semibold text-[10px] uppercase tracking-[0.2em] mt-1.5">Billing & Ledger</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="w-full md:w-auto bg-[#4285F4] text-white px-8 py-3.5 rounded-2xl font-semibold text-[10px] tracking-[0.1em] uppercase shadow-md hover:bg-blue-600 transition-all active:scale-95"
        >
          New Document
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-[#dadce0] overflow-hidden shadow-sm">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-[#f8f9fa] border-b border-[#dadce0]">
              <tr className="text-[10px] font-semibold text-[#4285F4] uppercase tracking-[0.15em]">
                <th className="px-8 py-5">Partner</th>
                <th className="px-6 py-5">Ref.</th>
                <th className="px-8 py-5 text-right">Volume (PKR)</th>
                <th className="px-6 py-5 text-center">Due Window</th>
                <th className="px-8 py-5 text-right">Utility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f3f4]">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-[#bdc1c6] font-semibold text-[10px] uppercase tracking-[0.3em]">No active document stream</td>
                </tr>
              ) : (
                invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-5">
                       <div className="text-sm font-bold text-[#202124] uppercase tracking-tight leading-none">{inv.clientName}</div>
                       <div className="text-[9px] font-medium text-[#bdc1c6] mt-2 uppercase tracking-widest">{inv.clientEmail}</div>
                    </td>
                    <td className="px-6 py-5">
                       <span className="text-[9px] font-semibold bg-white border border-[#dadce0] px-2.5 py-1 rounded uppercase tracking-widest text-[#5f6368]">{inv.invoiceNumber}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <div className="text-base font-bold text-[#202124] tracking-tight tabular-nums">{inv.total.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-5 text-center">
                       <div className="text-[10px] font-medium text-[#5f6368] uppercase tracking-tight">{inv.dueDate}</div>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => exportInvoicePDF(inv)} className="p-2.5 rounded-lg text-[#4285F4] hover:bg-blue-50 transition-all" title="Download PDF"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg></button>
                          <button onClick={() => setViewingInvoice(inv)} className="p-2.5 rounded-lg text-[#202124] hover:bg-slate-100 transition-all" title="View"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg></button>
                          <button onClick={() => onDeleteInvoice(inv.id)} className="p-2.5 rounded-lg text-[#EA4335] hover:bg-red-50 transition-all" title="Delete Manually"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#202124]/90 backdrop-blur-xl z-[500] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl p-6 md:p-10 shadow-2xl relative rounded-[2rem] border-t-8 border-[#4285F4] my-auto">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-[#5f6368] hover:text-[#202124] p-2 hover:bg-slate-100 rounded-full transition-all">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
            </button>

            <div className="mb-8">
               <h3 className="text-xl md:text-2xl font-serif font-bold text-[#202124] uppercase tracking-tight">Billing Console</h3>
               <p className="text-[#4285F4] font-semibold text-[10px] uppercase tracking-[0.2em] mt-1.5">Draft Document</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-semibold text-[#5f6368] uppercase tracking-widest">Partner Identity</label>
                    <button type="button" onClick={() => setShowQuickClientModal(true)} className="text-[8px] font-bold text-[#4285F4] uppercase hover:underline">+ New Account</button>
                  </div>
                  <select required className="w-full p-4 bg-[#f8f9fa] border border-[#dadce0] font-semibold text-[11px] uppercase outline-none focus:border-[#4285F4] rounded-2xl transition-all" value={clientId} onChange={e => setClientId(e.target.value)}>
                    <option value="">Select Account...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-semibold text-[#5f6368] uppercase tracking-widest">Advance (PKR)</label>
                   <input type="number" className="w-full p-4 bg-[#f8f9fa] border border-[#dadce0] font-semibold text-[11px] outline-none focus:border-[#4285F4] rounded-2xl transition-all" value={advance} onChange={e => setAdvance(e.target.value)} />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-semibold text-[#5f6368] uppercase tracking-widest">Due Deadline</label>
                   <input type="date" className="w-full p-4 bg-[#f8f9fa] border border-[#dadce0] font-semibold text-[11px] outline-none focus:border-[#4285F4] rounded-2xl transition-all" value={dueDateStr} onChange={e => setDueDateStr(e.target.value)} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <h4 className="text-sm font-bold text-[#202124] uppercase tracking-tight">Scope of Work</h4>
                   <button type="button" onClick={addItem} className="bg-[#202124] text-white px-5 py-2 text-[9px] font-semibold uppercase tracking-widest rounded-xl">+ Add Entry</button>
                </div>
                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
                  {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-4 items-center bg-[#fcfdfe] p-4 border border-[#dadce0] rounded-2xl group">
                      <div className="col-span-12 md:col-span-6">
                        <input required className="w-full p-3 bg-white border border-[#dadce0] font-semibold text-[10px] uppercase outline-none rounded-xl focus:border-[#4285F4]" placeholder="DESCRIPTION" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} />
                      </div>
                      <div className="col-span-4 md:col-span-2">
                        <input required type="number" className="w-full p-3 bg-white border border-[#dadce0] font-semibold text-[10px] text-center outline-none rounded-xl focus:border-[#4285F4]" value={item.quantity === 0 ? '' : item.quantity} onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)} />
                      </div>
                      <div className="col-span-6 md:col-span-3">
                        <input required type="number" className="w-full p-3 bg-white border border-[#dadce0] font-semibold text-[10px] outline-none text-right rounded-xl focus:border-[#4285F4]" value={item.unitPrice === 0 ? '' : item.unitPrice} onChange={e => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)} />
                      </div>
                      <div className="col-span-2 md:col-span-1 text-center">
                        <button type="button" onClick={() => removeItem(item.id)} className="text-red-400 p-1.5 hover:bg-red-50 rounded-full transition-all"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-[#f1f3f4]">
                <div className="space-y-4">
                   <div className="space-y-1">
                      <label className="text-[9px] font-semibold text-[#5f6368] uppercase tracking-widest">Notes & Terms</label>
                      <textarea rows={3} className="w-full p-3.5 bg-[#f8f9fa] border border-[#dadce0] font-semibold text-[10px] outline-none focus:border-[#4285F4] rounded-2xl" placeholder="E.G. Bank details..." value={notes} onChange={e => setNotes(e.target.value)} />
                   </div>
                </div>

                <div className="bg-[#fcfdfe] p-6 rounded-3xl border border-[#dadce0] flex flex-col justify-center gap-4">
                   <div className="flex justify-between text-[10px] font-semibold text-[#bdc1c6] uppercase tracking-widest">
                      <span>Subtotal</span>
                      <span>{subtotal.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between font-bold text-3xl text-[#202124] tracking-tight tabular-nums leading-none">
                      <span>TOTAL</span>
                      <span>{grandTotal.toLocaleString()}</span>
                   </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-8 py-3.5 font-semibold text-[#5f6368] uppercase text-[10px] tracking-widest hover:bg-[#f8f9fa] rounded-2xl transition-all">Discard</button>
                <button type="submit" className="bg-[#202124] text-white px-10 py-3.5 font-bold uppercase text-[10px] tracking-widest shadow-md hover:bg-black active:scale-95 transition-all rounded-2xl">Commit & Seal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showQuickClientModal && (
        <div className="fixed inset-0 bg-[#202124]/95 backdrop-blur-2xl z-[600] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2rem] w-full max-w-sm p-8 shadow-2xl border-t-8 border-[#34A853] animate-in slide-in-from-bottom-10 relative">
            <button onClick={() => setShowQuickClientModal(false)} className="absolute top-4 right-4 text-[#5f6368] hover:text-[#202124] p-2 hover:bg-slate-100 rounded-full transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
            </button>
            <h3 className="text-xl font-serif font-bold uppercase tracking-tight text-[#202124] mb-6">Register Partner</h3>
            <form onSubmit={handleQuickAddClient} className="space-y-4">
               <div className="space-y-1">
                 <label className="text-[9px] font-semibold uppercase tracking-widest text-[#5f6368]">Legal Name</label>
                 <input required className="w-full p-4 bg-[#f8f9fa] border border-[#dadce0] focus:border-[#34A853] rounded-2xl outline-none font-semibold text-[11px] uppercase" value={newClientData.name} onChange={e => setNewClientData({...newClientData, name: e.target.value})} />
               </div>
               <div className="space-y-1">
                 <label className="text-[9px] font-semibold uppercase tracking-widest text-[#5f6368]">Email</label>
                 <input required type="email" className="w-full p-4 bg-[#f8f9fa] border border-[#dadce0] focus:border-[#34A853] rounded-2xl outline-none font-medium text-[11px]" value={newClientData.email} onChange={e => setNewClientData({...newClientData, email: e.target.value})} />
               </div>
               <button type="submit" className="w-full bg-[#34A853] text-white rounded-2xl py-3.5 font-bold uppercase text-[10px] tracking-widest shadow-md mt-4">Add & Select</button>
            </form>
          </div>
        </div>
      )}

      {viewingInvoice && (
        <div className="fixed inset-0 bg-[#202124]/98 backdrop-blur-3xl z-[600] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl shadow-2xl relative my-auto animate-in fade-in zoom-in duration-300 rounded-3xl overflow-hidden flex flex-col">
            {/* Header Mirroring requested layout precisely */}
            <div className="flex h-32 md:h-40 text-white font-sans">
              <div className="flex-1 bg-black p-8 md:p-12">
                <h3 className="text-2xl md:text-3xl font-serif font-bold uppercase tracking-tight leading-none mb-1">ADVERTS GEN</h3>
                <p className="text-[8px] md:text-[9px] font-semibold tracking-widest opacity-70 uppercase">CREATIVE MARKETING AGENCY</p>
              </div>
              <div className="flex-1 bg-[#074a8d] p-8 md:p-12 text-right relative overflow-hidden">
                 <div className="absolute inset-y-0 left-0 w-32 bg-[#074a8d] transform -skew-x-[25deg] -translate-x-16"></div>
                 <h3 className="text-4xl md:text-5xl font-serif font-bold uppercase tracking-tighter leading-none mb-1">INVOICE</h3>
                 <p className="text-[10px] font-medium opacity-80 uppercase tracking-widest">REF: {viewingInvoice.invoiceNumber}</p>
                 <p className="text-[8px] opacity-70 uppercase mt-2">Web: www.advertsgen.com</p>
              </div>
            </div>

            <button onClick={() => setViewingInvoice(null)} className="absolute top-4 right-4 text-white/50 hover:text-white p-2 transition-all z-10">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
            </button>
            
            <div className="p-10 md:p-20 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div>
                    <p className="text-[9px] font-semibold text-[#bdc1c6] uppercase tracking-widest mb-3">Invoice To:</p>
                    <p className="text-xl md:text-2xl font-serif font-bold text-[#202124] uppercase tracking-tight">{viewingInvoice.clientName}</p>
                    <p className="text-[10px] font-medium text-[#4285F4] uppercase mt-1 tracking-tight">{viewingInvoice.clientEmail}</p>
                    <p className="text-[9px] font-medium text-[#5f6368] uppercase mt-2 tracking-widest opacity-60">Strategic Business Partner</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[9px] font-semibold text-[#bdc1c6] uppercase tracking-widest mb-3">Payment Method:</p>
                    <p className="text-sm font-medium text-[#202124]">Meezan Bank G 8 Islamabad</p>
                    <p className="text-[10px] font-bold text-[#202124] mt-1">Title: Digital Adverts Gen SMC Pvt Ltd.</p>
                    <p className="text-xl font-bold text-[#202124] mt-1 tracking-tight">0319 010 7212 176</p>
                    <p className="text-[9px] font-medium text-[#5f6368] uppercase mt-1 tracking-widest opacity-60">Branch Code: 0319</p>
                 </div>
              </div>

              <div className="space-y-0">
                 <div className="grid grid-cols-12 bg-[#074a8d] text-white p-4 rounded-t-2xl text-[10px] font-bold uppercase tracking-widest">
                    <div className="col-span-1">No.</div>
                    <div className="col-span-6">Product Description</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-1 text-center">Qty</div>
                    <div className="col-span-2 text-right">Total</div>
                 </div>
                 <div className="border border-[#f1f3f4] rounded-b-2xl divide-y divide-[#f1f3f4]">
                   {viewingInvoice.items.map((item, idx) => (
                     <div key={item.id} className="grid grid-cols-12 p-4 text-[11px] font-medium text-[#202124] items-center hover:bg-slate-50 transition-colors">
                        <div className="col-span-1 opacity-50">{(idx + 1).toString().padStart(2, '0')}</div>
                        <div className="col-span-6 font-semibold uppercase tracking-tight">{item.description}</div>
                        <div className="col-span-2 text-center">{item.unitPrice.toLocaleString()}</div>
                        <div className="col-span-1 text-center">{item.quantity}</div>
                        <div className="col-span-2 text-right font-bold">{(item.quantity * item.unitPrice).toLocaleString()}</div>
                     </div>
                   ))}
                 </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                 <div className="md:w-1/2">
                    <p className="text-[10px] font-bold text-[#202124] uppercase mb-4">Terms & Conditions:</p>
                    <p className="text-[9px] text-[#5f6368] whitespace-pre-wrap leading-relaxed opacity-80">{viewingInvoice.notes || "Standard terms apply."}</p>
                 </div>
                 <div className="w-full md:w-1/3 space-y-4">
                    <div className="flex justify-between text-[10px] font-semibold text-[#bdc1c6] uppercase tracking-widest">
                       <span>Subtotal</span>
                       <span>{viewingInvoice.items.reduce((s,i) => s + (i.quantity*i.unitPrice), 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-semibold text-[#bdc1c6] uppercase tracking-widest">
                       <span>Tax (16%)</span>
                       <span>{(viewingInvoice.total - (viewingInvoice.items.reduce((s,i) => s + (i.quantity*i.unitPrice), 0) - viewingInvoice.discountAmount)).toLocaleString()}</span>
                    </div>
                    <div className="bg-[#074a8d] text-white p-6 rounded-2xl flex justify-between items-center shadow-xl">
                       <span className="text-[10px] font-bold uppercase">Total Due</span>
                       <span className="text-2xl font-bold tabular-nums">PKR {viewingInvoice.total.toLocaleString()}</span>
                    </div>
                    <div className="pt-8 text-right flex flex-col gap-3">
                       <button onClick={() => exportInvoicePDF(viewingInvoice)} className="bg-[#202124] text-white px-8 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg hover:bg-black transition-all">Download PDF</button>
                       <button onClick={() => { if(window.confirm("Permanently delete this invoice?")) { onDeleteInvoice(viewingInvoice.id); setViewingInvoice(null); } }} className="text-[#EA4335] font-bold text-[10px] uppercase tracking-widest hover:underline text-center">Delete Manually</button>
                    </div>
                 </div>
              </div>

              <div className="flex justify-end pt-20">
                 <div className="text-right">
                    <div className="h-0.5 w-56 bg-[#dadce0] mb-3"></div>
                    <p className="text-[10px] font-bold text-[#202124] uppercase tracking-widest">Authorized Signature</p>
                 </div>
              </div>
            </div>
            
            {/* Geometric Footer mirror slant */}
            <div className="h-8 bg-[#074a8d] w-full mt-auto relative overflow-hidden">
               <div className="absolute inset-y-0 left-0 w-64 bg-white transform -skew-x-[25deg] -translate-x-32"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
