import React from 'react';
import ProtectedRouteCliente from './ProtectedRoute';
import ClienteDashboardLayout from './DashboardLayout';
import { useClienteAuth } from '../../contexts/ClienteAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Building2, Mail, Phone, MapPin, FileText, Calendar } from 'lucide-react';

export default function ClienteConta() {
  const { cliente } = useClienteAuth();

  if (!cliente) return null;

  return (
    <ProtectedRouteCliente>
      <ClienteDashboardLayout>
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Minha Conta</h1>
          <p className="text-gray-600">
            Informações completas da sua conta
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações da Empresa/Prefeitura */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#00979D]" />
                Dados da {cliente.tipo === 'prefeitura' ? 'Prefeitura' : 'Empresa'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Razão Social</label>
                  <p className="font-semibold text-gray-900 mt-1">{cliente.razaoSocial}</p>
                </div>

                {cliente.nomeFantasia && (
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">Nome Fantasia</label>
                    <p className="font-semibold text-gray-900 mt-1">{cliente.nomeFantasia}</p>
                  </div>
                )}

                {cliente.cnpj && (
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">CNPJ</label>
                    <p className="font-semibold text-gray-900 mt-1">{cliente.cnpj}</p>
                  </div>
                )}

                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Tipo</label>
                  <p className="font-semibold text-gray-900 mt-1">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                      cliente.tipo === 'prefeitura' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {cliente.tipo === 'prefeitura' ? '🏛️ Prefeitura' : '🏭 Empresa'}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#00979D]" />
                Informações de Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">E-mail Principal</label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p className="font-semibold text-gray-900">{cliente.email}</p>
                </div>
              </div>

              {cliente.telefone && (
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Telefone</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="font-semibold text-gray-900">{cliente.telefone}</p>
                  </div>
                </div>
              )}

              {cliente.cidade && cliente.estado && (
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Localização</label>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <p className="font-semibold text-gray-900">{cliente.cidade}/{cliente.estado}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Responsável */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#00979D]" />
                Responsável pela Conta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Nome Completo</label>
                  <p className="font-semibold text-gray-900 mt-1">{cliente.nomeResponsavel}</p>
                </div>

                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Cargo</label>
                  <p className="font-semibold text-gray-900 mt-1">{cliente.cargoResponsavel}</p>
                </div>

                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">E-mail</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="font-semibold text-gray-900">{cliente.emailResponsavel}</p>
                  </div>
                </div>

                {cliente.telefoneResponsavel && (
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">Telefone</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <p className="font-semibold text-gray-900">{cliente.telefoneResponsavel}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Informações da Conta */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#00979D]" />
                Informações da Conta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Total de Professores</label>
                  <p className="text-3xl font-bold text-[#00979D] mt-1">
                    {cliente.professores?.length || 0}
                  </p>
                </div>

                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Status da Conta</label>
                  <p className="mt-1">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700 font-semibold">
                      ✓ Ativa
                    </span>
                  </p>
                </div>

                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Tipo de Acesso</label>
                  <p className="mt-1">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 font-semibold">
                      🔐 Responsável
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex gap-3">
            <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Atualização de Dados</h4>
              <p className="text-sm text-blue-800">
                Para atualizar qualquer informação da sua conta, entre em contato com o administrador do sistema 
                através do e-mail{' '}
                <a href="mailto:contato@oficinadoamanha.com" className="underline font-medium">
                  contato@oficinadoamanha.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </ClienteDashboardLayout>
    </ProtectedRouteCliente>
  );
}
