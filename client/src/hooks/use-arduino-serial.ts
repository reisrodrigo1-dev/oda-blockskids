import { useState, useCallback } from 'react';
import { arduinoCompiler } from '@/lib/arduino-compiler';

// Declaração de tipos para Web Serial API
declare global {
  interface Navigator {
    serial: {
      requestPort(): Promise<SerialPort>;
      getPorts(): Promise<SerialPort[]>;
    };
  }
  
  interface SerialPort {
    open(options: { baudRate: number }): Promise<void>;
    close(): Promise<void>;
    readable: ReadableStream<Uint8Array> | null;
    writable: WritableStream<Uint8Array> | null;
  }
}

interface SerialOptions {
  baudRate?: number;
}

interface ArduinoSerial {
  isConnected: boolean;
  isConnecting: boolean;
  isUploading: boolean;
  isCompiling: boolean;
  uploadProgress: number;
  compilationProgress: number;
  isSupported: boolean;
  port: SerialPort | null;
  error: string | null;
  connect: (options?: SerialOptions) => Promise<boolean>;
  disconnect: () => Promise<void>;
  sendCode: (code: string) => Promise<boolean>;
  uploadCode: (code: string) => Promise<boolean>;
  compileAndUpload: (code: string) => Promise<boolean>;
  readData: () => Promise<string>;
}

