import React from 'react';
import ProtectedRouteProfessor from './ProtectedRoute';
import ProfessorDashboardLayout from './DashboardLayout';
import { useProfessorAuth } from '../../contexts/ProfessorAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { User, Mail, Phone, Building2, MapPin, Globe, FileText } from 'lucide-react';

export default function ProfessorPerfil() {
  const { professor, cliente } = useProfessorAuth();

  return (
    <ProtectedRouteProfessor>
      <ProfessorDashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Meu Perfil</h1>
            <p className="text-gray-600">
              Informações sobre sua conta e instituição
            </p>
          </div>

          {/* Perfil do Professor */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-[#00979D] to-[#007a85]">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-[#00979D]" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-white">
                    {professor?.nome}
                  </CardTitle>
                  <p className="text-white/80 mt-1">Professor(a)</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#00979D]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#00979D]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">E-mail</p>
                    <p className="font-medium text-gray-900">{professor?.email}</p>
                  </div>
                </div>

                {professor?.telefone && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#00979D]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-[#00979D]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Telefone</p>
                      <p className="font-medium text-gray-900">{professor?.telefone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cursos Atribuídos</p>
                    <p className="font-medium text-gray-900">
                      {professor?.cursosIds?.length || 0} curso(s)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações da Instituição */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-6 h-6 text-[#00979D]" />
                Instituição
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tipo</p>
                <p className="font-medium text-gray-900 capitalize">
                  {cliente?.tipo === 'empresa' ? 'Empresa' : 'Prefeitura'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Razão Social</p>
                  <p className="font-medium text-gray-900">{cliente?.razaoSocial}</p>
                </div>

                {cliente?.nomeFantasia && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nome Fantasia</p>
                    <p className="font-medium text-gray-900">{cliente?.nomeFantasia}</p>
                  </div>
                )}

                {cliente?.cnpj && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">CNPJ</p>
                    <p className="font-medium text-gray-900">{cliente?.cnpj}</p>
                  </div>
                )}

                {cliente?.telefone && (
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Telefone</p>
                      <p className="font-medium text-gray-900">{cliente?.telefone}</p>
                    </div>
                  </div>
                )}

                {cliente?.email && (
                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600 mb-1">E-mail</p>
                      <p className="font-medium text-gray-900">{cliente?.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Informações de Segurança */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Precisa de ajuda?
                  </h3>
                  <p className="text-sm text-gray-700">
                    Para alterar seus dados ou redefinir sua senha, entre em contato com o administrador do sistema através do e-mail: <strong>{cliente?.email}</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ProfessorDashboardLayout>
    </ProtectedRouteProfessor>
  );
}
