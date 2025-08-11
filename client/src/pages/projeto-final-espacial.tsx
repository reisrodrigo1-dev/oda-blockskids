import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Rocket, Target, Award, Clock, Users, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';

export default function ProjetoFinalEspacial() {
  const [projectPhase, setProjectPhase] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  
  const phases = [
    {
      title: "Aula 1-2: Apresentação e Pesquisa",
      description: "Compreender o problema e pesquisar sobre exploração espacial",
      tasks: ["apresentacao", "pesquisa", "objetivos"]
    },
    {
      title: "Aula 3-4: Idealização e Planejamento",
      description: "Criar o conceito da sonda e planejar a implementação",
      tasks: ["conceito", "design", "planejamento"]
    },
    {
      title: "Aula 5: Desenvolvimento",
      description: "Construir e programar a sonda espacial",
      tasks: ["construcao", "programacao", "testes"]
    },
    {
      title: "Aula 6: Apresentação Final",
      description: "Apresentar o projeto e demonstrar funcionamento",
      tasks: ["apresentacao-final", "demonstracao", "avaliacao"]
    }
  ];

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const getPhaseProgress = (phaseIndex: number) => {
    const phaseTasks = phases[phaseIndex].tasks;
    const completedInPhase = phaseTasks.filter(task => completedTasks.includes(task)).length;
    return (completedInPhase / phaseTasks.length) * 100;
  };

  const overallProgress = (completedTasks.length / phases.reduce((acc, phase) => acc + phase.tasks.length, 0)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/home">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Target className="w-6 h-6 text-purple-400" />
                <h1 className="text-xl font-bold">Projeto Final - Exploração Espacial</h1>
              </div>
            </div>
            <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-400">
              6 Aulas - MEP Integrado
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Progresso Geral */}
        <Card className="bg-black/40 border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Award className="w-5 h-5 text-yellow-400" />
              Progresso do Projeto Final
            </CardTitle>
            <CardDescription className="text-gray-300">
              Acompanhe seu desenvolvimento ao longo das 6 aulas do projeto final
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Progresso Geral</span>
                <span className="text-white">{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-blue-600/20 rounded-lg border border-blue-400/30 text-center">
                <div className="text-2xl mb-2">🔧</div>
                <h3 className="font-semibold text-blue-300">Mecânica</h3>
                <p className="text-sm text-gray-300">Sistema de movimento e ferramentas</p>
              </div>
              <div className="p-4 bg-green-600/20 rounded-lg border border-green-400/30 text-center">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-semibold text-green-300">Eletrônica</h3>
                <p className="text-sm text-gray-300">Sensores e comunicação</p>
              </div>
              <div className="p-4 bg-purple-600/20 rounded-lg border border-purple-400/30 text-center">
                <div className="text-2xl mb-2">💻</div>
                <h3 className="font-semibold text-purple-300">Programação</h3>
                <p className="text-sm text-gray-300">Lógica de exploração autônoma</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/40">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-purple-600">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="planning" className="text-white data-[state=active]:bg-purple-600">
              Planejamento
            </TabsTrigger>
            <TabsTrigger value="development" className="text-white data-[state=active]:bg-purple-600">
              Desenvolvimento
            </TabsTrigger>
            <TabsTrigger value="resources" className="text-white data-[state=active]:bg-purple-600">
              Recursos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6">
              {phases.map((phase, index) => (
                <Card key={index} className="bg-black/40 border-white/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-400" />
                        {phase.title}
                      </CardTitle>
                      <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">
                        {Math.round(getPhaseProgress(index))}%
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-300">
                      {phase.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Progress value={getPhaseProgress(index)} className="h-2" />
                    
                    <div className="grid md:grid-cols-3 gap-3">
                      {phase.tasks.map((task, taskIndex) => {
                        const isCompleted = completedTasks.includes(task);
                        const taskNames = {
                          apresentacao: "Apresentação do Problema",
                          pesquisa: "Pesquisa sobre Exploração",
                          objetivos: "Definir Objetivos",
                          conceito: "Conceito da Sonda",
                          design: "Design do Sistema",
                          planejamento: "Plano de Desenvolvimento",
                          construcao: "Construção Física",
                          programacao: "Programação",
                          testes: "Testes e Ajustes",
                          "apresentacao-final": "Apresentação Final",
                          demonstracao: "Demonstração",
                          avaliacao: "Autoavaliação"
                        };

                        return (
                          <div
                            key={taskIndex}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              isCompleted
                                ? 'bg-green-600/20 border-green-400/30'
                                : 'bg-white/10 border-white/20 hover:bg-white/20'
                            }`}
                            onClick={() => toggleTask(task)}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded-full border-2 ${
                                isCompleted ? 'bg-green-500 border-green-500' : 'border-white/40'
                              }`}>
                                {isCompleted && (
                                  <div className="w-full h-full flex items-center justify-center text-xs text-white">
                                    ✓
                                  </div>
                                )}
                              </div>
                              <span className={`text-sm ${isCompleted ? 'text-green-300' : 'text-white'}`}>
                                {taskNames[task as keyof typeof taskNames]}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="planning" className="space-y-6">
            <Card className="bg-black/40 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Planejamento da Sonda Espacial</CardTitle>
                <CardDescription className="text-gray-300">
                  Desenvolva o conceito e especificações da sua sonda de exploração
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-white">Especificações Técnicas</h3>
                    
                    <div className="space-y-3">
                      <Card className="bg-white/10 border-white/20">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-blue-300 mb-2">🔧 Sistema Mecânico</h4>
                          <ul className="text-sm text-gray-300 space-y-1">
                            <li>• Chassis resistente para terreno irregular</li>
                            <li>• Sistema de tração (rodas/esteiras)</li>
                            <li>• Braço robótico para coleta</li>
                            <li>• Compartimento para amostras</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="bg-white/10 border-white/20">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-green-300 mb-2">⚡ Sistema Eletrônico</h4>
                          <ul className="text-sm text-gray-300 space-y-1">
                            <li>• Sensores de temperatura e radiação</li>
                            <li>• Câmera de alta resolução</li>
                            <li>• Sistema de comunicação via rádio</li>
                            <li>• Painéis solares para energia</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="bg-white/10 border-white/20">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-purple-300 mb-2">💻 Sistema de Programação</h4>
                          <ul className="text-sm text-gray-300 space-y-1">
                            <li>• Navegação autônoma</li>
                            <li>• Detecção e desvio de obstáculos</li>
                            <li>• Protocolos de comunicação</li>
                            <li>• Sistema de emergência</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-white">Objetivos da Missão</h3>
                    
                    <div className="space-y-3">
                      <div className="p-4 bg-yellow-600/20 rounded-lg border border-yellow-400/30">
                        <h4 className="font-semibold text-yellow-300 mb-2">🎯 Objetivo Principal</h4>
                        <p className="text-sm text-gray-300">
                          Explorar e mapear a superfície de um exoplaneta potencialmente habitável
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold text-white">📋 Objetivos Específicos:</h4>
                        <ul className="text-sm text-gray-300 space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>Mapear área de 1km² da superfície planetária</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-400 mt-1">•</span>
                            <span>Coletar e analisar 5 amostras de solo diferentes</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-purple-400 mt-1">•</span>
                            <span>Detectar presença de água ou gelo</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-yellow-400 mt-1">•</span>
                            <span>Transmitir dados para a base na Terra</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-red-400 mt-1">•</span>
                            <span>Operar de forma autônoma por 30 dias</span>
                          </li>
                        </ul>
                      </div>

                      <div className="p-4 bg-red-600/20 rounded-lg border border-red-400/30">
                        <h4 className="font-semibold text-red-300 mb-2">⚠️ Desafios Esperados</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                          <li>• Terreno rochoso e irregular</li>
                          <li>• Tempestades de poeira</li>
                          <li>• Temperatura extrema (-80°C a +50°C)</li>
                          <li>• Comunicação com delay de 20 minutos</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="development" className="space-y-6">
            <Card className="bg-black/40 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Desenvolvimento da Sonda</CardTitle>
                <CardDescription className="text-gray-300">
                  Construa e programe sua sonda espacial usando componentes reais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-white">Lista de Materiais</h3>
                    
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-600/20 rounded-lg border border-blue-400/30">
                        <h4 className="font-semibold text-blue-300 mb-2">🤖 Componentes Principais</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                          <li>□ Arduino Uno R3</li>
                          <li>□ Chassis para robô</li>
                          <li>□ Motores DC (2x)</li>
                          <li>□ Rodas (4x)</li>
                          <li>□ Servo motor para braço</li>
                        </ul>
                      </div>

                      <div className="p-3 bg-green-600/20 rounded-lg border border-green-400/30">
                        <h4 className="font-semibold text-green-300 mb-2">📡 Sensores e Comunicação</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                          <li>□ Sensor ultrassônico</li>
                          <li>□ Sensor de temperatura</li>
                          <li>□ Módulo Bluetooth</li>
                          <li>□ LED RGB para status</li>
                          <li>□ Buzzer para alertas</li>
                        </ul>
                      </div>

                      <div className="p-3 bg-purple-600/20 rounded-lg border border-purple-400/30">
                        <h4 className="font-semibold text-purple-300 mb-2">🔌 Eletrônica</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                          <li>□ Protoboard</li>
                          <li>□ Jumpers</li>
                          <li>□ Resistores</li>
                          <li>□ Bateria 9V</li>
                          <li>□ Driver de motor</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-white">Etapas de Construção</h3>
                    
                    <div className="space-y-3">
                      <Card className="bg-white/10 border-white/20">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-white mb-2">1️⃣ Montagem Mecânica</h4>
                          <p className="text-sm text-gray-300 mb-2">
                            Monte o chassis e instale os motores e rodas
                          </p>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Ver Tutorial
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="bg-white/10 border-white/20">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-white mb-2">2️⃣ Instalação Eletrônica</h4>
                          <p className="text-sm text-gray-300 mb-2">
                            Conecte Arduino, sensores e sistema de comunicação
                          </p>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Ver Esquema
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="bg-white/10 border-white/20">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-white mb-2">3️⃣ Programação</h4>
                          <p className="text-sm text-gray-300 mb-2">
                            Desenvolva o código de navegação e exploração
                          </p>
                          <Link href="/editor-offline">
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                              Abrir Editor
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>

                      <Card className="bg-white/10 border-white/20">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-white mb-2">4️⃣ Testes e Calibração</h4>
                          <p className="text-sm text-gray-300 mb-2">
                            Teste todos os sistemas e ajuste parâmetros
                          </p>
                          <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                            Lista de Testes
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg border border-purple-400/30">
                  <h3 className="font-semibold text-white mb-2">🚀 Simulação da Missão</h3>
                  <p className="text-gray-300 mb-4">
                    Crie um ambiente de teste que simule a superfície de um exoplaneta
                  </p>
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="text-center">
                      <div className="text-2xl mb-1">🌑</div>
                      <p className="text-sm text-gray-300">Terreno com obstáculos</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-1">📦</div>
                      <p className="text-sm text-gray-300">Objetos para coletar</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-1">📍</div>
                      <p className="text-sm text-gray-300">Pontos de interesse</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <Card className="bg-black/40 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Recursos e Materiais</CardTitle>
                <CardDescription className="text-gray-300">
                  Tudo que você precisa para desenvolver seu projeto final
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-400" />
                      Materiais de Estudo
                    </h3>
                    
                    <div className="space-y-3">
                      <Card className="bg-white/10 border-white/20">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-blue-300 mb-2">📚 Apostila Completa</h4>
                          <p className="text-sm text-gray-300 mb-3">
                            Guia detalhado sobre exploração espacial e desenvolvimento de sondas
                          </p>
                          <Button size="sm" variant="outline" className="border-white/20 text-white">
                            Download PDF
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="bg-white/10 border-white/20">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-green-300 mb-2">🎥 Vídeos Educativos</h4>
                          <p className="text-sm text-gray-300 mb-3">
                            Playlist com documentários sobre missões espaciais reais
                          </p>
                          <Button size="sm" variant="outline" className="border-white/20 text-white">
                            Ver Playlist
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="bg-white/10 border-white/20">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-purple-300 mb-2">🌐 Links Úteis</h4>
                          <ul className="text-sm text-gray-300 space-y-1">
                            <li>• NASA - Missões de Exploração</li>
                            <li>• ESA - Tecnologia Espacial</li>
                            <li>• SpaceX - Inovações</li>
                            <li>• Exoplanet Archive</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-400" />
                      Avaliação e Apresentação
                    </h3>
                    
                    <div className="space-y-3">
                      <Card className="bg-white/10 border-white/20">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-yellow-300 mb-2">📊 Critérios de Avaliação</h4>
                          <ul className="text-sm text-gray-300 space-y-1">
                            <li>• Funcionamento técnico (40%)</li>
                            <li>• Criatividade e inovação (25%)</li>
                            <li>• Apresentação e comunicação (20%)</li>
                            <li>• Trabalho em equipe (15%)</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="bg-white/10 border-white/20">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-red-300 mb-2">🎤 Estrutura da Apresentação</h4>
                          <ul className="text-sm text-gray-300 space-y-1">
                            <li>• Introdução ao problema (3 min)</li>
                            <li>• Demonstração técnica (5 min)</li>
                            <li>• Resultados obtidos (3 min)</li>
                            <li>• Discussão e perguntas (4 min)</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="bg-white/10 border-white/20">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-blue-300 mb-2">🏆 Prêmios Especiais</h4>
                          <ul className="text-sm text-gray-300 space-y-1">
                            <li>• Sonda mais inovadora</li>
                            <li>• Melhor apresentação</li>
                            <li>• Solução mais criativa</li>
                            <li>• Melhor trabalho em equipe</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg border border-green-400/30">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-green-400" />
                    Dicas para o Sucesso
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-green-300 mb-2">💡 Planejamento</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Divida o projeto em etapas menores</li>
                        <li>• Teste cada componente separadamente</li>
                        <li>• Documente todo o processo</li>
                        <li>• Prepare um plano B para problemas</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-blue-300 mb-2">🤝 Trabalho em Equipe</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Distribua tarefas conforme habilidades</li>
                        <li>• Comunique-se constantemente</li>
                        <li>• Ajude colegas com dificuldades</li>
                        <li>• Celebre as conquistas juntos</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
