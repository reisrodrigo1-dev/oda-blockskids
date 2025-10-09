import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useClienteAuth } from '../../contexts/ClienteAuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { AlertCircle, Building2, Lock, Mail, Loader2 } from 'lucide-react';
import logoOdA from '../../assets/logo-OdA.png';
import { toast } from '../../hooks/use-toast';

export default function ClienteLogin() {
  const [, setLocation] = useLocation();
  const { login, isAuthenticated } = useClienteAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      setLocation('/cliente/dashboard');
    }
  }, [isAuthenticated, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !senha) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const success = await login(email, senha);

      if (success) {
        toast({
          title: 'Sucesso!',
          description: 'Login realizado com sucesso',
        });
        setLocation('/cliente/dashboard');
      } else {
        toast({
          title: 'Erro de autenticação',
          description: 'Email ou senha incorretos. Verifique suas credenciais.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao fazer login. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00979D] to-[#007a85] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src={logoOdA} alt="Oficina do Amanhã" className="w-32 h-32 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Área do Cliente</h1>
          <p className="text-white/80">Acesso exclusivo para responsáveis</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl">
          <CardHeader className="space-y-1 bg-gradient-to-r from-gray-50 to-white border-b">
            <div className="flex items-center justify-center w-12 h-12 bg-[#00979D] rounded-full mx-auto mb-2">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl text-center">Login de Responsável</CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais de acesso
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  E-mail do Responsável
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <Label htmlFor="senha" className="text-sm font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="senha"
                    type="password"
                    placeholder="••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="pl-10"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800">
                    <strong>Importante:</strong> Este acesso é exclusivo para responsáveis cadastrados. 
                    Professores devem usar o login de professor.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-[#00979D] hover:bg-[#007a85] text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>

            {/* Help Links */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-600">
                Não tem acesso?{' '}
                <a href="mailto:contato@oficinadoamanha.com" className="text-[#00979D] hover:underline font-medium">
                  Entre em contato
                </a>
              </p>
              <div className="pt-4 border-t">
                <a
                  href="/professor/login"
                  className="text-sm text-gray-600 hover:text-[#00979D] flex items-center justify-center gap-2"
                >
                  <span>Área do Professor →</span>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-white/80 text-sm">
          <p>© {new Date().getFullYear()} Oficina do Amanhã - Blocks Kids</p>
        </div>
      </div>
    </div>
  );
}
