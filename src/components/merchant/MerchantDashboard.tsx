import React, { useState } from 'react';
import { Users, CreditCard, AlertTriangle, Plus, Search, Filter, MessageSquare, DollarSign } from 'lucide-react';
import Layout from '../common/Layout';
import Card from '../common/Card';
import ClientModal from './ClientModal';
import { mockClients, mockCreditRecords } from '../../data/mockData';
import { Client, CreditRecord } from '../../types';

const MerchantDashboard: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showClientModal, setShowClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.cpf.includes(searchTerm) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || client.paymentStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalClients: clients.length,
    clientsInDebt: clients.filter(c => c.currentDebt > 0).length,
    overdueClients: clients.filter(c => c.paymentStatus === 'vencido').length,
    totalDebt: clients.reduce((acc, c) => acc + c.currentDebt, 0)
  };

  const handleAddClient = () => {
    setEditingClient(null);
    setShowClientModal(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setShowClientModal(true);
  };

  const handleSendReminder = (clientId: string, type: 'overdue' | 'upcoming') => {
    const client = clients.find(c => c.id === clientId);
    const message = type === 'overdue' 
      ? `Olá ${client?.name}, você possui pagamentos em atraso. Por favor, regularize sua situação.`
      : `Olá ${client?.name}, você possui pagamentos próximos do vencimento.`;
    
    alert(`Mensagem enviada: ${message}`);
  };

  const handleSendPromotion = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    alert(`Promoção enviada para ${client?.name}: Oferta especial para clientes com bom histórico!`);
  };

  return (
    <Layout title="Painel do Comerciante">
      <div className="space-y-6">
        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            title="Total de Clientes"
            value={stats.totalClients}
            icon={Users}
            color="blue"
            onClick={() => {}}
          />
          <Card
            title="Clientes Inadimplentes"
            value={stats.clientsInDebt}
            icon={AlertTriangle}
            color="red"
            onClick={() => setStatusFilter('vencido')}
          />
          <Card
            title="Pagamentos Vencidos"
            value={stats.overdueClients}
            icon={CreditCard}
            color="yellow"
            onClick={() => setStatusFilter('vencido')}
          />
          <Card
            title="Total em Dívidas"
            value={`R$ ${stats.totalDebt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            icon={DollarSign}
            color="green"
          />
        </div>

        {/* Links rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            title="Consultar CPF"
            value="Buscar Cliente"
            icon={Search}
            color="blue"
            onClick={() => document.getElementById('search-input')?.focus()}
          />
          <Card
            title="Gerenciar Dívidas"
            value="Ver Crediários"
            icon={CreditCard}
            color="purple"
            onClick={() => {}}
          />
          <Card
            title="Cadastrar Cliente"
            value="Novo Cliente"
            icon={Plus}
            color="green"
            onClick={handleAddClient}
          />
        </div>

        {/* Gerenciamento de Clientes */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-900">Gerenciar Crediaristas</h2>
              <button
                onClick={handleAddClient}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Cliente
              </button>
            </div>
            
            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="search-input"
                  type="text"
                  placeholder="Buscar por nome, CPF ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos</option>
                  <option value="em_dia">Em dia</option>
                  <option value="a_vencer">A vencer</option>
                  <option value="vencido">Vencido</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Limite/Dívida
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Pagamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                        <div className="text-sm text-gray-500">{client.cpf}</div>
                        <div className="text-sm text-gray-500">{client.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Limite: R$ {client.creditLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-sm text-gray-500">
                        Dívida: R$ {client.currentDebt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        client.paymentStatus === 'em_dia' ? 'bg-green-100 text-green-800' :
                        client.paymentStatus === 'a_vencer' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {client.paymentStatus === 'em_dia' ? 'Em dia' :
                         client.paymentStatus === 'a_vencer' ? 'A vencer' : 'Vencido'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(client.lastPayment).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClient(client)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar cliente"
                        >
                          Editar
                        </button>
                        {client.paymentStatus === 'vencido' && (
                          <button
                            onClick={() => handleSendReminder(client.id, 'overdue')}
                            className="text-red-600 hover:text-red-900"
                            title="Enviar lembrete de vencimento"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </button>
                        )}
                        {client.paymentStatus === 'em_dia' && (
                          <button
                            onClick={() => handleSendPromotion(client.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Enviar promoção"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showClientModal && (
        <ClientModal
          client={editingClient}
          onClose={() => setShowClientModal(false)}
          onSave={(client) => {
            if (editingClient) {
              setClients(clients.map(c => c.id === client.id ? client : c));
            } else {
              setClients([...clients, { ...client, id: Date.now().toString() }]);
            }
            setShowClientModal(false);
          }}
        />
      )}
    </Layout>
  );
};

export default MerchantDashboard;
