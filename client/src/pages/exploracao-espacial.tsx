import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Rocket, Satellite, Zap, Thermometer, Camera, Signal } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';

export default function ExploracaoEspacial() {
  const [missionProgress, setMissionProgress] = useState(0);
  const [activeSystem, setActiveSystem] = useState<string | null>(null);
  const [telemetryData, setTelemetryData] = useState({
    temperatura: 22,
    energia: 85,
    sinal: 95,
    altitude: 0
  });

  const startMission = () => {
    setMissionProgress(0);
    const interval = setInterval(() => {
      setMissionProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
      
      // Simular dados de telemetria
      setTelemetryData(prev => ({
        temperatura: Math.max(-50, Math.min(80, prev.temperatura + (Math.random() - 0.5) * 10)),
        energia: Math.max(0, Math.min(100, prev.energia - Math.random() * 2)),
        sinal: Math.max(0, Math.min(100, prev.sinal + (Math.random() - 0.5) * 10)),
        altitude: prev.altitude + Math.random() * 100
      }));
    }, 500);
  };

  const systemStatus = (value: number) => {
    if (value > 70) return { color: 'text-green-600', status: 'Ótimo' };
    if (value > 40) return { color: 'text-yellow-600', status: 'Atenção' };
    return { color: 'text-red-600', status: 'Crítico' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
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
                <Rocket className="w-6 h-6 text-blue-400" />
                <h1 className="text-xl font-bold">Exploração Espacial</h1>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-400">
              Projeto Final - M14
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Introdução */}
        <Card className="bg-black/40 border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Satellite className="w-5 h-5 text-blue-400" />
              Missão: Exploração de Exoplanetas
            </CardTitle>
            <CardDescription className="text-gray-300">
              Desenvolva uma sonda espacial autônoma capaz de explorar planetas distantes e coletar dados científicos importantes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-600/20 rounded-lg border border-blue-400/30">
                <h3 className="font-semibold text-blue-300 mb-2">🔧 Mecânica</h3>
                <p className="text-sm text-gray-300">Sistema de locomoção e coleta de amostras</p>
              </div>
              <div className="p-4 bg-green-600/20 rounded-lg border border-green-400/30">
                <h3 className="font-semibold text-green-300 mb-2">⚡ Eletrônica</h3>
                <p className="text-sm text-gray-300">Sensores e sistema de comunicação</p>
              </div>
              <div className="p-4 bg-purple-600/20 rounded-lg border border-purple-400/30">
                <h3 className="font-semibold text-purple-300 mb-2">💻 Programação</h3>
                <p className="text-sm text-gray-300">Lógica de exploração autônoma</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="mission" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/40">
            <TabsTrigger value="mission" className="text-white data-[state=active]:bg-blue-600">
              Centro de Missão
            </TabsTrigger>
            <TabsTrigger value="programming" className="text-white data-[state=active]:bg-blue-600">
              Programação
            </TabsTrigger>
            <TabsTrigger value="simulation" className="text-white data-[state=active]:bg-blue-600">
              Simulação
            </TabsTrigger>
            <TabsTrigger value="analysis" className="text-white data-[state=active]:bg-blue-600">
              Análise de Dados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mission" className="space-y-6">
            <Card className="bg-black/40 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Status da Missão</CardTitle>
                <CardDescription className="text-gray-300">
                  Monitore o progresso da sua sonda espacial em tempo real
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Progresso da Missão</span>
                    <span className="text-white">{missionProgress}%</span>
                  </div>
                  <Progress value={missionProgress} className="h-3" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <Signal className="w-4 h-4 text-blue-400" />
                      Telemetria da Sonda
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Thermometer className="w-4 h-4 text-red-400" />
                          <span className="text-sm">Temperatura</span>
                        </div>
                        <span className={`font-mono ${systemStatus(Math.abs(telemetryData.temperatura)).color}`}>
                          {telemetryData.temperatura.toFixed(1)}°C
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm">Energia</span>
                        </div>
                        <span className={`font-mono ${systemStatus(telemetryData.energia).color}`}>
                          {telemetryData.energia.toFixed(1)}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Signal className="w-4 h-4 text-green-400" />
                          <span className="text-sm">Sinal</span>
                        </div>
                        <span className={`font-mono ${systemStatus(telemetryData.sinal).color}`}>
                          {telemetryData.sinal.toFixed(1)}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Rocket className="w-4 h-4 text-blue-400" />
                          <span className="text-sm">Altitude</span>
                        </div>
                        <span className="font-mono text-white">
                          {telemetryData.altitude.toFixed(0)}m
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-white">Controles de Missão</h3>
                    
                    <div className="space-y-3">
                      <Button 
                        onClick={startMission}
                        disabled={missionProgress > 0 && missionProgress < 100}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <Rocket className="w-4 h-4 mr-2" />
                        {missionProgress === 0 ? 'Iniciar Missão' : 
                         missionProgress === 100 ? 'Nova Missão' : 'Missão em Andamento...'}
                      </Button>

                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="outline" 
                          className="border-white/20 text-white hover:bg-white/10"
                          onClick={() => setActiveSystem('camera')}
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Câmera
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-white/20 text-white hover:bg-white/10"
                          onClick={() => setActiveSystem('drill')}
                        >
                          🔬
                          Perfurador
                        </Button>
                      </div>
                    </div>

                    {activeSystem && (
                      <div className="p-4 bg-blue-600/20 rounded-lg border border-blue-400/30">
                        <h4 className="font-semibold text-blue-300 mb-2">
                          {activeSystem === 'camera' ? 'Sistema de Câmera Ativo' : 'Perfurador Ativo'}
                        </h4>
                        <p className="text-sm text-gray-300">
                          {activeSystem === 'camera' 
                            ? 'Capturando imagens da superfície planetária...'
                            : 'Coletando amostras do solo para análise...'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="programming" className="space-y-6">
            <Card className="bg-black/40 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Programação da Sonda</CardTitle>
                <CardDescription className="text-gray-300">
                  Desenvolva a lógica de exploração autônoma usando blocos de programação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-white">Blocos Disponíveis para Exploração Espacial:</h3>
                    
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-600/20 rounded-lg border border-blue-400/30">
                        <h4 className="font-semibold text-blue-300">🚀 Navegação</h4>
                        <p className="text-sm text-gray-300">Mover para frente, girar, parar</p>
                      </div>
                      
                      <div className="p-3 bg-green-600/20 rounded-lg border border-green-400/30">
                        <h4 className="font-semibold text-green-300">📡 Sensores</h4>
                        <p className="text-sm text-gray-300">Ler temperatura, detectar obstáculos, medir radiação</p>
                      </div>
                      
                      <div className="p-3 bg-purple-600/20 rounded-lg border border-purple-400/30">
                        <h4 className="font-semibold text-purple-300">🔧 Ferramentas</h4>
                        <p className="text-sm text-gray-300">Ativar perfurador, tirar foto, coletar amostra</p>
                      </div>
                      
                      <div className="p-3 bg-yellow-600/20 rounded-lg border border-yellow-400/30">
                        <h4 className="font-semibold text-yellow-300">📊 Comunicação</h4>
                        <p className="text-sm text-gray-300">Enviar dados, receber comandos, emergência</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-white">Missões Programáveis:</h3>
                    
                    <div className="space-y-3">
                      <Card className="bg-white/10 border-white/20">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-white mb-2">🗺️ Mapeamento Automático</h4>
                          <p className="text-sm text-gray-300 mb-3">
                            Programe a sonda para mapear uma área quadrada
                          </p>
                          <Link href="/editor-offline">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              Programar Missão
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>

                      <Card className="bg-white/10 border-white/20">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-white mb-2">🔍 Busca por Vida</h4>
                          <p className="text-sm text-gray-300 mb-3">
                            Detecte sinais de vida usando sensores especializados
                          </p>
                          <Link href="/editor-offline">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Programar Busca
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>

                      <Card className="bg-white/10 border-white/20">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-white mb-2">⚠️ Missão de Emergência</h4>
                          <p className="text-sm text-gray-300 mb-3">
                            Retorno automático em caso de tempestade solar
                          </p>
                          <Link href="/editor-offline">
                            <Button size="sm" className="bg-red-600 hover:bg-red-700">
                              Programar Emergência
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="simulation" className="space-y-6">
            <Card className="bg-black/40 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Simulador de Exoplaneta</CardTitle>
                <CardDescription className="text-gray-300">
                  Teste sua sonda em diferentes ambientes planetários
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="bg-red-600/20 border-red-400/30">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">🔴</div>
                      <h3 className="font-semibold text-red-300">Kepler-442b</h3>
                      <p className="text-sm text-gray-300">Planeta rochoso com atmosfera densa</p>
                      <Button size="sm" className="mt-3 bg-red-600 hover:bg-red-700" disabled>
                        Simular Exploração
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-600/20 border-blue-400/30">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">🔵</div>
                      <h3 className="font-semibold text-blue-300">Proxima-B</h3>
                      <p className="text-sm text-gray-300">Mundo oceânico com gelo superficial</p>
                      <Button size="sm" className="mt-3 bg-blue-600 hover:bg-blue-700" disabled>
                        Simular Exploração
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-yellow-600/20 border-yellow-400/30">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">🟡</div>
                      <h3 className="font-semibold text-yellow-300">TRAPPIST-1e</h3>
                      <p className="text-sm text-gray-300">Planeta com potencial para vida</p>
                      <Button size="sm" className="mt-3 bg-yellow-600 hover:bg-yellow-700" disabled>
                        Simular Exploração
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="p-6 bg-white/10 rounded-lg border border-white/20">
                  <h3 className="font-semibold text-white mb-4">Ambiente de Simulação 3D</h3>
                  <div className="aspect-video bg-black/50 rounded-lg border border-white/20 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <Rocket className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Simulador 3D será implementado</p>
                      <p className="text-sm">Visualize sua sonda explorando diferentes terrenos</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Card className="bg-black/40 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Análise de Dados Científicos</CardTitle>
                <CardDescription className="text-gray-300">
                  Analise os dados coletados pela sua sonda espacial
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-white">Dados Coletados</h3>
                    
                    <div className="space-y-3">
                      <div className="p-4 bg-white/10 rounded-lg">
                        <h4 className="font-semibold text-blue-300 mb-2">🌡️ Dados de Temperatura</h4>
                        <div className="text-sm text-gray-300 space-y-1">
                          <p>Mínima: -89°C (noite)</p>
                          <p>Máxima: 47°C (dia)</p>
                          <p>Variação: 136°C</p>
                        </div>
                      </div>

                      <div className="p-4 bg-white/10 rounded-lg">
                        <h4 className="font-semibold text-green-300 mb-2">🧪 Análise do Solo</h4>
                        <div className="text-sm text-gray-300 space-y-1">
                          <p>Ferro: 32%</p>
                          <p>Silício: 28%</p>
                          <p>Água congelada: 12%</p>
                        </div>
                      </div>

                      <div className="p-4 bg-white/10 rounded-lg">
                        <h4 className="font-semibold text-purple-300 mb-2">📡 Radiação</h4>
                        <div className="text-sm text-gray-300 space-y-1">
                          <p>Nível: Moderado</p>
                          <p>Proteção necessária para humanos</p>
                          <p>Seguro para robôs</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-white">Descobertas Importantes</h3>
                    
                    <div className="space-y-3">
                      <Card className="bg-green-600/20 border-green-400/30">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-green-300 mb-2">✅ Água Descoberta!</h4>
                          <p className="text-sm text-gray-300">
                            Depósitos de gelo encontrados a 2 metros de profundidade
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-yellow-600/20 border-yellow-400/30">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-yellow-300 mb-2">⚠️ Compostos Orgânicos</h4>
                          <p className="text-sm text-gray-300">
                            Moléculas orgânicas complexas detectadas
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-blue-600/20 border-blue-400/30">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-blue-300 mb-2">🔍 Estruturas Minerais</h4>
                          <p className="text-sm text-gray-300">
                            Formações cristalinas nunca vistas na Terra
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="p-4 bg-white/10 rounded-lg">
                      <h4 className="font-semibold text-white mb-2">📊 Relatório Final</h4>
                      <p className="text-sm text-gray-300 mb-3">
                        Compile suas descobertas em um relatório científico completo
                      </p>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        Gerar Relatório
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recursos Adicionais */}
        <Card className="bg-black/40 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Recursos de Aprendizagem</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-600/20 rounded-lg border border-blue-400/30">
                <h3 className="font-semibold text-blue-300 mb-2">📚 Materiais de Estudo</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• História da exploração espacial</li>
                  <li>• Física dos foguetes</li>
                  <li>• Vida no universo</li>
                </ul>
              </div>
              
              <div className="p-4 bg-green-600/20 rounded-lg border border-green-400/30">
                <h3 className="font-semibold text-green-300 mb-2">🎯 Desafios Extras</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Programa multimissão</li>
                  <li>• Otimização de energia</li>
                  <li>• Comunicação interestelar</li>
                </ul>
              </div>
              
              <div className="p-4 bg-purple-600/20 rounded-lg border border-purple-400/30">
                <h3 className="font-semibold text-purple-300 mb-2">🏆 Competições</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Missão mais eficiente</li>
                  <li>• Maior distância explorada</li>
                  <li>• Descoberta mais importante</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