export const useArduinoSerial = (): ArduinoSerial => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [compilationProgress, setCompilationProgress] = useState(0);
  const [port, setPort] = useState<SerialPort | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Verificar se o navegador suporta Web Serial API
  const isSupported = 'serial' in navigator;

  const connect = useCallback(async (options: SerialOptions = { baudRate: 9600 }): Promise<boolean> => {
    if (!isSupported) {
      const errorMsg = 'Web Serial API não suportada neste navegador. Use Chrome/Edge mais recente.';
      console.error(errorMsg);
      setError(errorMsg);
      return false;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Solicitar acesso à porta serial
      const selectedPort = await navigator.serial.requestPort();
      
      // Abrir a porta com as opções especificadas
      await selectedPort.open({ baudRate: options.baudRate || 9600 });
      
      setPort(selectedPort);
      setIsConnected(true);
      setError(null);
      
      console.log('Arduino conectado com sucesso!');
      return true;
    } catch (error: any) {
      const errorMsg = `Erro ao conectar com Arduino: ${error.message}`;
      console.error(errorMsg);
      setError(errorMsg);
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [isSupported]);

  const disconnect = useCallback(async (): Promise<void> => {
    if (port && isConnected) {
      try {
        await port.close();
        setPort(null);
        setIsConnected(false);
        setError(null);
        console.log('Arduino desconectado');
      } catch (error: any) {
        const errorMsg = `Erro ao desconectar Arduino: ${error.message}`;
        console.error(errorMsg);
        setError(errorMsg);
      }
    }
  }, [port, isConnected]);

  const sendCode = useCallback(async (code: string): Promise<boolean> => {
    if (!port || !isConnected) {
      const errorMsg = 'Arduino não está conectado';
      console.error(errorMsg);
      setError(errorMsg);
      return false;
    }

    try {
      const writer = port.writable?.getWriter();
      if (!writer) {
        const errorMsg = 'Não foi possível obter o writer da porta';
        console.error(errorMsg);
        setError(errorMsg);
        return false;
      }

      // Converter o código para bytes
      const encoder = new TextEncoder();
      const data = encoder.encode(code + '\n');
      
      // Enviar o código
      await writer.write(data);
      writer.releaseLock();
      
      console.log('Código enviado para o Arduino');
      setError(null);
      return true;
    } catch (error: any) {
      const errorMsg = `Erro ao enviar código: ${error.message}`;
      console.error(errorMsg);
      setError(errorMsg);
      return false;
    }
  }, [port, isConnected]);

  const uploadCode = useCallback(async (code: string): Promise<boolean> => {
    if (!port || !isConnected) {
      const errorMsg = 'Arduino não está conectado. Conecte o Arduino primeiro.';
      console.error(errorMsg);
      setError(errorMsg);
      return false;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      console.log('📡 Enviando código via serial...');
      
      const writer = port.writable?.getWriter();
      if (!writer) {
        throw new Error('Não foi possível obter o writer da porta');
      }

      const encoder = new TextEncoder();
      const lines = code.split('\n');
      console.warn('⚠️ uploadCode() apenas envia via serial - use compileAndUpload() para upload real via STK500');
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim()) {
          await writer.write(encoder.encode(lines[i] + '\r\n'));
          await new Promise(resolve => setTimeout(resolve, 10));
        }
        
        const progress = 20 + (i / lines.length) * 70;
        setUploadProgress(Math.round(progress));
      }
      
      writer.releaseLock();
      setUploadProgress(100);
      return true;
    } catch (error: any) {
      const errorMsg = `Erro no envio: ${error.message}`;
      console.error(errorMsg);
      setError(errorMsg);
      return false;
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 3000);
    }
  }, [port, isConnected, error]);

  const compileAndUpload = useCallback(async (code: string): Promise<boolean> => {
    if (!port || !isConnected) {
      const errorMsg = 'Arduino não está conectado. Conecte o Arduino primeiro.';
      console.error(errorMsg);
      setError(errorMsg);
      return false;
    }

    setIsCompiling(true);
    setIsUploading(true);
    setCompilationProgress(0);
    setUploadProgress(0);
    setError(null);

    try {
      console.log('🚀 Iniciando compilação e upload via STK500...');

      // Etapa 1: Inicializar compilador (20%)
      setCompilationProgress(20);
      console.log('🔧 Inicializando compilador...');
      
      const compilerReady = await arduinoCompiler.initialize();
      if (!compilerReady) {
        throw new Error('Falha ao inicializar o compilador');
      }

      // Etapa 2: Detectar placa (40%)
      setCompilationProgress(40);
      console.log('🔍 Detectando placa Arduino...');
      
      const board = await arduinoCompiler.detectBoard(port);
      console.log(`📋 Placa detectada: ${board}`);

      // Etapa 3: Compilar código (70%)
      setCompilationProgress(70);
      console.log('🔨 Compilando código...');
      
      const compilationResult = await arduinoCompiler.compile(code, {
        board,
        port: 'auto'
      });

      if (!compilationResult.success) {
        throw new Error(compilationResult.error || 'Erro na compilação');
      }

      // Etapa 4: Compilação concluída (100%)
      setCompilationProgress(100);
      console.log('✅ Compilação concluída!');

      if (compilationResult.warnings && compilationResult.warnings.length > 0) {
        console.warn('⚠️ Avisos de compilação:', compilationResult.warnings);
      }

      // Etapa 5: Upload real via STK500 (0-100%)
      console.log('📤 Iniciando upload via protocoloSTK500v1...');
      setUploadProgress(10);

      if (!compilationResult.hex) {
        throw new Error('Código compilado não disponível');
      }

      // ✅ NOVO: Upload REAL usando protocolo STK500
      // (Não simulamos mais - isso vai de verdade para o Arduino!)
      const uploadSuccess = await arduinoCompiler.upload(compilationResult.hex, port);
      
      if (!uploadSuccess) {
        throw new Error('Falha no upload STK500');
      }

      setUploadProgress(100);
      console.log('🎉 Upload concluído com sucesso!');
      console.log('✨ Seu código está rodando no Arduino agora!');

      return true;
    } catch (error: any) {
      const errorMsg = `Erro na compilação/upload: ${error.message}`;
      console.error(errorMsg);
      setError(errorMsg);
      return false;
    } finally {
      setIsCompiling(false);
      setIsUploading(false);
      setTimeout(() => {
        setCompilationProgress(0);
        setUploadProgress(0);
      }, 3000);
    }
  }, [port, isConnected]);

  const readData = useCallback(async (): Promise<string> => {
    if (!port || !isConnected) {
      return '';
    }

    try {
      const reader = port.readable?.getReader();
      if (!reader) {
        return '';
      }

      const { value } = await reader.read();
      reader.releaseLock();
      
      // Converter bytes para string
      const decoder = new TextDecoder();
      return decoder.decode(value);
    } catch (error: any) {
      console.error('Erro ao ler dados:', error);
      return '';
    }
  }, [port, isConnected]);

  return {
    isConnected,
    isConnecting,
    isUploading,
    isCompiling,
    uploadProgress,
    compilationProgress,
    isSupported,
    port,
    error,
    connect,
    disconnect,
    sendCode,
    uploadCode,
    compileAndUpload,
    readData
  };
};
