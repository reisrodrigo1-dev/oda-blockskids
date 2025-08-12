import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useArduinoSerial } from '@/hooks/use-arduino-serial';

interface ArduinoPanelProps {
  code: string;
}

const ArduinoPanel: React.FC<ArduinoPanelProps> = ({ code }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [serialData, setSerialData] = useState<string[]>([]);
  const { 
    isConnected, 
    isConnecting, 
    isUploading,
    uploadProgress,
    error, 
    connect, 
    disconnect, 
    sendCode,
    uploadCode,
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

  const handleUploadCode = async () => {
    try {
      const success = await uploadCode(code);
      if (success) {
        setSerialData(prev => [...prev, `✅ Upload concluído com sucesso!`]);
      } else {
        setSerialData(prev => [...prev, `❌ Falha no upload`]);
      }
    } catch (err) {
      console.error('Erro no upload:', err);
      setSerialData(prev => [...prev, `❌ Erro no upload: ${err}`]);
    }
  };

  const handleDownloadSketch = () => {
    // Criar arquivo .ino para download (backup option)
    const sketchContent = `// Sketch gerado pelo BlockuinoEditor
// Este arquivo deve ser aberto no Arduino IDE para upload

${code}
`;
    
    const blob = new Blob([sketchContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blockuino_sketch.ino';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

          {/* Aviso sobre Web Serial API */}
          {!isConnected && !isUploading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-blue-500">ℹ️</span>
                <div>
                  <p className="font-medium text-blue-800">Upload Direto Arduino:</p>
                  <ul className="text-blue-700 mt-1 space-y-1">
                    <li>• Funciona apenas no Chrome/Edge</li>
                    <li>• Upload direto para o Arduino</li>
                    <li>• Backup: baixar arquivo .ino</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Progresso do Upload */}
          {isUploading && (
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
            {/* Upload Direto - Botão Principal */}
            <Button 
              onClick={handleUploadCode}
              disabled={isUploading || isConnecting}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              variant="default"
            >
              {isUploading ? (
                <>🔄 Fazendo Upload... {uploadProgress}%</>
              ) : (
                <>🚀 Upload Direto para Arduino</>
              )}
            </Button>
            
            {/* Monitoramento Serial */}
            <Button 
              onClick={handleSendCode}
              disabled={!isConnected || isUploading}
              className="w-full"
              variant="outline"
            >
              📤 Enviar via Serial
            </Button>
            
            {/* Download .ino (backup) */}
            <Button 
              onClick={handleDownloadSketch}
              disabled={isUploading}
              className="w-full"
              variant="outline"
            >
              💾 Baixar .ino (backup)
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
