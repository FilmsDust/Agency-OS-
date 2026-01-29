
import React, { useState } from 'react';
import { Staff, Transaction, TransactionType } from '../types';
import { jsPDF } from 'jspdf';

interface StaffProps {
  staff: Staff[];
  onAddStaff: (s: Staff) => void;
  onAddTransaction: (t: Transaction) => void;
  onDeleteStaff: (id: string) => void;
}

const StaffView: React.FC<StaffProps> = ({ staff, onAddStaff, onAddTransaction, onDeleteStaff }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', pay: '', department: 'CREATIVE' });

  const exportStaffPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(234, 67, 53); // Google Red
    doc.rect(0, 0, 210, 40, 'F');
    // Fix: Use RGB for grayscale text color to avoid TS errors
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("STAFF & PAYROLL AUDIT", 20, 25);
    
    doc.setTextColor(32, 33, 36);
    doc.setFontSize(10);
    let y = 60;
    doc.text("Member", 20, y);
    doc.text("Designation", 70, y);
    doc.text("Monthly Pay", 140, y);
    doc.text("Status", 180, y);
    y += 10;
    
    doc.setFont("helvetica", "normal");
    staff.forEach(s => {
      doc.text(s.name, 20, y);
      doc.text(s.designation, 70, y);
      doc.text(`RS ${s.salary.toLocaleString()}`, 140, y);
      doc.text(s.status, 180, y);
      y += 10;
    });
    doc.save("AdvertsGen_Staff_Report.pdf");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddStaff({
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      designation: formData.role,
      department: formData.department as any,
      salary: parseFloat(formData.pay) || 0,
      joiningDate: new Date().toLocaleDateString('en-GB'),
      status: 'ACTIVE',
      paymentHistory: []
    });
    setShowModal(false);
    setFormData({ name: '', role: '', pay: '', department: 'CREATIVE' });
  };

  const processPayroll = () => {
     if (!window.confirm("CONFIRM MONTHLY PAYROLL DISBURSEMENT?")) return;
     staff.forEach(s => {
       if (s.status === 'ACTIVE') {
         onAddTransaction({
           id: Math.random().toString(36).substr(2, 9),
           description: `PAYROLL: ${s.name}`,
           amount: s.salary,
           type: TransactionType.EXPENSE,
           date: new Date().toLocaleDateString('en-GB'),
           category: 'PAYROLL'
         });
       }
     });
     alert("PAYROLL CYCLE COMPLETED");
  };

  const formatSimple = (val: number) => `RS ${val.toLocaleString()}`;

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white p-6 md:p-10 rounded-[1.5rem] md:rounded-[2rem] border-l-[8px] md:border-l-[12px] border-[#EA4335] shadow-sm gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-4xl font-medium text-[#202124] tracking-tighter uppercase leading-none">Human Resources</h2>
          <p className="text-[#5f6368] font-medium text-[10px] md:text-sm uppercase tracking-widest mt-2">Team Allocation & Stipends</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
           <button 
             onClick={processPayroll}
             className="flex-1 bg-[#EA4335] text-white px-6 py-3 md:py-4 rounded-xl font-medium shadow-md hover:bg-[#c5221f] transition-all text-xs tracking-widest uppercase"
           >
             Release Payroll
           </button>
           <button 
             onClick={() => setShowModal(true)} 
             className="flex-1 bg-[#202124] text-white px-8 py-3 md:py-4 rounded-xl font-medium shadow-md hover:bg-black transition-all text-xs tracking-widest uppercase"
           >
             Onboard
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {staff.length === 0 ? (
          <div className="col-span-full py-24 text-center text-[#bdc1c6] font-medium uppercase tracking-[0.4em] text-xs">Team Directory currently empty</div>
        ) : (
          staff.map(s => (
            <div key={s.id} className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-[#dadce0] shadow-sm hover:bg-slate-50 transition-colors group relative">
               <button 
                 onClick={() => onDeleteStaff(s.id)} 
                 className="absolute top-4 right-4 text-[#EA4335] opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[#fce8e6] rounded-full"
                 title="Remove Staff"
               >
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
               </button>
               <div className="flex justify-between items-start mb-8">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-[#fce8e6] rounded-2xl flex items-center justify-center text-2xl md:text-3xl group-hover:bg-[#EA4335] group-hover:text-white transition-colors shadow-inner">👤</div>
                  <span className={`px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-semibold uppercase tracking-widest shadow-sm ${s.status === 'ACTIVE' ? 'bg-[#e6f4ea] text-[#34A853]' : 'bg-[#fce8e6] text-[#EA4335]'}`}>
                    {s.status}
                  </span>
               </div>
               <h3 className="text-xl md:text-2xl font-medium text-[#202124] uppercase tracking-tight leading-none mb-2">{s.name}</h3>
               <div className="flex items-center gap-2">
                 <span className="text-[9px] md:text-[10px] font-semibold text-[#5f6368] uppercase tracking-widest">{s.designation}</span>
                 <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                 <span className="text-[9px] md:text-[10px] font-semibold text-[#EA4335] uppercase tracking-widest">{s.department}</span>
               </div>
               <div className="mt-8 pt-6 md:mt-10 md:pt-8 border-t border-[#f1f3f4] flex justify-between items-end">
                  <div>
                    <p className="text-[8px] md:text-[10px] font-semibold text-[#bdc1c6] uppercase tracking-widest mb-1">Stipend Allocation</p>
                    <p className="text-lg md:text-xl font-semibold text-[#202124] tracking-tight">{formatSimple(s.salary)}</p>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#202124]/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 overflow-y-auto">
           <div className="bg-white rounded-3xl w-full max-w-xl p-6 md:p-12 shadow-2xl border-t-[12px] md:border-t-[16px] border-[#EA4335] animate-in slide-in-from-bottom-10 my-auto">
              <h3 className="text-2xl md:text-3xl font-medium uppercase tracking-tighter text-[#202124] mb-8 md:mb-10">New Team Member</h3>
              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                 <div className="space-y-3 md:space-y-4">
                    <label className="text-[10px] md:text-[11px] font-semibold uppercase text-[#5f6368] tracking-widest">Legal Full Name</label>
                    <input required className="w-full p-4 md:p-5 bg-[#f8f9fa] border border-[#dadce0] focus:border-[#EA4335] rounded-xl outline-none font-medium text-sm md:text-base uppercase" placeholder="e.g. Johnathan Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                   <div className="space-y-3 md:space-y-4">
                      <label className="text-[10px] md:text-[11px] font-semibold uppercase text-[#5f6368] tracking-widest">Official Role</label>
                      <input required className="w-full p-4 md:p-5 bg-[#f8f9fa] border border-[#dadce0] focus:border-[#EA4335] rounded-xl outline-none font-medium text-sm md:text-base uppercase" placeholder="e.g. Creative Lead" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
                   </div>
                   <div className="space-y-3 md:space-y-4">
                      <label className="text-[10px] md:text-[11px] font-semibold uppercase text-[#5f6368] tracking-widest">Business Unit</label>
                      <select required className="w-full p-4 md:p-5 bg-[#f8f9fa] border border-[#dadce0] focus:border-[#EA4335] rounded-xl outline-none font-medium text-sm md:text-base uppercase transition-all" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value as any})}>
                         <option value="CREATIVE">CREATIVE</option>
                         <option value="TECH">TECH</option>
                         <option value="FINANCE">FINANCE</option>
                         <option value="SALES">SALES</option>
                         <option value="MANAGEMENT">MANAGEMENT</option>
                      </select>
                   </div>
                 </div>
                 <div className="space-y-3 md:space-y-4">
                    <label className="text-[10px] md:text-[11px] font-semibold uppercase text-[#5f6368] tracking-widest">Monthly Allocation (PKR)</label>
                    <input required type="number" className="w-full p-4 md:p-5 bg-[#f8f9fa] border border-[#dadce0] rounded-xl outline-none font-medium text-sm md:text-base" placeholder="e.g. 150000" value={formData.pay} onChange={e => setFormData({...formData, pay: e.target.value})} />
                 </div>
                 <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6 md:pt-10">
                    <button type="button" onClick={() => setShowModal(false)} className="px-8 py-4 font-semibold text-[#5f6368] uppercase text-[10px] md:text-xs tracking-widest hover:bg-[#f1f3f4] rounded-xl transition-colors">Discard</button>
                    <button type="submit" className="flex-1 bg-[#202124] text-white rounded-xl py-4 font-medium uppercase text-[10px] md:text-xs tracking-widest shadow-xl hover:bg-black active:scale-95">Complete Registration</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default StaffView;
