import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useArduinoSerial } from '../hooks/use-arduino-serial';

interface ArduinoPanelProps {
  code: string;
}

export default function ArduinoPanel({ code }: ArduinoPanelProps) {
  const { isConnected, isSupported, connect, disconnect, sendCode } = useArduinoSerial();
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  const showMessage = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleConnect = async () => {
    if (isConnected) {
      await disconnect();
      showMessage('Arduino desconectado', 'info');
    } else {
      const connected = await connect({ baudRate: 9600 });
      if (connected) {
        showMessage('Arduino conectado com sucesso!', 'success');
      } else {
        showMessage('Erro ao conectar com Arduino. Verifique a conexão.', 'error');
      }
    }
  };

  const handleUpload = async () => {
    if (!isConnected) {
      showMessage('Conecte-se ao Arduino primeiro', 'error');
      return;
    }

    if (!code.trim()) {
      showMessage('Nenhum código para enviar', 'error');
      return;
    }

    setUploading(true);
    try {
      const success = await sendCode(code);
      if (success) {
        showMessage('Código enviado com sucesso!', 'success');
      } else {
        showMessage('Erro ao enviar código', 'error');
      }
    } catch (error) {
      showMessage('Erro ao enviar código', 'error');
    }
    setUploading(false);
  };

  if (!isSupported) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-bold text-red-800">Web Serial não suportado</h3>
            <p className="text-sm text-red-700">
              Esta funcionalidade requer Chrome, Edge ou outro navegador baseado em Chromium.
            </p>
            <p className="text-xs text-red-600 mt-1">
              Alternativa: Copie o código e cole no Arduino IDE.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 m-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🤖</span>
          <h3 className="font-bold text-gray-800">Arduino Direct Upload</h3>
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>
        <div className="text-xs text-gray-500">
          {isConnected ? 'Conectado' : 'Desconectado'}
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          messageType === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
          messageType === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
          'bg-blue-100 text-blue-800 border border-blue-200'
        }`}>
          {message}
        </div>
      )}

      {/* Connection Instructions */}
      {!isConnected && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">📋 Como conectar:</h4>
          <ol className="text-sm text-gray-600 space-y-1">
            <li>1. Conecte seu Arduino ao computador via USB</li>
            <li>2. Clique em "Conectar Arduino"</li>
            <li>3. Selecione a porta COM do Arduino</li>
            <li>4. Clique em "Enviar Código" para programar</li>
          </ol>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button
          onClick={handleConnect}
          className={`w-full ${isConnected 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-blue-500 hover:bg-blue-600'
          } text-white font-bold py-2 px-4 rounded-lg transition-colors`}
        >
          {isConnected ? '🔌 Desconectar Arduino' : '🔗 Conectar Arduino'}
        </Button>

        {isConnected && (
          <Button
            onClick={handleUpload}
            disabled={uploading || !code.trim()}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            {uploading ? (
              <>
                <span className="inline-block animate-spin mr-2">⏳</span>
                Enviando...
              </>
            ) : (
              '📤 Enviar Código para Arduino'
            )}
          </Button>
        )}
      </div>

      {/* Technical Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-700 mb-2">🔧 Informações Técnicas:</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <div>• Taxa de transmissão: 9600 baud</div>
          <div>• Protocolo: Serial USB</div>
          <div>• Compatível com: Arduino Uno, Nano, Mega</div>
          <div>• Navegadores: Chrome, Edge, Opera</div>
        </div>
      </div>

      {/* Advanced Options */}
      {isConnected && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-semibold text-gray-700">
            ⚙️ Opções Avançadas
          </summary>
          <div className="mt-2 p-3 bg-gray-50 rounded-lg space-y-2">
            <Button
              onClick={() => showMessage('Monitor serial não implementado ainda', 'info')}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-1 px-2 rounded"
            >
              📊 Monitor Serial (Em breve)
            </Button>
            <div className="text-xs text-gray-500">
              Funcionalidades futuras: Monitor serial, debug em tempo real, upload de bibliotecas.
            </div>
          </div>
        </details>
      )}
    </div>
  );
}
