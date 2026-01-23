
import React, { useState } from 'react';
import { Staff, Transaction, TransactionType } from '../types';
import { jsPDF } from 'jspdf';

interface StaffProps {
  staff: Staff[];
  onAddStaff: (s: Staff) => void;
  onAddTransaction: (t: Transaction) => void;
}

const StaffView: React.FC<StaffProps> = ({ staff, onAddStaff, onAddTransaction }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', pay: '', department: 'CREATIVE' });

  const exportStaffPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(234, 67, 53); // Google Red
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255);
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
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white p-10 rounded-[2rem] border-l-[12px] border-[#EA4335] shadow-xl gap-8">
        <div>
          <h2 className="text-4xl font-medium text-[#202124] tracking-tighter uppercase leading-none">Human Resources</h2>
          <p className="text-[#5f6368] font-medium text-sm uppercase tracking-widest mt-2">Team Allocation & Stipends</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={exportStaffPDF}
             className="bg-white border-2 border-[#EA4335] text-[#EA4335] px-8 py-4 rounded-xl font-medium text-xs tracking-widest uppercase"
           >
             Export PDF
           </button>
           <button 
             onClick={processPayroll}
             className="bg-[#EA4335] text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:bg-[#c5221f] transition-all text-xs tracking-widest uppercase"
           >
             Release Payroll
           </button>
           <button 
             onClick={() => setShowModal(true)} 
             className="bg-[#202124] text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:bg-black transition-all text-xs tracking-widest uppercase"
           >
             Onboard
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {staff.length === 0 ? (
          <div className="col-span-full py-40 text-center text-[#bdc1c6] font-medium uppercase tracking-[0.4em]">Team Directory Empty</div>
        ) : (
          staff.map(s => (
            <div key={s.id} className="bg-white p-8 rounded-[2rem] border border-[#dadce0] google-shadow hover:bg-slate-50 transition-colors group">
               <div className="flex justify-between items-start mb-10">
                  <div className="w-16 h-16 bg-[#fce8e6] rounded-2xl flex items-center justify-center text-3xl group-hover:bg-[#EA4335] group-hover:text-white transition-colors shadow-inner">👤</div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-widest shadow-sm ${s.status === 'ACTIVE' ? 'bg-[#e6f4ea] text-[#34A853]' : 'bg-[#fce8e6] text-[#EA4335]'}`}>
                    {s.status}
                  </span>
               </div>
               <h3 className="text-2xl font-medium text-[#202124] uppercase tracking-tight leading-none mb-2">{s.name}</h3>
               <div className="flex items-center gap-2">
                 <span className="text-[10px] font-semibold text-[#5f6368] uppercase tracking-widest">{s.designation}</span>
                 <span className="w-1 h-1 bg-[#dadce0] rounded-full"></span>
                 <span className="text-[10px] font-semibold text-[#EA4335] uppercase tracking-widest">{s.department}</span>
               </div>
               <div className="mt-10 pt-8 border-t border-[#f1f3f4] flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-semibold text-[#bdc1c6] uppercase tracking-widest mb-1">Stipend Allocation</p>
                    <p className="text-xl font-semibold text-[#202124] tracking-tight">{formatSimple(s.salary)}</p>
                  </div>
                  <button className="text-[10px] font-semibold uppercase tracking-widest text-[#4285F4] hover:underline">View File</button>
               </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#202124]/80 backdrop-blur-md z-[200] flex items-center justify-center p-8">
           <div className="bg-white rounded-3xl w-full max-w-xl p-12 shadow-2xl border-t-[16px] border-[#EA4335] animate-in slide-in-from-bottom-10">
              <h3 className="text-3xl font-medium uppercase tracking-tighter text-[#202124] mb-10">New Team Registration</h3>
              <form onSubmit={handleSubmit} className="space-y-8">
                 <div className="space-y-4">
                    <label className="text-[11px] font-semibold uppercase text-[#5f6368] tracking-widest">Full Name (Legal)</label>
                    <input required className="w-full p-5 bg-[#f8f9fa] border border-[#dadce0] focus:border-[#EA4335] rounded-xl outline-none font-medium text-sm uppercase transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <label className="text-[11px] font-semibold uppercase text-[#5f6368] tracking-widest">Official Role</label>
                      <input required className="w-full p-5 bg-[#f8f9fa] border border-[#dadce0] focus:border-[#EA4335] rounded-xl outline-none font-medium text-sm uppercase transition-all" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[11px] font-semibold uppercase text-[#5f6368] tracking-widest">Unit</label>
                      <select required className="w-full p-5 bg-[#f8f9fa] border border-[#dadce0] focus:border-[#EA4335] rounded-xl outline-none font-medium text-sm uppercase transition-all" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                         <option value="CREATIVE">CREATIVE</option>
                         <option value="TECH">TECH</option>
                         <option value="FINANCE">FINANCE</option>
                         <option value="SALES">SALES</option>
                         <option value="MANAGEMENT">MANAGEMENT</option>
                      </select>
                   </div>
                 </div>
                 <div className="space-y-4">
                    <label className="text-[11px] font-semibold uppercase text-[#5f6368] tracking-widest">Monthly Allocation (RS)</label>
                    <input required type="number" className="w-full p-5 bg-[#f8f9fa] border border-[#dadce0] rounded-xl outline-none font-medium text-sm transition-all" value={formData.pay} onChange={e => setFormData({...formData, pay: e.target.value})} />
                 </div>
                 <div className="flex gap-6 pt-10">
                    <button type="button" onClick={() => setShowModal(false)} className="px-8 py-5 font-semibold text-[#5f6368] uppercase text-xs tracking-widest hover:bg-[#f1f3f4] rounded-xl transition-colors">Abort</button>
                    <button type="submit" className="flex-1 bg-[#202124] text-white rounded-xl py-5 font-medium uppercase text-xs tracking-widest shadow-xl hover:bg-black transition-transform active:scale-95">Complete Registration</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default StaffView;
