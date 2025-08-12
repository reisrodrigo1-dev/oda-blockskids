import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CodePanelProps {
  code: string;
  onUploadToArduino?: () => void;
}

export default function CodePanel({ code, onUploadToArduino }: CodePanelProps) {
  const [activeTab, setActiveTab] = useState<'code' | 'serial'>('code');
  const [serialMessages, setSerialMessages] = useState([
    '[14:32:15] 🚀 Arduino iniciado!',
    '[14:32:16] LED aceso',
    '[14:32:17] LED apagado',
    '[14:32:18] LED aceso',
    '[14:32:19] LED apagado',
    'Aguardando dados...'
  ]);
  const [serialInput, setSerialInput] = useState('');

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      // Could show a toast here
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const saveCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'arduino_blocks_code.ino';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearSerial = () => {
    setSerialMessages(['Aguardando dados...']);
  };

  const sendSerialCommand = () => {
    if (serialInput.trim()) {
      const timestamp = new Date().toLocaleTimeString();
      setSerialMessages(prev => [...prev, `[${timestamp}] Enviado: ${serialInput}`]);
      setSerialInput('');
    }
  };

  return (
    <div className="w-96 bg-white shadow-lg border-l-2 border-gray-200 flex flex-col">
      {/* Tab Headers */}
      <div className="border-b-2 border-gray-200 flex">
        <button 
          onClick={() => setActiveTab('code')}
          className={`flex-1 py-3 px-4 font-bold text-sm border-r border-gray-200 flex items-center justify-center transition-colors ${
            activeTab === 'code' 
              ? 'bg-kid-blue text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          Código Arduino
        </button>
        <button 
          onClick={() => setActiveTab('serial')}
          className={`flex-1 py-3 px-4 font-bold text-sm flex items-center justify-center transition-colors ${
            activeTab === 'serial' 
              ? 'bg-kid-blue text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Monitor Serial
        </button>
      </div>

      {/* Code Tab Content */}
      {activeTab === 'code' && (
        <div className="flex-1 flex flex-col">
          <div className="p-4 bg-gray-100 border-b border-gray-200">
            <h3 className="font-bold text-sm text-gray-700 mb-2 flex items-center">
              <svg className="w-4 h-4 text-kid-purple mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              Código gerado automaticamente
            </h3>
            <p className="text-xs text-gray-600">Este código é criado pelos seus blocos!</p>
          </div>
          
          <div className="flex-1 bg-gray-900 text-green-400 font-mono text-sm overflow-y-auto">
            <div className="p-4">
              <pre className="whitespace-pre-wrap">{code}</pre>
            </div>
          </div>

          {/* Code Actions */}
          <div className="p-4 bg-gray-100 border-t border-gray-200 flex space-x-2">
            {onUploadToArduino && (
              <Button
                onClick={onUploadToArduino}
                variant="outline"
                size="sm"
                className="bg-kid-purple hover:bg-purple-600 text-white border-none font-semibold"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload
              </Button>
            )}
            <Button
              onClick={copyCode}
              variant="outline"
              size="sm"
              className="bg-kid-blue hover:bg-blue-600 text-white border-none font-semibold"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copiar
            </Button>
            <Button
              onClick={saveCode}
              variant="outline"
              size="sm"
              className="bg-gray-400 hover:bg-gray-500 text-white border-none font-semibold"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Salvar
            </Button>
          </div>
        </div>
      )}

      {/* Serial Monitor Tab Content */}
      {activeTab === 'serial' && (
        <div className="flex-1 flex flex-col">
          <div className="p-4 bg-gray-100 border-b border-gray-200">
            <h3 className="font-bold text-sm text-gray-700 mb-2 flex items-center">
              <svg className="w-4 h-4 text-kid-green mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              </svg>
              Monitor Serial
            </h3>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Taxa: 9600 baud</span>
              <Button
                onClick={clearSerial}
                size="sm"
                variant="destructive"
                className="h-6 px-2 text-xs"
              >
                Limpar
              </Button>
            </div>
          </div>
          
          <div className="flex-1 bg-black text-green-400 font-mono text-sm overflow-y-auto">
            <div className="p-4">
              <div className="space-y-1">
                {serialMessages.map((message, index) => (
                  <div 
                    key={index} 
                    className={index === 0 ? 'text-yellow-400' : index === serialMessages.length - 1 ? 'text-gray-500' : ''}
                  >
                    {message}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Serial Input */}
          <div className="p-4 bg-gray-100 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={serialInput}
                onChange={(e) => setSerialInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendSerialCommand()}
                placeholder="Enviar comando..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-kid-blue"
              />
              <Button
                onClick={sendSerialCommand}
                size="sm"
                className="bg-kid-green hover:bg-green-500 text-white font-semibold"
              >
                Enviar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
