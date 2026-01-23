
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction, Invoice, TransactionType, Staff } from '../types';
import { jsPDF } from 'jspdf';

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
      revenue: Math.floor(Math.random() * 500000 + 200000),
      burn: Math.floor(Math.random() * 200000 + 100000)
    }));
  }, []);

  const formatCurrency = (val: number) => `RS ${val.toLocaleString()}`;

  const exportSummaryPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(66, 133, 244); // Google Blue
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("ADVERTSGEN EXECUTIVE SUMMARY", 20, 25);
    
    doc.setTextColor(32, 33, 36);
    doc.setFontSize(14);
    doc.text("FINANCIAL POSITION", 20, 60);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Revenue: ${formatCurrency(stats.income)}`, 20, 75);
    doc.text(`Total Expenses: ${formatCurrency(stats.expenses)}`, 20, 85);
    doc.text(`Net Profit: ${formatCurrency(stats.netProfit)}`, 20, 95);
    doc.text(`Accounts Receivable: ${formatCurrency(stats.totalOutstanding)}`, 20, 105);
    doc.text(`Payroll Liability: ${formatCurrency(stats.salaryLiability)}`, 20, 115);
    
    doc.setDrawColor(218, 220, 224);
    doc.line(20, 125, 190, 125);
    
    doc.setFont("helvetica", "bold");
    doc.text("Generated on: " + new Date().toLocaleString(), 20, 140);
    
    doc.save("AdvertsGen_Summary.pdf");
  };

  const kpis = [
    { label: 'Receivables', value: stats.totalOutstanding, color: '#4285F4', border: 'border-[#4285F4]' },
    { label: 'Salary Payable', value: stats.salaryLiability, color: '#FBBC05', border: 'border-[#FBBC05]' },
    { label: 'Total Revenue', value: stats.income, color: '#34A853', border: 'border-[#34A853]' },
    { label: 'Cash Burn', value: stats.expenses, color: '#EA4335', border: 'border-[#EA4335]' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-xl border-l-[12px] border-[#4285F4] google-shadow flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-3xl font-medium text-[#202124] tracking-tight uppercase">Operations Console</h2>
          <p className="text-[#5f6368] font-medium text-sm uppercase tracking-wider mt-1">Global Financial Standing</p>
        </div>
        <button 
          onClick={exportSummaryPDF}
          className="bg-[#4285F4] text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:bg-[#1967d2] transition-colors text-xs tracking-widest uppercase flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Export Summary PDF
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((card, i) => (
          <div key={i} className={`p-8 bg-white rounded-xl border-b-8 ${card.border} google-shadow hover:bg-slate-50 transition-colors`}>
            <p className="text-[12px] font-semibold uppercase tracking-wider text-[#5f6368] mb-2">{card.label}</p>
            <p className="text-2xl font-semibold tracking-tight" style={{ color: card.color }}>
              {formatCurrency(card.value)}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-[#dadce0] google-shadow">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-sm font-semibold text-[#202124] uppercase tracking-wider">Growth Velocity</h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-[#34A853] rounded-full"></div>
                 <span className="text-[10px] font-medium text-[#5f6368] uppercase tracking-widest">INCOME</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-[#EA4335] rounded-full"></div>
                 <span className="text-[10px] font-medium text-[#5f6368] uppercase tracking-widest">BURN</span>
               </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34A853" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#34A853" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f4" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#5f6368', fontSize: 11, fontWeight: '500'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#5f6368', fontSize: 11, fontWeight: '500'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontWeight: '500' }} 
                />
                <Area type="monotone" dataKey="revenue" stroke="#34A853" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                <Area type="monotone" dataKey="burn" stroke="#EA4335" fillOpacity={0} strokeWidth={2} strokeDasharray="10 10" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#202124] rounded-xl p-8 text-white shadow-2xl flex flex-col justify-between">
           <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-10 text-[#FBBC05]">Intelligence Feed</h3>
              <div className="space-y-6">
                 {[
                   { msg: 'Invoice #AG-104 is Overdue', type: 'RED' },
                   { msg: 'Monthly Payroll Disburses in 3d', type: 'YELLOW' },
                   { msg: 'New Proposal Request Received', type: 'BLUE' }
                 ].map((alert, i) => (
                   <div key={i} className="flex items-start gap-4 p-5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                      <div className={`w-1.5 h-10 rounded-full ${alert.type === 'RED' ? 'bg-[#EA4335]' : alert.type === 'YELLOW' ? 'bg-[#FBBC05]' : 'bg-[#4285F4]'}`}></div>
                      <p className="text-[12px] font-medium tracking-normal leading-tight">{alert.msg}</p>
                   </div>
                 ))}
              </div>
           </div>
           <button className="w-full bg-[#34A853] py-5 rounded-xl font-medium text-xs tracking-widest uppercase shadow-lg hover:bg-[#2d9249] transition-all mt-10">AI Strategy Hub</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
