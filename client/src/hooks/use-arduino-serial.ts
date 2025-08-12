import { useState, useCallback } from 'react';

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
  isSupported: boolean;
  port: SerialPort | null;
  connect: (options?: SerialOptions) => Promise<boolean>;
  disconnect: () => Promise<void>;
  sendCode: (code: string) => Promise<boolean>;
  readData: () => Promise<string>;
}

export const useArduinoSerial = (): ArduinoSerial => {
  const [isConnected, setIsConnected] = useState(false);
  const [port, setPort] = useState<SerialPort | null>(null);

  // Verificar se o navegador suporta Web Serial API
  const isSupported = 'serial' in navigator;

  const connect = useCallback(async (options: SerialOptions = { baudRate: 9600 }): Promise<boolean> => {
    if (!isSupported) {
      console.error('Web Serial API não suportada neste navegador');
      return false;
    }

    try {
      // Solicitar acesso à porta serial
      const selectedPort = await navigator.serial.requestPort();
      
      // Abrir a porta com as opções especificadas
      await selectedPort.open({ baudRate: options.baudRate || 9600 });
      
      setPort(selectedPort);
      setIsConnected(true);
      
      console.log('Arduino conectado com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao conectar com Arduino:', error);
      return false;
    }
  }, [isSupported]);

  const disconnect = useCallback(async (): Promise<void> => {
    if (port && isConnected) {
      try {
        await port.close();
        setPort(null);
        setIsConnected(false);
        console.log('Arduino desconectado');
      } catch (error) {
        console.error('Erro ao desconectar Arduino:', error);
      }
    }
  }, [port, isConnected]);

  const sendCode = useCallback(async (code: string): Promise<boolean> => {
    if (!port || !isConnected) {
      console.error('Arduino não está conectado');
      return false;
    }

    try {
      const writer = port.writable?.getWriter();
      if (!writer) {
        console.error('Não foi possível obter o writer da porta');
        return false;
      }

      // Converter o código para bytes
      const encoder = new TextEncoder();
      const data = encoder.encode(code + '\n');
      
      // Enviar o código
      await writer.write(data);
      writer.releaseLock();
      
      console.log('Código enviado para o Arduino');
      return true;
    } catch (error) {
      console.error('Erro ao enviar código:', error);
      return false;
    }
  }, [port, isConnected]);

  const readData = useCallback(async (): Promise<string> => {
    if (!port || !isConnected) {
      console.error('Arduino não está conectado');
      return '';
    }

    try {
      const reader = port.readable?.getReader();
      if (!reader) {
        console.error('Não foi possível obter o reader da porta');
        return '';
      }

      const { value } = await reader.read();
      reader.releaseLock();
      
      // Converter bytes para string
      const decoder = new TextDecoder();
      return decoder.decode(value);
    } catch (error) {
      console.error('Erro ao ler dados:', error);
      return '';
    }
  }, [port, isConnected]);

  return {
    isConnected,
    isSupported,
    port,
    connect,
    disconnect,
    sendCode,
    readData
  };
};
