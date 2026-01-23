
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Invoices from './components/Invoices';
import Reports from './components/Reports';
import Proposals from './components/Proposals';
import StaffView from './components/Staff';
import ClientsView from './components/Clients';
import AssistantView from './components/Assistant';
import TransactionsView from './components/Transactions';
import { View, Transaction, Invoice, Staff, Client } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('DASHBOARD');
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('ag_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('ag_invoices');
    return saved ? JSON.parse(saved) : [];
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('ag_clients');
    return saved ? JSON.parse(saved) : [];
  });

  const [staff, setStaff] = useState<Staff[]>(() => {
    const saved = localStorage.getItem('ag_staff');
    return saved ? JSON.parse(saved) : [];
  });

  const [proposals, setProposals] = useState<any[]>(() => {
    const saved = localStorage.getItem('ag_proposals');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ag_transactions', JSON.stringify(transactions));
    localStorage.setItem('ag_invoices', JSON.stringify(invoices));
    localStorage.setItem('ag_clients', JSON.stringify(clients));
    localStorage.setItem('ag_staff', JSON.stringify(staff));
    localStorage.setItem('ag_proposals', JSON.stringify(proposals));
  }, [transactions, invoices, clients, staff, proposals]);

  const renderContent = () => {
    switch (currentView) {
      case 'DASHBOARD': return <Dashboard transactions={transactions} invoices={invoices} staff={staff} />;
      case 'INVOICES': return <Invoices invoices={invoices} clients={clients} onAddInvoice={(i) => setInvoices([i, ...invoices])} onMarkAsPaid={() => {}} />;
      case 'CLIENTS': return <ClientsView clients={clients} onAddClient={(c) => setClients([c, ...clients])} />;
      case 'STAFF': return <StaffView staff={staff} onAddStaff={(s) => setStaff([s, ...staff])} onAddTransaction={(t) => setTransactions([t, ...transactions])} />;
      case 'TRANSACTIONS': return <TransactionsView transactions={transactions} onAddTransaction={(t) => setTransactions([t, ...transactions])} />;
      case 'PROPOSALS': return <Proposals proposals={proposals} onAddProposal={(p) => setProposals([p, ...proposals])} />;
      case 'REPORTS': return <Reports transactions={transactions} invoices={invoices} />;
      case 'ASSISTANT': return <AssistantView transactions={transactions} invoices={invoices} />;
      default: return <Dashboard transactions={transactions} invoices={invoices} staff={staff} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      <main className="flex-1 lg:ml-72 p-10 lg:p-20">
        <header className="mb-20 flex justify-between items-baseline no-print">
          <div>
            <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-[0.4em]">ADVERTSGEN OPERATIONAL OS</span>
            <h2 className="text-4xl font-medium text-slate-900 tracking-tight mt-3">{currentView.replace('_', ' ')}</h2>
          </div>
          <div className="flex items-center gap-6 hidden md:flex">
             <div className="px-8 py-4 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">CLOUD SYNC</p>
                  <p className="text-[11px] font-medium text-slate-900 uppercase">OPERATIONAL</p>
                </div>
             </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
