
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Invoices from './components/Invoices';
import Reports from './components/Reports';
import Proposals from './components/Proposals';
import StaffView from './components/Staff';
import ClientsView from './components/Clients';
import AssistantView from './components/Assistant';
import SettingsView from './components/Settings';
import ProductsView from './components/Products';
import PurchaseRecords from './components/PurchaseRecords';
import CRMView from './components/CRM';
import ProjectsView from './components/Projects';
import { View, Transaction, Invoice, Staff, Client, Proposal, TransactionType, InvoiceStatus, Product, Lead, Project } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('DASHBOARD');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  
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

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('ag_products');
    return saved ? JSON.parse(saved) : [];
  });

  const [staff, setStaff] = useState<Staff[]>(() => {
    const saved = localStorage.getItem('ag_staff');
    return saved ? JSON.parse(saved) : [];
  });

  const [proposals, setProposals] = useState<Proposal[]>(() => {
    const saved = localStorage.getItem('ag_proposals');
    return saved ? JSON.parse(saved) : [];
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('ag_leads');
    return saved ? JSON.parse(saved) : [];
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('ag_projects');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ag_transactions', JSON.stringify(transactions));
    localStorage.setItem('ag_invoices', JSON.stringify(invoices));
    localStorage.setItem('ag_clients', JSON.stringify(clients));
    localStorage.setItem('ag_staff', JSON.stringify(staff));
    localStorage.setItem('ag_proposals', JSON.stringify(proposals));
    localStorage.setItem('ag_products', JSON.stringify(products));
    localStorage.setItem('ag_leads', JSON.stringify(leads));
    localStorage.setItem('ag_projects', JSON.stringify(projects));
  }, [transactions, invoices, clients, staff, proposals, products, leads, projects]);

  const handleAddTransaction = useCallback((t: Transaction) => {
    setTransactions(prev => [t, ...prev]);
  }, []);

  const handleDeleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleAddInvoice = useCallback((i: Invoice) => {
    setInvoices(prev => [i, ...prev]);
  }, []);

  const handleDeleteInvoice = useCallback((id: string) => {
    if (!window.confirm("Permanently delete this invoice? Related payments in ledger will remain.")) return;
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  }, []);

  const handleAddClient = useCallback((c: Client) => {
    setClients(prev => [c, ...prev]);
  }, []);

  const handleBillClient = useCallback((clientId: string) => {
    setSelectedClientId(clientId);
    setCurrentView('INVOICES');
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedClientId(null);
  }, []);

  const handleMarkAsPaid = useCallback((id: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === id && inv.status !== InvoiceStatus.PAID) {
        const paymentTx: Transaction = {
          id: Math.random().toString(36).substr(2, 9),
          description: `PAYMENT RECEIVED: ${inv.clientName} (${inv.invoiceNumber})`,
          amount: inv.total,
          type: TransactionType.INCOME,
          date: new Date().toLocaleDateString('en-GB'),
          category: 'PROJECT'
        };
        handleAddTransaction(paymentTx);

        setClients(prevClients => prevClients.map(c => 
          c.id === inv.clientId ? { ...c, totalBilled: c.totalBilled + inv.total } : c
        ));

        return { ...inv, status: InvoiceStatus.PAID, paidAmount: inv.total };
      }
      return inv;
    }));
  }, [handleAddTransaction]);

  const handleConvertToInvoice = useCallback((proposal: Proposal) => {
    const client = clients.find(c => c.name === proposal.clientName);
    const newInvoice: Invoice = {
      id: Math.random().toString(36).substr(2, 9),
      invoiceNumber: `AG-INV-${invoices.length + 3001}`,
      clientId: client?.id || '',
      clientName: proposal.clientName,
      clientEmail: client?.email || '',
      date: new Date().toLocaleDateString('en-GB'),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'),
      items: [{ id: '1', description: proposal.projectTitle, quantity: 1, unitPrice: proposal.totalAmount }],
      status: InvoiceStatus.SENT,
      taxRate: 16,
      discountAmount: 0,
      advancePayment: proposal.advanceAmount,
      paidAmount: 0,
      total: proposal.totalAmount + (proposal.totalAmount * 0.16),
      currency: 'PKR',
      notes: `Generated from Quote: ${proposal.quoteNo}`
    };
    handleAddInvoice(newInvoice);
    setCurrentView('INVOICES');
  }, [clients, invoices.length, handleAddInvoice]);

  const renderContent = () => {
    switch (currentView) {
      case 'DASHBOARD': return <Dashboard transactions={transactions} invoices={invoices} staff={staff} projects={projects} leads={leads} />;
      case 'CRM': return <CRMView leads={leads} setLeads={setLeads} onConvertToClient={handleAddClient} />;
      case 'PROJECTS': return <ProjectsView projects={projects} setProjects={setProjects} clients={clients} />;
      case 'INVOICES': return (
        <Invoices 
          invoices={invoices} 
          clients={clients} 
          products={products} 
          onAddInvoice={handleAddInvoice} 
          onMarkAsPaid={handleMarkAsPaid} 
          onDeleteInvoice={handleDeleteInvoice} 
          onAddClient={handleAddClient} 
          initialClientId={selectedClientId}
          onClearSelection={handleClearSelection}
        />
      );
      case 'CLIENTS': return (
        <ClientsView 
          clients={clients} 
          projects={projects}
          invoices={invoices}
          onAddClient={handleAddClient} 
          onBillClient={handleBillClient}
          onDeleteClient={(id) => setClients(prev => prev.filter(c => c.id !== id))} 
        />
      );
      case 'STAFF': return <StaffView staff={staff} onAddStaff={(s) => setStaff([s, ...staff])} onAddTransaction={handleAddTransaction} onDeleteStaff={(id) => setStaff(prev => prev.filter(s => s.id !== id))} />;
      case 'TRANSACTIONS': return <PurchaseRecords onAddTransaction={handleAddTransaction} onDeleteTransaction={handleDeleteTransaction} />;
      case 'PROPOSALS': return <Proposals proposals={proposals} onAddProposal={(p) => setProposals([p, ...proposals])} onDeleteProposal={(id) => setProposals(prev => prev.filter(p => p.id !== id))} onConvertToInvoice={handleConvertToInvoice} />;
      case 'REPORTS': return <Reports transactions={transactions} invoices={invoices} staff={staff} />;
      case 'ASSISTANT': return <AssistantView transactions={transactions} invoices={invoices} />;
      case 'SETTINGS': return <SettingsView />;
      case 'PRODUCTS': return <ProductsView products={products} setProducts={setProducts} />;
      default: return <Dashboard transactions={transactions} invoices={invoices} staff={staff} projects={projects} leads={leads} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f1f3f4]">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      <main className="flex-1 lg:ml-64 p-4 sm:p-8 md:p-12 lg:p-16 overflow-x-hidden min-h-screen flex flex-col">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-6">
             <div className="w-1.5 h-12 md:h-16 bg-[#202124] rounded-full hidden sm:block"></div>
             <div>
               <span className="text-[10px] font-semibold text-[#4285F4] uppercase tracking-[0.25em] block mb-2">AdvertsGen Hub</span>
               <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#202124] tracking-tight uppercase leading-none">{currentView.replace('_', ' ')}</h2>
             </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto w-full flex-1">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
