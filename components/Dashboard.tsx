
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction, Invoice, TransactionType, Staff } from '../types';

interface DashboardProps {
  transactions: Transaction[];
  invoices: Invoice[];
  staff: Staff[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, invoices, staff }) => {
  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
    const totalInvoiced = invoices.reduce((sum, i) => sum + i.total, 0);
    const totalCollected = invoices.reduce((sum, i) => sum + i.advancePayment + i.paidAmount, 0);
    const totalOutstanding = totalInvoiced - totalCollected;
    const salaryLiability = staff.filter(s => s.status === 'ACTIVE').reduce((sum, s) => sum + s.salary, 0);
    const netProfit = income - expenses;
    
    return { income, expenses, totalOutstanding, netProfit, salaryLiability };
  }, [transactions, invoices, staff]);

  const chartData = useMemo(() => {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'];
    return months.map((name) => ({
      name,
      revenue: Math.floor(Math.random() * 900000),
      burn: Math.floor(Math.random() * 500000)
    }));
  }, []);

  const formatSimple = (val: number) => `RS ${val.toFixed(0)}`;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Top Level Summary */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center bg-white p-12 rounded-[3rem] border-l-[16px] border-blue-600 shadow-xl gap-8">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">AGENCY SOLVENCY</h2>
          <p className="text-slate-400 font-bold text-[12px] uppercase tracking-[0.4em] mt-2">REAL TIME OPERATIONAL METRICS</p>
        </div>
        <div className="flex gap-12 text-right">
           <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">GROSS PROFIT</p>
              <p className={`text-4xl font-black tracking-tighter ${stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatSimple(stats.netProfit)}
              </p>
           </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'RECEIVABLES', value: stats.totalOutstanding, color: 'text-blue-600', border: 'border-b-8 border-blue-600' },
          { label: 'SALARY PAYABLE', value: stats.salaryLiability, color: 'text-amber-500', border: 'border-b-8 border-amber-500' },
          { label: 'TOTAL REVENUE', value: stats.income, color: 'text-emerald-600', border: 'border-b-8 border-emerald-600' },
          { label: 'CASH BURN', value: stats.expenses, color: 'text-red-500', border: 'border-b-8 border-red-500' },
        ].map((card, i) => (
          <div key={i} className={`p-10 bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all ${card.border} group`}>
            <p className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 group-hover:text-slate-600 transition-colors">{card.label}</p>
            <p className={`text-2xl font-black ${card.color} tracking-tighter`}>
              {formatSimple(card.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.5em]">CASH FLOW VELOCITY</h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">INCOME</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">EXPENSE</span>
               </div>
            </div>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: '900'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: '700'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', fontFamily: 'Poppins', fontWeight: 'bold' }} 
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" fillOpacity={1} fill="url(#colorRev)" strokeWidth={6} />
                <Area type="monotone" dataKey="burn" stroke="#ef4444" fillOpacity={0} strokeWidth={3} strokeDasharray="10 10" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl flex flex-col justify-between">
           <div>
              <h3 className="text-[14px] font-black uppercase tracking-[0.4em] mb-10 text-blue-400">FINANCIAL ALERTS</h3>
              <div className="space-y-6">
                 {[
                   { msg: '3 INVOICES OVERDUE', type: 'WARN' },
                   { msg: 'PAYROLL PROCESSING IN 4 DAYS', type: 'INFO' },
                   { msg: 'MARKETING BUDGET EXCEEDED', type: 'CRIT' }
                 ].map((alert, i) => (
                   <div key={i} className="flex items-start gap-4 p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                      <div className={`w-2 h-10 rounded-full ${alert.type === 'CRIT' ? 'bg-red-500' : alert.type === 'WARN' ? 'bg-amber-400' : 'bg-blue-400'}`}></div>
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">{alert.type} ALERT</p>
                        <p className="text-[12px] font-bold mt-1">{alert.msg}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           <button className="w-full bg-blue-600 py-5 rounded-2xl font-black text-xs tracking-[0.3em] uppercase shadow-xl hover:scale-[1.02] transition-all">VIEW ALL NOTIFICATIONS</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
