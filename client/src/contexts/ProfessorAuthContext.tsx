import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

interface Professor {
  id: string;
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  cursosIds: string[];
  clienteId: string;
}

interface Cliente {
  id: string;
  tipo: 'empresa' | 'prefeitura';
  razaoSocial: string;
  nomeFantasia: string;
  cnpj?: string;
  telefone: string;
  email: string;
  logoBase64?: string;
}

interface ProfessorAuthContextType {
  professor: Professor | null;
  cliente: Cliente | null;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const ProfessorAuthContext = createContext<ProfessorAuthContextType | undefined>(undefined);

export const ProfessorAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Recuperar sessão do localStorage ao carregar
  useEffect(() => {
    const storedProfessor = localStorage.getItem('professor');
    const storedCliente = localStorage.getItem('professorCliente');
    
    if (storedProfessor && storedCliente) {
      setProfessor(JSON.parse(storedProfessor));
      setCliente(JSON.parse(storedCliente));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      console.log('[ProfessorAuth] Iniciando login para:', email);
      
      // Buscar todos os clientes
      const clientesSnapshot = await getDocs(collection(db, 'clientes'));
      console.log('[ProfessorAuth] Total de clientes encontrados:', clientesSnapshot.docs.length);
      
      // Procurar o professor em todos os clientes
      for (const clienteDoc of clientesSnapshot.docs) {
        const clienteData = clienteDoc.data();
        const professores = clienteData.professores || [];
        
        console.log(`[ProfessorAuth] Cliente ${clienteDoc.id} tem ${professores.length} professores`);
        
        const professorEncontrado = professores.find(
          (prof: any) => prof.email === email && prof.senha === senha
        );
        
        if (professorEncontrado) {
          console.log('[ProfessorAuth] Professor encontrado!', professorEncontrado);
          
          const professorComId = {
            ...professorEncontrado,
            id: professorEncontrado.email, // usar email como ID único
            clienteId: clienteDoc.id,
          };
          
          const clienteInfo = {
            id: clienteDoc.id,
            tipo: clienteData.tipo,
            razaoSocial: clienteData.razaoSocial,
            nomeFantasia: clienteData.nomeFantasia,
            cnpj: clienteData.cnpj,
            telefone: clienteData.telefone,
            email: clienteData.email,
            logoBase64: clienteData.logoBase64,
          };
          
          console.log('[ProfessorAuth] Dados do professor:', professorComId);
          console.log('[ProfessorAuth] Dados do cliente:', clienteInfo);
          
          setProfessor(professorComId);
          setCliente(clienteInfo);
          setIsAuthenticated(true);
          
          // Salvar no localStorage
          localStorage.setItem('professor', JSON.stringify(professorComId));
          localStorage.setItem('professorCliente', JSON.stringify(clienteInfo));
          
          console.log('[ProfessorAuth] Login realizado com sucesso!');
          return true;
        }
      }
      
      console.log('[ProfessorAuth] Professor não encontrado');
      return false;
    } catch (error) {
      console.error('[ProfessorAuth] Erro ao fazer login:', error);
      return false;
    }
  };

  const logout = () => {
    setProfessor(null);
    setCliente(null);
    setIsAuthenticated(false);
    localStorage.removeItem('professor');
    localStorage.removeItem('professorCliente');
  };

  return (
    <ProfessorAuthContext.Provider value={{ professor, cliente, login, logout, isAuthenticated }}>
      {children}
    </ProfessorAuthContext.Provider>
  );
};

export const useProfessorAuth = () => {
  const context = useContext(ProfessorAuthContext);
  if (context === undefined) {
    throw new Error('useProfessorAuth must be used within a ProfessorAuthProvider');
  }
  return context;
};
