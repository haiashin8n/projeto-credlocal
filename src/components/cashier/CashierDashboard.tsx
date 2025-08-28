import React, { useState } from 'react';
import { Search, User, CreditCard, DollarSign, Plus } from 'lucide-react';
import Layout from '../common/Layout';
import { mockClients, mockCreditRecords } from '../../data/mockData';
import { Client, CreditRecord } from '../../types';

const CashierDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showNewCreditModal, setShowNewCreditModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [newCreditAmount, setNewCreditAmount] = useState('');
  const [newCreditDescription, setNewCreditDescription] = useState('');

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    // Buscar por CPF ou nome
    const client = mockClients.find(c => 
      c.cpf.replace(/\D/g, '').includes(searchTerm.replace(/\D/g, '')) ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (client) {
      setSelectedClient(client);
    } else {
      alert('Cliente não encontrado');
      setSelectedClient(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePayment = () => {
    if (!selectedClient || !paymentAmount) return;

    const amount = parseFloat(paymentAmount);
    if (amount <= 0 || amount > selectedClient.currentDebt) {
      alert('Valor inválido para pagamento');
      return;
    }

    // Simular pagamento
    const updatedClient = {
      ...selectedClient,
      currentDebt: selectedClient.currentDebt - amount,
      lastPayment: new Date().toISOString(),
      paymentStatus: (selectedClient.currentDebt - amount) === 0 ? 'em_dia' : selectedClient.paymentStatus
    };

    setSelectedClient(updatedClient);
    setPaymentAmount('');
    setShowPaymentModal(false);
    alert(`Pagamento de R$ ${amount.toFixed(2)} registrado com sucesso!`);
  };

  const handleNewCredit = () => {
    if (!selectedClient || !newCreditAmount || !newCreditDescription) return;

    const amount = parseFloat(newCreditAmount);
    const availableCredit = selectedClient.creditLimit - selectedClient.currentDebt;

    if (amount <= 0 || amount > availableCredit) {
      alert('Valor inválido. Verifique o limite disponível.');
      return;
    }

    // Simular novo crediário
    const updatedClient = {
      ...selectedClient,
      currentDebt: selectedClient.currentDebt + amount,
      paymentStatus: 'a_vencer' as const
    };

    setSelectedClient(updatedClient);
    setNewCreditAmount('');
    setNewCreditDescription('');
    setShowNewCreditModal(false);
    alert(`Novo crediário de R$ ${amount.toFixed(2)} incluído com sucesso!`);
  };

  const availableCredit = selectedClient 
    ? selectedClient.creditLimit - selectedClient.currentDebt 
    : 0;

  return (
    <Layout title="Painel do Caixa">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Busca de Cliente */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Consultar Crediário</h2>
          
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Digite o CPF ou nome do cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Buscar
            </button>
          </div>
        </div>

        {/* Resultado da Busca */}
        {selectedClient && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Informações do Cliente</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                selectedClient.paymentStatus === 'em_dia' ? 'bg-green-100 text-green-800' :
                selectedClient.paymentStatus === 'a_vencer' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {selectedClient.paymentStatus === 'em_dia' ? 'Em dia' :
                 selectedClient.paymentStatus === 'a_vencer' ? 'A vencer' : 'Vencido'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Nome</p>
                    <p className="font-semibold text-gray-900">{selectedClient.name}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">CPF</p>
                  <p className="font-semibold text-gray-900">{selectedClient.cpf}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Telefone</p>
                  <p className="font-semibold text-gray-900">{selectedClient.phone}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Limite de Crédito</p>
                  <p className="text-2xl font-bold text-blue-900">
                    R$ {selectedClient.creditLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">Dívida Atual</p>
                  <p className="text-2xl font-bold text-red-900">
                    R$ {selectedClient.currentDebt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Crédito Disponível</p>
                  <p className="text-2xl font-bold text-green-900">
                    R$ {availableCredit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setShowPaymentModal(true)}
                disabled={selectedClient.currentDebt === 0}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <DollarSign className="h-5 w-5" />
                <span>Efetuar Recebimento</span>
              </button>

              <button
                onClick={() => setShowNewCreditModal(true)}
                disabled={availableCredit <= 0}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Plus className="h-5 w-5" />
                <span>Incluir Novo Crediário</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal de Pagamento */}
        {showPaymentModal && selectedClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Efetuar Recebimento</h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">Cliente: {selectedClient.name}</p>
                <p className="text-sm text-gray-600">
                  Dívida total: R$ {selectedClient.currentDebt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor do Pagamento
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  max={selectedClient.currentDebt}
                  min="0"
                  step="0.01"
                  placeholder="0,00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handlePayment}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Novo Crediário */}
        {showNewCreditModal && selectedClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Incluir Novo Crediário</h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">Cliente: {selectedClient.name}</p>
                <p className="text-sm text-gray-600">
                  Crédito disponível: R$ {availableCredit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor do Crediário
                  </label>
                  <input
                    type="number"
                    value={newCreditAmount}
                    onChange={(e) => setNewCreditAmount(e.target.value)}
                    max={availableCredit}
                    min="0"
                    step="0.01"
                    placeholder="0,00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <input
                    type="text"
                    value={newCreditDescription}
                    onChange={(e) => setNewCreditDescription(e.target.value)}
                    placeholder="Descrição da compra..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowNewCreditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleNewCredit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CashierDashboard;
