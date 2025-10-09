import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useClienteAuth } from '../../contexts/ClienteAuthContext';

export default function ProtectedRouteCliente({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const { isAuthenticated, loading } = useClienteAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation('/cliente/login');
    }
  }, [isAuthenticated, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00979D] mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
