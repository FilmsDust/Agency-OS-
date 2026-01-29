
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  category: 'PROJECT' | 'PAYROLL' | 'OFFICE' | 'PETTY_CASH' | 'MARKETING' | 'TAX' | 'EQUIPMENT' | 'VENDOR_PURCHASE';
  projectId?: string;
  entityName?: string;
  receiptImage?: string;
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED'
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  status: InvoiceStatus;
  taxRate: number;
  discountAmount: number;
  advancePayment: number;
  paidAmount: number;
  total: number;
  currency: 'PKR' | 'USD';
  notes?: string;
  signature?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  industry: string;
  totalBilled: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Product {
  id: string;
  name: string;
  basePrice: number;
  category: string;
}

export interface Staff {
  id: string;
  name: string;
  designation: string;
  department: 'CREATIVE' | 'TECH' | 'FINANCE' | 'SALES' | 'MANAGEMENT';
  salary: number;
  joiningDate: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'EXITED';
  paymentHistory: { month: string; amount: number; date: string }[];
}

export interface Project {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  budget: number;
  status: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED';
  progress: number;
  deadline: string;
}

export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  value: number;
  status: 'NEW' | 'CONTACTED' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST';
  source: string;
  dateAdded: string;
}

export interface ProposalSection {
  title: string;
  content: string;
  type: 'SUMMARY' | 'TIMELINE' | 'PRICING' | 'TERMS';
}

export interface Proposal {
  id: string;
  clientName: string;
  clientIndustry: string;
  projectTitle: string;
  duration: string;
  templateType: 'STARTER' | 'GROWTH' | 'ENTERPRISE';
  sections: ProposalSection[];
  date: string;
  quoteNo: string;
  totalAmount: number;
  advanceAmount: number;
}

export interface AgencySettings {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  bankDetails: string;
  gstNumber: string;
}

export type View = 'DASHBOARD' | 'CRM' | 'PROJECTS' | 'INVOICES' | 'TRANSACTIONS' | 'REPORTS' | 'PROPOSALS' | 'STAFF' | 'CLIENTS' | 'ASSISTANT' | 'SETTINGS' | 'PRODUCTS';
