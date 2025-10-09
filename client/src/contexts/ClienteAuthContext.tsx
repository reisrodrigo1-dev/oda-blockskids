import React, { createContext, useContext, useState, useEffect } from 'react';

interface Cliente {
  id: string;
  tipo: 'empresa' | 'prefeitura';
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  email: string;
  telefone: string;
  cidade: string;
  estado: string;
  nomeResponsavel: string;
  cargoResponsavel: string;
  emailResponsavel: string;
  telefoneResponsavel: string;
  logoBase64?: string;
  professores: Array<{
    nome: string;
    email: string;
    telefone: string;
    cursosIds: string[];
  }>;
}

interface ClienteAuthContextType {
  cliente: Cliente | null;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const ClienteAuthContext = createContext<ClienteAuthContextType | undefined>(undefined);

export function ClienteAuthProvider({ children }: { children: React.ReactNode }) {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedCliente = localStorage.getItem('cliente_auth');
    if (savedCliente) {
      try {
        setCliente(JSON.parse(savedCliente));
      } catch (error) {
        console.error('Error parsing cliente auth:', error);
        localStorage.removeItem('cliente_auth');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Import Firebase here to avoid circular dependencies
      const { db } = await import('../lib/firebase');
      const { collection, getDocs, query, where } = await import('firebase/firestore');
      
      // Search for cliente by email and senha
      const clientesRef = collection(db, 'clientes');
      const q = query(
        clientesRef,
        where('emailResponsavel', '==', email),
        where('senhaResponsavel', '==', senha)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return false;
      }
      
      const clienteDoc = querySnapshot.docs[0];
      const clienteData = {
        id: clienteDoc.id,
        ...clienteDoc.data()
      } as Cliente;
      
      setCliente(clienteData);
      localStorage.setItem('cliente_auth', JSON.stringify(clienteData));
      
      return true;
    } catch (error) {
      console.error('Error logging in:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCliente(null);
    localStorage.removeItem('cliente_auth');
  };

  return (
    <ClienteAuthContext.Provider
      value={{
        cliente,
        isAuthenticated: !!cliente,
        login,
        logout,
        loading
      }}
    >
      {children}
    </ClienteAuthContext.Provider>
  );
}

export function useClienteAuth() {
  const context = useContext(ClienteAuthContext);
  if (context === undefined) {
    throw new Error('useClienteAuth must be used within a ClienteAuthProvider');
  }
  return context;
}
