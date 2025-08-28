import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useArduinoSerial } from '@/hooks/use-arduino-serial';

interface ArduinoPanelProps {
  code: string;
}

const ArduinoPanel: React.FC<ArduinoPanelProps> = ({ code }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [serialData, setSerialData] = useState<string[]>([]);
  const [extensionStatus, setExtensionStatus] = useState<{
      available: boolean;
      nativeConnected: boolean;
      checking: boolean;
    }>({ available: false, nativeConnected: false, checking: true });
  
  const { 
    isConnected, 
    isConnecting, 
    isUploading,
    isCompiling,
    uploadProgress,
    compilationProgress,
    error, 
    connect, 
    disconnect, 
    sendCode,
    uploadCode,
    compileAndUpload,
    readData 
  } = useArduinoSerial();

  const handleConnect = async () => {
    try {
      await connect();
      // Começar a ler dados seriais
      const interval = setInterval(async () => {
        const data = await readData();
        if (data) {
          setSerialData(prev => [...prev.slice(-50), data]); // Manter apenas as últimas 50 mensagens
        }
      }, 100);
      
      return () => clearInterval(interval);
    } catch (err) {
      console.error('Erro ao conectar:', err);
    }
  };

  // Verificar status da extensão
  const checkExtension = async () => {
    console.log('🔍 checkExtension iniciado...');
    setExtensionStatus(prev => ({ ...prev, checking: true }));
    
    try {
      if (typeof window !== 'undefined' && (window as any).BlockuinoArduino) {
        console.log('✅ BlockuinoArduino encontrado, verificando status...');
        const status = await (window as any).BlockuinoArduino.checkExtension();
        console.log('📊 Status da extensão:', status);
        setExtensionStatus({
          available: status.available,
          nativeConnected: status.nativeConnected,
          checking: false
        });
      } else {
        console.log('❌ BlockuinoArduino não encontrado');
        setExtensionStatus({
          available: false,
          nativeConnected: false,
          checking: false
        });
      }
    } catch (error) {
      console.error('❌ Erro ao verificar extensão:', error);
      setExtensionStatus({
        available: false,
        nativeConnected: false,
        checking: false
      });
    }
  };

  // Upload via extensão
  const handleExtensionUpload = async () => {
    try {
      setSerialData(prev => [...prev, '🔄 Iniciando upload via extensão...']);
      
      const result = await (window as any).BlockuinoArduino.uploadCode(code, {
        board: 'arduino:avr:uno',
        port: 'auto'
      });
      
      setSerialData(prev => [...prev, '✅ Upload concluído via extensão!']);
      setSerialData(prev => [...prev, `📄 ${result.message || 'Código enviado para Arduino'}`]);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setSerialData(prev => [...prev, `❌ Erro na extensão: ${errorMessage}`]);
    }
  };

  // Verificar extensão ao montar componente
  React.useEffect(() => {
    console.log('🔧 ArduinoPanel montado, verificando extensão...');
    
    // Aguardar a API da extensão carregar
    const handleExtensionReady = () => {
      console.log('🎉 Evento blockuino-arduino-ready recebido');
      checkExtension();
    };
    
    if (typeof window !== 'undefined') {
      console.log('🌐 Window disponível, verificando BlockuinoArduino...');
      console.log('🔗 window.BlockuinoArduino:', (window as any).BlockuinoArduino);
      
      if ((window as any).BlockuinoArduino) {
        console.log('✅ BlockuinoArduino já disponível');
        checkExtension();
      } else {
        console.log('⏰ Aguardando BlockuinoArduino...');
        window.addEventListener('blockuino-arduino-ready', handleExtensionReady);
        
        // Fallback: verificar após 2 segundos
        setTimeout(() => {
          console.log('⏰ Timeout - verificando extensão...');
          checkExtension();
        }, 2000);
      }
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('blockuino-arduino-ready', handleExtensionReady);
      }
    };
  }, []);

  const handleDisconnect = () => {
    disconnect();
    setSerialData([]);
  };

  const handleSendCode = async () => {
    try {
      await sendCode(code);
      setSerialData(prev => [...prev, `Enviado: ${code.split('\n')[0]}...`]);
    } catch (err) {
      console.error('Erro ao enviar código:', err);
    }
  };

  const handleCompileAndUpload = async () => {
    try {
      const success = await compileAndUpload(code);
      if (success) {
        setSerialData(prev => [...prev, `🎉 Compilação e Upload concluídos!`]);
      } else {
        setSerialData(prev => [...prev, `❌ Falha na compilação/upload`]);
      }
    } catch (err) {
      console.error('Erro na compilação/upload:', err);
      setSerialData(prev => [...prev, `❌ Erro: ${err}`]);
    }
  };

  const handleUploadCode = async () => {
    try {
      const success = await uploadCode(code);
      if (success) {
        setSerialData(prev => [...prev, `✅ Código enviado via Serial!`]);
        setSerialData(prev => [...prev, `⚠️ Para upload real: use Arduino IDE`]);
      } else {
        setSerialData(prev => [...prev, `❌ Falha no envio`]);
      }
    } catch (err) {
      console.error('Erro no envio:', err);
      setSerialData(prev => [...prev, `❌ Erro no envio: ${err}`]);
    }
  };

  // Nova função: Abrir diretamente no Arduino IDE
  const handleOpenInArduinoIDE = () => {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const sketchName = `blockuino_sketch_${timestamp}`;
    const sketchContent = `/*
 * Sketch gerado pelo BlockuinoEditor
 * Data/Hora: ${timestamp}
 *
 * ⚙️ CONFIGURAÇÕES PRÉ-DEFINIDAS:
 * - Placa: Arduino Uno
 * - Porta: Será detectada automaticamente
 *
 * INSTRUÇÕES PARA UPLOAD:
 * 1. Este arquivo já está pronto para upload
 * 2. Conecte seu Arduino via USB
 * 3. Verifique se a placa e porta estão corretas
 * 4. Clique em Upload (→) no Arduino IDE
 */

${code}

/*
 * NOTAS:
 * - Código gerado automaticamente pelos blocos
 * - Configurações otimizadas para Arduino Uno
 * - Verifique se todas as bibliotecas necessárias estão instaladas
 */
`;

    // Criar arquivo .ino
    const inoBlob = new Blob([sketchContent], { type: 'text/plain' });
    const inoUrl = URL.createObjectURL(inoBlob);
    const inoLink = document.createElement('a');
    inoLink.href = inoUrl;
    inoLink.download = `${sketchName}.ino`;
    document.body.appendChild(inoLink);
    inoLink.click();
    document.body.removeChild(inoLink);
    URL.revokeObjectURL(inoUrl);

    // Criar arquivo .bat para abrir Arduino IDE com configurações
    const batchContent = `@echo off
REM Batch file para abrir Arduino IDE com configurações pré-definidas
REM Gerado pelo BlockuinoEditor em ${timestamp}
REM Configurações: Arduino Uno na porta COM3

REM Criar pasta para o sketch
if not exist "%~dp0${sketchName}" mkdir "%~dp0${sketchName}"

REM Verificar se o arquivo .ino existe
if not exist "%~dp0${sketchName}.ino" (
    echo ❌ Arquivo .ino não encontrado: %~dp0${sketchName}.ino
    pause
    exit /b 1
)

REM Mover arquivo .ino para a pasta
move "%~dp0${sketchName}.ino" "%~dp0${sketchName}" >nul 2>&1

REM Verificar se o Arduino IDE está instalado
set ARDUINO_PATH="C:\\Program Files\\Arduino\\arduino.exe"
if not exist %ARDUINO_PATH% (
    echo ❌ Arduino IDE não encontrado no caminho padrão.
    pause
    exit /b 1
)

REM Abrir Arduino IDE com o arquivo .ino
start "" %ARDUINO_PATH% "%~dp0${sketchName}\\${sketchName}.ino"
pause`;

    const batchBlob = new Blob([batchContent], { type: 'text/plain' });
    const batchUrl = URL.createObjectURL(batchBlob);
    const batchLink = document.createElement('a');
    batchLink.href = batchUrl;
    batchLink.download = `abrir_arduino_${timestamp}.bat`;
    document.body.appendChild(batchLink);
    batchLink.click();
    document.body.removeChild(batchLink);
    URL.revokeObjectURL(batchUrl);

    setSerialData(prev => [...prev, `🖥️ Arquivos criados!`]);
    setSerialData(prev => [...prev, `📁 ${sketchName}/${sketchName}.ino`]);
    setSerialData(prev => [...prev, `⚙️ abrir_arduino_${timestamp}.bat`]);
    setSerialData(prev => [...prev, `🚀 Execute o arquivo .bat para abrir o Arduino IDE automaticamente!`]);
  };

  const handleCompileAndDownload = () => {
    // Criar arquivo .ino mais completo para upload real
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const sketchContent = `/*
 * Sketch gerado pelo BlockuinoEditor
 * Data/Hora: ${timestamp}
 * 
 * INSTRUÇÕES PARA UPLOAD:
 * 1. Salve este arquivo como "sketch.ino"
 * 2. Abra no Arduino IDE
 * 3. Conecte seu Arduino via USB
 * 4. Selecione a placa correta (Tools > Board)
 * 5. Selecione a porta correta (Tools > Port)
 * 6. Clique em Upload (→) no Arduino IDE
 */

${code}

/*
 * NOTAS:
 * - Verifique se todas as bibliotecas necessárias estão instaladas
 * - Certifique-se de que a placa e porta estão selecionadas corretamente
 * - Se houver erros, verifique a sintaxe do código
 */
`;
    
    const blob = new Blob([sketchContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blockuino_sketch_${timestamp}.ino`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setSerialData(prev => [...prev, `💾 Arquivo .ino baixado! Use no Arduino IDE para upload real.`]);
  };

  return (
    <div className="fixed bottom-0 right-0 z-50 bg-white border-l border-t border-gray-200 shadow-lg transition-all duration-300"
         style={{ 
           width: isExpanded ? '400px' : '60px',
           height: isExpanded ? '500px' : '60px'
         }}>
      
      {/* Toggle Button */}
      <div className="absolute top-2 right-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 w-8 p-0"
        >
          {isExpanded ? '✕' : '🔧'}
        </Button>
      </div>

      {isExpanded && (
        <div className="p-4 h-full flex flex-col">
          <h3 className="text-lg font-semibold mb-4 text-blue-600">
            🤖 Painel Arduino
          </h3>

          {/* Status de Conexão */}
          <div className="mb-4">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
              isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                isConnected ? 'bg-green-500' : 'bg-gray-400'
              }`} />
              {isConnected ? 'Conectado' : 'Desconectado'}
            </div>
          </div>

          {/* Controles de Conexão */}
          <div className="flex gap-2 mb-4">
            {!isConnected ? (
              <Button 
                onClick={handleConnect}
                disabled={isConnecting}
                className="flex-1"
              >
                {isConnecting ? 'Conectando...' : 'Conectar Arduino'}
              </Button>
            ) : (
              <Button 
                onClick={handleDisconnect}
                variant="outline"
                className="flex-1"
              >
                Desconectar
              </Button>
            )}
          </div>

          {/* Status da Extensão */}
          {!extensionStatus.checking && (
            <div className={`border rounded-lg p-3 mb-4 text-sm ${
              extensionStatus.available && extensionStatus.nativeConnected
                ? 'bg-purple-50 border-purple-200'
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-start gap-2">
                <span className={
                  extensionStatus.available && extensionStatus.nativeConnected
                    ? 'text-purple-500'
                    : 'text-yellow-500'
                }>
                  {extensionStatus.available && extensionStatus.nativeConnected ? '⚡' : '🔌'}
                </span>
                <div>
                  <p className={`font-medium ${
                    extensionStatus.available && extensionStatus.nativeConnected
                      ? 'text-purple-800'
                      : 'text-yellow-800'
                  }`}>
                    {extensionStatus.available && extensionStatus.nativeConnected
                      ? 'Upload Direto Disponível!'
                      : 'Upload Direto (Instalar Extensão)'
                    }
                  </p>
                  <ul className={`mt-1 space-y-1 ${
                    extensionStatus.available && extensionStatus.nativeConnected
                      ? 'text-purple-700'
                      : 'text-yellow-700'
                  }`}>
                    {extensionStatus.available && extensionStatus.nativeConnected ? (
                      <>
                        <li>• <strong>Compilação:</strong> Arduino CLI nativo</li>
                        <li>• <strong>Upload:</strong> Direto para Arduino Uno</li>
                      </>
                    ) : (
                      <>
                        <li>• Instale a extensão do Chrome</li>
                        <li>• Instale o app nativo</li>
                        <li>• <strong>Resultado:</strong> Upload real sem Arduino IDE</li>
                      </>
                    )}
                  </ul>
                  {!extensionStatus.available && (
                    <button
                      onClick={() => window.open('https://github.com/seu-usuario/blockuino-extension', '_blank')}
                      className="mt-2 text-xs bg-yellow-200 hover:bg-yellow-300 px-2 py-1 rounded"
                    >
                      Baixar Extensão
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Aviso sobre Web Serial API e Upload Real */}
          {!isConnected && !isUploading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-blue-500">ℹ️</span>
                <div>
                  <p className="font-medium text-blue-800">Como Fazer Upload Real:</p>
                  <ul className="text-blue-700 mt-1 space-y-1">
                    <li>• <strong>Via Serial:</strong> Envia código via porta serial</li>
                    <li>• <strong>Upload Real:</strong> Baixe .ino e use Arduino IDE</li>
                    <li>• <strong>Navegador:</strong> Funciona no Chrome/Edge</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Instrução durante upload */}
          {isConnected && !isUploading && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-500">✅</span>
                <div>
                  <p className="font-medium text-green-800">Arduino Conectado!</p>
                  <ul className="text-green-700 mt-1 space-y-1">
                    <li>• <strong>Enviar Serial:</strong> Transmite código via serial</li>
                    <li>• <strong>Para compilar:</strong> Baixe .ino e use Arduino IDE</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Progresso da Compilação */}
          {isCompiling && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-500">🔨</span>
                <p className="font-medium text-blue-800">Compilando Código...</p>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${compilationProgress}%` }}
                />
              </div>
              <p className="text-blue-700 text-sm mt-1">{compilationProgress}% concluído</p>
            </div>
          )}

          {/* Progresso do Upload */}
          {isUploading && !isCompiling && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-500">🚀</span>
                <p className="font-medium text-green-800">Fazendo Upload...</p>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-green-700 text-sm mt-1">{uploadProgress}% concluído</p>
            </div>
          )}

          {/* Ações */}
          <div className="space-y-2 mb-4">
            {/* Upload Direto via Extensão */}
            {extensionStatus.available && extensionStatus.nativeConnected && (
              <Button
                onClick={handleExtensionUpload}
                disabled={isUploading || isConnecting}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                variant="default"
              >
                ⚡ Upload Direto (Arduino CLI)
              </Button>
            )}

            {/* Novo Botão: Abrir no Arduino IDE */}
            <Button 
              onClick={handleOpenInArduinoIDE}
              disabled={isUploading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              variant="default"
            >
              🖥️ Abrir no Arduino IDE
            </Button>

            {/* Envio via Serial */}
            <Button 
              onClick={handleUploadCode}
              disabled={isUploading || isConnecting || !isConnected}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              variant="default"
            >
              {isUploading ? (
                <>🔄 Enviando via Serial... {uploadProgress}%</>
              ) : (
                <>📡 Enviar via Serial</>
              )}
            </Button>
            
            {/* Download para Arduino IDE - Botão Principal para Upload Real */}
            <Button 
              onClick={handleCompileAndDownload}
              disabled={isUploading}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              variant="default"
            >
              💾 Baixar para Arduino IDE (Upload Real)
            </Button>
            
            {/* Monitoramento Serial */}
            <Button 
              onClick={handleSendCode}
              disabled={!isConnected || isUploading}
              className="w-full"
              variant="outline"
            >
              📨 Enviar Comando Serial
            </Button>
          </div>

          {/* Monitor Serial */}
          {isConnected && (
            <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 text-sm font-medium">
                Monitor Serial
              </div>
              <div className="h-32 overflow-y-auto p-2 bg-black text-green-400 font-mono text-xs">
                {serialData.length === 0 ? (
                  <div className="text-gray-500">Aguardando dados...</div>
                ) : (
                  serialData.map((data, index) => (
                    <div key={index}>{data}</div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Erro */}
          {error && (
            <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-red-500">⚠️</span>
                <div>
                  <p className="font-medium text-red-800">Erro:</p>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ArduinoPanel;
