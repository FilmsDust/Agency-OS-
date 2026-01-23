
import React, { useState } from 'react';
import { Staff, Transaction, TransactionType } from '../types';

interface StaffProps {
  staff: Staff[];
  onAddStaff: (s: Staff) => void;
  onAddTransaction: (t: Transaction) => void;
}

const StaffView: React.FC<StaffProps> = ({ staff, onAddStaff, onAddTransaction }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', pay: '', department: 'CREATIVE' });

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
     if (!window.confirm("ARE YOU SURE YOU WANT TO DISBURSE PAYROLL FOR ALL ACTIVE MEMBERS?")) return;
     staff.forEach(s => {
       if (s.status === 'ACTIVE') {
         onAddTransaction({
           id: Math.random().toString(36).substr(2, 9),
           description: `PAYROLL DISBURSEMENT: ${s.name}`,
           amount: s.salary,
           type: TransactionType.EXPENSE,
           date: new Date().toLocaleDateString('en-GB'),
           category: 'PAYROLL'
         });
       }
     });
     alert("PAYROLL PROCESSED SUCCESSFULLY");
  };

  const formatSimple = (val: number) => `RS ${val.toFixed(0)}`;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white p-10 rounded-[2.5rem] border-l-[12px] border-yellow-500 shadow-sm gap-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">HR & PAYROLL</h2>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest mt-1">STAFFING AND SALARY LIABILITIES</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={processPayroll}
             className="bg-red-500 text-white px-8 py-5 rounded-2xl font-black shadow-xl hover:scale-105 transition-all text-xs tracking-widest uppercase"
           >
             RUN PAYROLL
           </button>
           <button 
             onClick={() => setShowModal(true)} 
             className="bg-slate-900 text-white px-8 py-5 rounded-2xl font-black shadow-xl hover:scale-105 transition-all text-xs tracking-widest uppercase"
           >
             NEW HIRE
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {staff.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-300 font-black uppercase tracking-widest text-xs">TEAM LIST EMPTY</div>
        ) : (
          staff.map(s => (
            <div key={s.id} className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all border border-slate-50 group">
               <div className="flex justify-between items-start mb-10">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-blue-50 transition-colors">👤</div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${s.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {s.status}
                  </span>
               </div>
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{s.name}</h3>
               <div className="flex items-center gap-2 mt-2">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.designation}</span>
                 <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                 <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{s.department}</span>
               </div>
               <div className="mt-10 pt-8 border-t border-slate-50 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">CONTRACT PAY</p>
                    <p className="text-xl font-black text-slate-900 tracking-tight">{formatSimple(s.salary)}</p>
                  </div>
                  <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors">VIEW PROFILE</button>
               </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[200] flex items-center justify-center p-8">
           <div className="bg-white rounded-[3rem] w-full max-w-xl p-16 shadow-2xl">
              <h3 className="text-2xl font-black uppercase text-slate-900 mb-12 border-b-8 border-yellow-500 inline-block pb-3">STAFF ONBOARDING</h3>
              <form onSubmit={handleSubmit} className="space-y-8">
                 <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">MEMBER FULL NAME</label>
                    <input required className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-black text-sm uppercase" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">WORK DESIGNATION</label>
                      <input required className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-black text-sm uppercase" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">DEPARTMENT</label>
                      <select required className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-black text-sm uppercase" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                         <option value="CREATIVE">CREATIVE</option>
                         <option value="TECH">TECH</option>
                         <option value="FINANCE">FINANCE</option>
                         <option value="SALES">SALES</option>
                         <option value="MANAGEMENT">MANAGEMENT</option>
                      </select>
                   </div>
                 </div>
                 <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">MONTHLY STIPEND RS</label>
                    <input required type="number" className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-black text-sm" value={formData.pay} onChange={e => setFormData({...formData, pay: e.target.value})} />
                 </div>
                 <div className="flex gap-8 pt-8">
                    <button type="button" onClick={() => setShowModal(false)} className="px-8 py-5 font-black text-slate-400 uppercase text-xs tracking-widest">ABANDON</button>
                    <button type="submit" className="flex-1 bg-slate-900 text-white rounded-2xl py-5 font-black uppercase text-xs tracking-widest shadow-2xl">REGISTER TEAM</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default StaffView;
