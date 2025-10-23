import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useProfessorAuth } from '../../contexts/ProfessorAuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { GraduationCap, Mail, Lock, AlertCircle } from 'lucide-react';
import { toast } from '../../hooks/use-toast';

export default function ProfessorLogin() {
  const [, setLocation] = useLocation();
  const { login } = useProfessorAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, senha);
      
      if (success) {
        toast({
          title: 'Login realizado!',
          description: 'Bem-vindo(a) ao portal do professor',
        });
        setLocation('/professor/dashboard');
      } else {
        setError('Email ou senha incorretos');
        toast({
          title: 'Erro no login',
          description: 'Email ou senha incorretos',
          variant: 'destructive',
        });
      }
    } catch (error) {
      setError('Erro ao realizar login');
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao realizar o login',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00979D] to-[#007a85] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl bg-gray-800/90 border-gray-600">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto w-16 h-16 bg-[#00979D] rounded-full flex items-center justify-center mb-2">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Portal do Professor
          </CardTitle>
          <CardDescription className="text-white">
            Acesse sua área de ensino
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                E-mail
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="pl-10 bg-white"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha" className="text-white">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 bg-white"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[#00979D] hover:bg-[#007a85] text-white"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>

            <div className="text-center text-sm text-white mt-4">
              <p>Esqueceu sua senha?</p>
              <p className="text-xs mt-1">Entre em contato com o administrador</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
