import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import ProtectedRouteProfessor from './ProtectedRoute';
import ProfessorDashboardLayout from './DashboardLayout';
import { useProfessorAuth } from '../../contexts/ProfessorAuthContext';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { BookOpen, GraduationCap, Building2, Video, FileText } from 'lucide-react';

interface Curso {
  id?: string;
  nome: string;
  descricao: string;
  aulasIds: string[];
  createdAt?: Date;
}

export default function ProfessorDashboard() {
  const { professor, cliente } = useProfessorAuth();
  const [, setLocation] = useLocation();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [totalAulas, setTotalAulas] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCursos();
  }, [professor]);

  const loadCursos = async () => {
    if (!professor?.cursosIds) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const cursosSnapshot = await getDocs(collection(db, 'cursos'));
      const todosCursos = cursosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Curso[];
      
      const cursosDoProfessor = todosCursos.filter(curso => 
        professor.cursosIds.includes(curso.id!)
      );
      
      setCursos(cursosDoProfessor);
      const totalAulasCount = cursosDoProfessor.reduce(
        (acc, curso) => acc + (curso.aulasIds?.length || 0),
        0
      );
      setTotalAulas(totalAulasCount);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRouteProfessor>
      <ProfessorDashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-gradient-to-r from-[#00979D] to-[#007a85] rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Olá, {professor?.nome?.split(' ')[0]}! 👋</h1>
                <p className="text-white/90 text-lg">Bem-vindo ao seu portal de ensino</p>
              </div>
              {cliente?.logoBase64 && (
                <div className="bg-white rounded-lg p-3 shadow-lg">
                  <img 
                    src={cliente.logoBase64} 
                    alt="Logo da empresa" 
                    className="max-h-16 max-w-[150px] object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-[#00979D]">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">Meus Cursos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{cursos.length}</div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Meus Cursos</h2>
            {loading ? (
              <div className="text-center py-12">Carregando...</div>
            ) : cursos.length === 0 ? (
              <Card><CardContent className="text-center py-12">Nenhum curso</CardContent></Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cursos.map((curso) => (
                  <Card key={curso.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{curso.nome}</CardTitle>
                      <p className="text-sm text-gray-600 mt-2">{curso.descricao}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Video className="w-4 h-4" />
                          <span>{curso.aulasIds?.length || 0} aulas</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setLocation(`/professor/assistir/${curso.id}`)}
                        className="inline-flex items-center justify-center w-full px-4 py-2 bg-[#00979D] text-white rounded-md hover:bg-[#007a85] transition-colors"
                      >
                        Assistir Curso
                      </button>
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
