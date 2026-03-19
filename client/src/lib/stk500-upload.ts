import STK500, { type Board } from 'stk500-esm';

/**
 * Configurações de placas supportadas
 */
export const BOARD_CONFIGS: Record<string, Board> = {
  uno: {
    name: 'Arduino Uno',
    baudRate: 115200,
    signature: new Uint8Array([0x1e, 0x95, 0x0f]), // ATmega328P
    pageSize: 128,
    timeout: 400,
  },
  nano: {
    name: 'Arduino Nano',
    baudRate: 57600,
    signature: new Uint8Array([0x1e, 0x95, 0x0f]), // ATmega328P
    pageSize: 128,
    timeout: 400,
  },
  mega: {
    name: 'Arduino Mega',
    baudRate: 115200,
    signature: new Uint8Array([0x1e, 0x98, 0x01]), // ATmega2560
    pageSize: 256,
    timeout: 400,
  },
};

export interface UploadOptions {
  board?: keyof typeof BOARD_CONFIGS;
  onProgress?: (progress: number, message: string) => void;
  onLog?: (message: string) => void;
}

/**
 * Fazer upload de código Intel HEX para Arduino usando STK500 protocol
 */
export async function uploadToArduino(
  port: SerialPort,
  hexData: string | Uint8Array,
  options: UploadOptions = {}
): Promise<void> {
  const {
    board = 'uno',
    onProgress = () => {},
    onLog = console.log,
  } = options;

  const boardConfig = BOARD_CONFIGS[board];
  if (!boardConfig) {
    throw new Error(`Board type '${board}' not supported`);
  }

  onLog(`🎯 Inicializando upload para ${boardConfig.name}...`);
  onProgress(0, 'Verificando porta serial...');

  try {
    // Debug: verificar se port é válido
    onLog(`📊 Port type: ${typeof port}, readable: ${(port as any).readable}, writable: ${(port as any).writable}`);

    // Abrir porta serial
    if (!(port as any).readable) {
      onLog(`📂 Abrindo porta em ${boardConfig.baudRate} baud...`);
      try {
        await (port as any).open({ baudRate: boardConfig.baudRate });
        onLog(`✅ Porta serial aberta`);
      } catch (openError) {
        onLog(`❌ Erro ao abrir porta: ${(openError as Error).message}`);
        throw new Error(`Não foi possível abrir porta serial: ${(openError as Error).message}`);
      }
    } else {
      onLog(`📂 Porta já estava aberta`);
    }

    onProgress(20, 'Inicializando bootloader...');
    onLog(`📡 Criando instância STK500...`);

    // Criar instância do STK500
    let stk: any;
    try {
      stk = new STK500(port as any, boardConfig);
      onLog(`✅ STK500 instanciado`);
    } catch (constructorError) {
      onLog(`❌ Erro ao criar STK500: ${(constructorError as Error).message}`);
      throw new Error(`Não foi possível inicializar proto colo STK500: ${(constructorError as Error).message}`);
    }

    // Sincronizar com bootloader
    onProgress(40, 'Sincronizando com bootloader...');
    onLog('🔄 Tentando sincronizar com bootloader (até 5 tentativas)...');
    
    try {
      await stk.sync(5);
      onLog('✅ Bootloader sincronizado!');
    } catch (syncError) {
      onLog(`⚠️ Sincronização falhou: ${(syncError as Error).message}`);
      throw new Error(`Não foi possível sincronizar bootloader: ${(syncError as Error).message}`);
    }

    // Verificar assinatura
    onProgress(50, 'Verificando assinatura da placa...');
    onLog('🔍 Lendo assinatura...');
    
    try {
      const signature = await stk.readSignature();
      const signatureBytes = Array.from(signature as Uint8Array);
      onLog(`✅ Assinatura: ${signatureBytes.map((byte) => '0x' + byte.toString(16).toUpperCase()).join(' ')}`);
    } catch (sigError) {
      onLog(`⚠️ Erro ao ler assinatura (continuando): ${(sigError as Error).message}`);
    }

    // Fazer upload do código
    onProgress(60, 'Preparando upload...');
    onLog(`📦 Tamanho do programa: ${typeof hexData === 'string' ? hexData.length : hexData.length} bytes`);

    onProgress(70, 'Enviando código para Arduino...');
    onLog('🚀 Enviando páginas de programa...');

    try {
      await stk.loadProgram(hexData, (progress: any) => {
        const progressPercent = 70 + Math.floor((progress / 100) * 25);
        onProgress(progressPercent, `Enviando... ${progress}%`);
        onLog(`📤 Progresso: ${progress}%`);
      });
      
      onLog('✅ Todas as páginas enviadas!');
    } catch (uploadError) {
      throw new Error(`Erro ao enviar código: ${(uploadError as Error).message}`);
    }

    // Sair do modo programação
    onProgress(95, 'Finalizando...');
    onLog('🏁 Saindo do modo programação...');
    
    try {
      await stk.leaveProgMode();
      onLog('✅ Saído do modo programação');
    } catch (leaveError) {
      onLog(`⚠️ Erro ao sair (não crítico): ${(leaveError as Error).message}`);
    }

    onProgress(100, 'Pronto!');
    onLog('✅ Upload concluído com sucesso!');

  } catch (error) {
    onLog(`❌ Erro no upload: ${(error as Error).message}`);
    throw error;
  } finally {
    // Fechar porta
    try {
      if ((port as any) && (port as any).readable) {
        await (port as any).close();
        onLog('🔌 Porta serial fechada');
      }
    } catch (closeError) {
      onLog(`⚠️ Erro ao fechar porta: ${(closeError as Error).message}`);
    }
  }
}

/**
 * Parse Intel HEX string (fallback caso stk500-esm não faça isso)
 */
export function parseIntelHex(hexString: string): Uint8Array {
  const lines = hexString.trim().split('\n');
  const memory = new Map<number, number>();
  let baseAddress = 0;

  for (const line of lines) {
    if (!line.startsWith(':')) continue;

    const data = line.substring(1);
    const byteCount = parseInt(data.substring(0, 2), 16);
    const address = parseInt(data.substring(2, 6), 16);
    const recordType = parseInt(data.substring(6, 8), 16);

    if (recordType === 0) {
      const hexData = data.substring(8, 8 + byteCount * 2);
      for (let i = 0; i < hexData.length; i += 2) {
        const byte = parseInt(hexData.substring(i, i + 2), 16);
        memory.set(baseAddress + address + i / 2, byte);
      }
    } else if (recordType === 1) {
      break;
    } else if (recordType === 4) {
      const addressHigh = parseInt(data.substring(8, 12), 16);
      baseAddress = addressHigh * 0x10000;
    }
  }

  const addresses = Array.from(memory.keys()).sort((a, b) => a - b);
  const minAddress = addresses[0] || 0;
  const maxAddress = addresses[addresses.length - 1] || 0;

  const result = new Uint8Array(maxAddress - minAddress + 1);
  Array.from(memory.entries()).forEach(([address, byte]) => {
    result[address - minAddress] = byte;
  });

  return result;
}
