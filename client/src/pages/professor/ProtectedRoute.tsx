import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useProfessorAuth } from '../../contexts/ProfessorAuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRouteProfessor({ children }: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useProfessorAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/professor/login');
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
