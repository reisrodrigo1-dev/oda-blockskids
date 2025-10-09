import React, { useState, useEffect } from 'react';
import ProtectedRouteProfessor from './ProtectedRoute';
import ProfessorDashboardLayout from './DashboardLayout';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { FileText, Link, Download, ExternalLink } from 'lucide-react';

interface Documento {
  id?: string;
  nome: string;
  linkDocumento?: string;
  pdfBase64?: string;
  pdfNome?: string;
  ativo: boolean;
  createdAt?: Date;
}

export default function ProfessorDocumentos() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocumentos();
  }, []);

  const loadDocumentos = async () => {
    try {
      const q = query(
        collection(db, 'documentos-importantes'),
        where('ativo', '==', true),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Documento[];
      setDocumentos(docs);
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = (base64: string, nome: string) => {
    const link = document.createElement('a');
    link.href = base64;
    link.download = nome;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <ProtectedRouteProfessor>
        <ProfessorDashboardLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-lg">Carregando documentos...</div>
          </div>
        </ProfessorDashboardLayout>
      </ProtectedRouteProfessor>
    );
  }

  return (
    <ProtectedRouteProfessor>
      <ProfessorDashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#00979D] to-[#007a85] rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8" />
              <div>
                <h1 className="text-3xl font-bold">Documentos Importantes</h1>
                <p className="text-white/90 text-lg">Materiais de apoio e documentação</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-[#00979D]">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">Documentos Disponíveis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{documentos.length}</div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">Materiais de Apoio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {documentos.filter(doc => doc.pdfBase64 || doc.linkDocumento).length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Documentos */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Documentos Disponíveis</h2>
            {documentos.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum documento disponível</h3>
                  <p className="text-gray-500">Não há documentos importantes ativos no momento.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {documentos.map((documento) => (
                  <Card key={documento.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#00979D]" />
                        {documento.nome}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {documento.linkDocumento && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 flex-1 min-w-0">
                              <Link className="w-4 h-4 text-blue-500 flex-shrink-0" />
                              <span className="text-sm text-gray-600 truncate">
                                Link externo
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openLink(documento.linkDocumento!)}
                              className="ml-2"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        )}

                        {documento.pdfBase64 && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 flex-1 min-w-0">
                              <FileText className="w-4 h-4 text-red-500 flex-shrink-0" />
                              <span className="text-sm text-gray-600 truncate">
                                {documento.pdfNome}
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadPDF(documento.pdfBase64!, documento.pdfNome!)}
                              className="ml-2"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        )}

                        {documento.createdAt && (
                          <div className="text-xs text-gray-500 pt-2 border-t">
                            Adicionado em {documento.createdAt.toLocaleDateString('pt-BR')}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </ProfessorDashboardLayout>
    </ProtectedRouteProfessor>
  );
}