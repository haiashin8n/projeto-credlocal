import { faker } from '@faker-js/faker';
import { User, Merchant, Client, CreditRecord } from '../types';

// Usuários fictícios
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@sistema.com',
    password: 'admin123',
    role: 'superadmin',
    name: 'Super Administrador'
  },
  {
    id: '2',
    email: 'comerciante@loja.com',
    password: 'comerciante123',
    role: 'comerciante',
    name: 'João Silva',
    merchantId: '1'
  },
  {
    id: '3',
    email: 'caixa@loja.com',
    password: 'caixa123',
    role: 'caixa',
    name: 'Maria Santos',
    merchantId: '1'
  }
];

// Comerciantes fictícios
export const mockMerchants: Merchant[] = Array.from({ length: 8 }, (_, i) => ({
  id: (i + 1).toString(),
  name: faker.company.name(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  address: faker.location.streetAddress(),
  status: faker.helpers.arrayElement(['active', 'inactive']),
  createdAt: faker.date.past().toISOString(),
  totalClients: faker.number.int({ min: 5, max: 150 }),
  totalDebt: parseFloat(faker.finance.amount({ min: 1000, max: 50000, dec: 2 }))
}));

// Clientes fictícios
export const mockClients: Client[] = Array.from({ length: 25 }, (_, i) => {
  const currentDebt = parseFloat(faker.finance.amount({ min: 0, max: 2000, dec: 2 }));
  const creditLimit = parseFloat(faker.finance.amount({ min: 500, max: 5000, dec: 2 }));
  
  return {
    id: (i + 1).toString(),
    name: faker.person.fullName(),
    cpf: faker.helpers.fromRegExp(/[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}/),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    creditLimit,
    currentDebt,
    paymentStatus: currentDebt === 0 ? 'em_dia' : faker.helpers.arrayElement(['em_dia', 'vencido', 'a_vencer']),
    lastPayment: faker.date.recent().toISOString(),
    createdAt: faker.date.past().toISOString(),
    merchantId: '1'
  };
});

// Registros de crédito fictícios
export const mockCreditRecords: CreditRecord[] = Array.from({ length: 50 }, (_, i) => ({
  id: (i + 1).toString(),
  clientId: faker.helpers.arrayElement(mockClients).id,
  amount: parseFloat(faker.finance.amount({ min: 50, max: 1000, dec: 2 })),
  description: faker.commerce.productName(),
  dueDate: faker.date.future().toISOString(),
  status: faker.helpers.arrayElement(['pending', 'paid', 'overdue']),
  createdAt: faker.date.past().toISOString(),
  paidAt: faker.datatype.boolean() ? faker.date.recent().toISOString() : undefined
}));
