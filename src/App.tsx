import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/auth/LoginForm';
import SuperAdminDashboard from './components/superadmin/SuperAdminDashboard';
import MerchantDashboard from './components/merchant/MerchantDashboard';
import CashierDashboard from './components/cashier/CashierDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';

const AppRoutes: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  // Redirecionar baseado no papel do usuário
  const getDashboardRoute = () => {
    switch (user.role) {
      case 'superadmin':
        return '/admin';
      case 'comerciante':
        return '/merchant';
      case 'caixa':
        return '/cashier';
      default:
        return '/';
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={getDashboardRoute()} replace />} />
      
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['superadmin']}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/merchant"
        element={
          <ProtectedRoute allowedRoles={['comerciante']}>
            <MerchantDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/cashier"
        element={
          <ProtectedRoute allowedRoles={['caixa']}>
            <CashierDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route path="*" element={<Navigate to={getDashboardRoute()} replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
