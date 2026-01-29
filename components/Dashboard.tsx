
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction, Invoice, TransactionType, Staff, Project, Lead } from '../types';

interface DashboardProps {
  transactions: Transaction[];
  invoices: Invoice[];
  staff: Staff[];
  projects: Project[];
  leads: Lead[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, invoices, staff, projects, leads }) => {
  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
    const totalInvoiced = invoices.reduce((sum, i) => sum + i.total, 0);
    const totalCollected = invoices.reduce((sum, i) => sum + i.advancePayment + i.paidAmount, 0);
    const totalOutstanding = totalInvoiced - totalCollected;
    
    const activeProjects = projects.filter(p => p.status === 'ACTIVE').length;
    const pipelineValue = leads.filter(l => l.status !== 'WON' && l.status !== 'LOST').reduce((sum, l) => sum + l.value, 0);
    
    return { income, expenses, totalOutstanding, activeProjects, pipelineValue };
  }, [transactions, invoices, projects, leads]);

  const kpis = [
    { label: 'Active Projects', value: stats.activeProjects, color: '#202124', border: 'border-black' },
    { label: 'Pipeline Value', value: `RS ${stats.pipelineValue.toLocaleString()}`, color: '#4285F4', border: 'border-[#4285F4]' },
    { label: 'Outstanding Receivables', value: `RS ${stats.totalOutstanding.toLocaleString()}`, color: '#EA4335', border: 'border-[#EA4335]' },
    { label: 'Agency Headcount', value: staff.length, color: '#34A853', border: 'border-[#34A853]' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 md:p-12 rounded-[2.5rem] border border-[#dadce0] shadow-sm gap-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#202124] tracking-tight uppercase leading-none">Intelligence Hub</h2>
          <p className="text-[#4285F4] font-semibold text-[10px] uppercase tracking-[0.3em] mt-2">Executive Summary & Stream Data</p>
        </div>
        <div className="flex items-center gap-4 bg-[#f8f9fa] px-6 py-3 rounded-2xl border border-[#dadce0]">
           <span className="text-[10px] font-bold text-[#5f6368] uppercase tracking-widest">Global Status:</span>
           <span className="text-[10px] font-bold text-[#34A853] uppercase tracking-widest">Optimal</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {kpis.map((card, i) => (
          <div key={i} className={`p-10 bg-white rounded-[2rem] border-t-8 ${card.border} shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg`}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#bdc1c6] mb-4">{card.label}</p>
            <p className="text-2xl md:text-3xl font-serif font-bold tracking-tighter" style={{ color: card.color }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-[#dadce0] shadow-sm">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-[10px] font-bold text-[#202124] uppercase tracking-[0.3em]">Capital Velocity</h3>
            <div className="flex gap-3">
               <div className="flex items-center gap-2"><div className="w-2 h-2 bg-[#4285F4] rounded-full"></div><span className="text-[9px] font-bold uppercase text-[#5f6368]">Growth</span></div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { name: 'WK 1', val: 4000 },
                { name: 'WK 2', val: 3200 },
                { name: 'WK 3', val: 5100 },
                { name: 'WK 4', val: 8200 },
              ]}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f3f4" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#bdc1c6', fontSize: 9, fontWeight: '700'}} />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="val" stroke="#202124" fill="#202124" fillOpacity={0.03} strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#fcfdfe] border border-[#dadce0] rounded-[2.5rem] p-10 flex flex-col gap-10">
           <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#4285F4]">Prioritized Flow</h3>
           <div className="space-y-6">
              {projects.length === 0 ? (
                <div className="py-12 text-center opacity-30 text-[9px] font-bold uppercase tracking-widest">No Active Workload</div>
              ) : (
                projects.slice(0, 3).map((p, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-[#dadce0] shadow-sm flex flex-col gap-3 hover:border-black transition-colors">
                     <p className="text-[9px] font-bold text-[#bdc1c6] uppercase tracking-widest">{p.clientName}</p>
                     <p className="text-sm font-bold text-[#202124] uppercase tracking-tight leading-tight">{p.title}</p>
                     <div className="w-full bg-[#f1f3f4] h-1.5 rounded-full mt-3">
                        <div className="bg-[#202124] h-full rounded-full" style={{ width: `${p.progress}%` }}></div>
                     </div>
                  </div>
                ))
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
