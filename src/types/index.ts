export interface User {
  id: string;
  email: string;
  password: string;
  role: 'superadmin' | 'comerciante' | 'caixa';
  name: string;
  merchantId?: string;
}

export interface Merchant {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  createdAt: string;
  totalClients: number;
  totalDebt: number;
}

export interface Client {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  address: string;
  creditLimit: number;
  currentDebt: number;
  paymentStatus: 'em_dia' | 'vencido' | 'a_vencer';
  lastPayment: string;
  createdAt: string;
  merchantId: string;
}

export interface CreditRecord {
  id: string;
  clientId: string;
  amount: number;
  description: string;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  createdAt: string;
  paidAt?: string;
}
