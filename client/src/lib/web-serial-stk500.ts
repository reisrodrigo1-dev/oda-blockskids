/**
 * STK500 Upload para Web Serial API
 * Implementação customizada simples que funciona com Browser Serial API
 * (em vez de tentar usar stk500-esm que é para Node.js)
 */

export interface Board {
  name: string;
  baudRate: number;
  signature: Uint8Array;
  pageSize: number;
  timeout: number;
  maxFlashAddress: number; // Endereço máximo de programa flash
}

export interface UploadOptions {
  board?: string;
  onProgress?: (progress: number, message: string) => void;
  onLog?: (message: string) => void;
}

type SerialPortWithSignals = SerialPort & {
  setSignals?: (signals: { dataTerminalReady?: boolean; requestToSend?: boolean }) => Promise<void>;
};

// Configurações de placas
export const BOARD_CONFIGS: Record<string, Board> = {
  uno: {
    name: 'Arduino Uno',
    baudRate: 115200,
    signature: new Uint8Array([0x1e, 0x95, 0x0f]),
    pageSize: 128,
    timeout: 400,
    maxFlashAddress: 0x7FFF, // 32KB
  },
  nano: {
    name: 'Arduino Nano',
    baudRate: 57600,
    signature: new Uint8Array([0x1e, 0x95, 0x0f]),
    pageSize: 128,
    timeout: 400,
    maxFlashAddress: 0x7FFF, // 32KB
  },
};

/**
 * Upload de programa Intel HEX para Arduino via STK500 (Optiboot) e Web Serial API
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
  const serialPort = port as SerialPortWithSignals;
  const boardConfig = BOARD_CONFIGS[board] || BOARD_CONFIGS['uno'];
  onLog(`🎯 Iniciando upload para ${boardConfig.name}...`);
  onProgress(0, 'Preparando porta serial...');

  try {
    // Abrir porta
    onLog(`📂 Abrindo porta em ${boardConfig.baudRate} baud...`);
    await port.open({ baudRate: boardConfig.baudRate });
    onLog('✅ Porta aberta');

    onProgress(10, 'Resetando Arduino...');
    onLog('🔄 Enviando sinal de reset...');
    
    // Reset via DTR (Data Terminal Ready)
    if (!serialPort.setSignals) {
      throw new Error('Seu navegador não suporta controle de sinais seriais (setSignals). Use Chrome ou Edge atualizados.');
    }

    await serialPort.setSignals({ dataTerminalReady: false, requestToSend: false });
    await sleep(250);
    await serialPort.setSignals({ dataTerminalReady: true, requestToSend: true });
    await sleep(1500); // Bootloader acorda

    onProgress(20, 'Sincronizando bootloader...');
    onLog('🔍 Enviando STK_GET_SYNC...');

    // Sincronizar com bootloader
    let synced = false;
    for (let i = 0; i < 5; i++) {
      try {
        const response = await sendSTKCommand(port, new Uint8Array([0x30]), 1000);
        if (response && response[0] === 0x14) {
          synced = true;
          onLog('✅ Bootloader sincronizado!');
          break;
        }
      } catch (e) {
        onLog(`⚠️ Tentativa ${i + 1}/5 falhou`);
        await sleep(500);
      }
    }

    if (!synced) {
      throw new Error('Não foi possível sincronizar com bootloader. Verifique conexão USB.');
    }

    onProgress(30, 'Verificando assinatura...');
    
    // Verificar assinatura (opcional)
    try {
      const sig = await sendSTKCommand(port, new Uint8Array([0x75]), 500);
      if (sig) {
        onLog(`✅ Assinatura: ${Array.from(sig).map(b => '0x' + b.toString(16).toUpperCase()).join(' ')}`);
      }
    } catch (e) {
      onLog('⚠️ Assinatura: não disponível');
    }

    // Parse HEX
    onProgress(40, 'Analisando arquivo HEX...');
    let programData = parseIntelHex(
      typeof hexData === 'string' ? hexData : new TextDecoder().decode(hexData),
      boardConfig.maxFlashAddress
    );

    // ✅ CORREÇÃO 2: Padding obrigatório para STK500 (múltiplos de 128 bytes)
    const remainder = programData.length % boardConfig.pageSize;
    if (remainder !== 0) {
      const paddingSize = boardConfig.pageSize - remainder;
      const paddedData = new Uint8Array(programData.length + paddingSize);
      paddedData.set(programData); // Copia o programa original
      paddedData.fill(0xFF, programData.length); // Preenche o resto com 0xFF
      programData = paddedData;
    }
    onLog(`📦 Programa: ${programData.length} bytes (com padding)`);

    // Enviar programa em páginas
    onProgress(50, 'Enviando programa...');
    const pageSize = boardConfig.pageSize;
    let address = 0;

    for (let offset = 0; offset < programData.length; offset += pageSize) {
      const pageData = programData.slice(offset, offset + pageSize);
      const wordAddr = Math.floor(address / 2);

      // STK_LOAD_ADDRESS
      await sendSTKCommand(
        port,
        new Uint8Array([0x55, wordAddr & 0xFF, (wordAddr >> 8) & 0xFF]),
        500
      );

      // STK_PROG_PAGE
      const progCmd = new Uint8Array(4 + pageData.length);
      progCmd[0] = 0x64;
      progCmd[1] = (pageData.length >> 8) & 0xFF;
      progCmd[2] = pageData.length & 0xFF;
      progCmd[3] = 0x46; // 'F' for flash
      progCmd.set(pageData, 4);

      await sendSTKCommand(port, progCmd, 2000); // 2 segundos para programação

      address += pageData.length;
      const progress = 50 + Math.floor((offset / programData.length) * 40);
      onProgress(progress, `Enviando... ${Math.floor((offset / programData.length) * 100)}%`);
    }

    onLog('✅ Programa enviado!');

    // Leave progmode
    onProgress(95, 'Finalizando...');
    onLog('🏁 Saindo do modo programação...');
    await sendSTKCommand(port, new Uint8Array([0x51]), 500);

    onProgress(100, 'Concluído!');
    onLog('✅ Upload concluído com sucesso!');

  } catch (error) {
    onLog(`❌ Erro: ${(error as Error).message}`);
    throw error;
  } finally {
    try {
      // Liberar sinais DTR e RTS antes de fechar (importante!)
      try {
        onLog('🔓 Liberando sinais de reset (DTR/RTS)...');
        if (serialPort.setSignals) {
          await serialPort.setSignals({ dataTerminalReady: false, requestToSend: false });
        }
        await new Promise(resolve => setTimeout(resolve, 100)); // Aguardar um pouco
      } catch (e) {
        // Ignore erros ao liberar sinais
      }
      
      onLog('🔌 Fechando porta...');
      await port.close();
    } catch (e) {
      onLog(`⚠️ Erro ao fechar: ${(e as Error).message}`);
    }
  }
}

/**
 * Enviar comando STK500 e aguardar resposta
 * Lê múltiplos chunks até receber a resposta completa (0x14 + dados + 0x10)
 */
async function sendSTKCommand(
  port: SerialPort,
  command: Uint8Array,
  timeoutMs: number = 1000
): Promise<Uint8Array | null> {
  // Adicionar CRC_EOP
  const fullCommand = new Uint8Array(command.length + 1);
  fullCommand.set(command);
  fullCommand[command.length] = 0x20;

  // Enviar comando
  const writer = port.writable!.getWriter();
  try {
    await writer.write(fullCommand);
  } finally {
    writer.releaseLock();
  }

  // Receber resposta com retry de leitura
  return new Promise((resolve, reject) => {
    let timeoutHandle: NodeJS.Timeout | null = null;
    const responseBuffer: number[] = [];
    let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;

    const cleanup = () => {
      if (timeoutHandle) clearTimeout(timeoutHandle);
      if (reader) {
        try {
          reader.releaseLock();
        } catch (e) {
          // Ignore erro ao soltar lock
        }
      }
    };

    const startReading = async () => {
      try {
        reader = port.readable!.getReader();
        
        // Ler chunks até receber 0x10 (STK_OK)
        while (true) {
          const { value, done } = await reader.read();
          
          if (done) {
            cleanup();
            reject(new Error('Stream fechado antes de receber resposta'));
            return;
          }

          if (value) {
            // Adicionar bytes ao buffer
            for (let i = 0; i < value.length; i++) {
              responseBuffer.push(value[i]);
            }

            // Verificar se temos resposta completa: 0x14 (INSYNC) + dados + 0x10 (OK)
            if (responseBuffer.length >= 2 && 
                responseBuffer[0] === 0x14 && 
                responseBuffer[responseBuffer.length - 1] === 0x10) {
              cleanup();
              // Retornar os dados entre INSYNC e OK (sem incluir os marcadores)
              const data = new Uint8Array(responseBuffer.slice(1, -1));
              resolve(data.length > 0 ? data : new Uint8Array([0x14]));
              return;
            }

            // Timeout de segurança: se tiver muito dado mas sem 0x10, é erro
            if (responseBuffer.length > 1000) {
              cleanup();
              reject(new Error('Resposta muito longa sem STK_OK'));
              return;
            }
          }
        }
      } catch (err) {
        cleanup();
        reject(err);
      }
    };

    // Iniciar leitura com timeout
    timeoutHandle = setTimeout(() => {
      cleanup();
      reject(new Error(`Timeout aguardando resposta (${responseBuffer.length} bytes recebidos)`));
    }, timeoutMs);

    startReading().catch((err) => {
      cleanup();
      reject(err);
    });
  });
}

/**
 * Parse Intel HEX
 * Converte formato texto Intel HEX para array de bytes binários
 * Ignora dados além do espaço de endereçamento da placa
 */
function parseIntelHex(hexString: string, maxFlashAddress: number = 0x7FFF): Uint8Array {
  const lines = hexString.trim().split('\n');
  const memory = new Map<number, number>();
  let baseAddress = 0;

  for (const line of lines) {
    if (!line.startsWith(':')) continue;

    const data = line.substring(1);
    const byteCount = parseInt(data.substring(0, 2), 16);
    const address = parseInt(data.substring(2, 6), 16);
    const recordType = parseInt(data.substring(6, 8), 16);

    // Type 0: Data record
    if (recordType === 0) {
      const hexData = data.substring(8, 8 + byteCount * 2);
      for (let i = 0; i < hexData.length; i += 2) {
        const byte = parseInt(hexData.substring(i, i + 2), 16);
        const absoluteAddress = baseAddress + address + i / 2;
        
        // ✅ IMPORTANTE: Ignorar dados além do limite da placa
        if (absoluteAddress <= maxFlashAddress) {
          memory.set(absoluteAddress, byte);
        }
      }
    } 
    // Type 1: End of File
    else if (recordType === 1) {
      break;
    } 
    // Type 4: Extended Linear Address
    else if (recordType === 4) {
      const addressHigh = parseInt(data.substring(8, 12), 16);
      baseAddress = addressHigh * 0x10000;
    }
  }

  // Encontrar min/max endereço
  const addresses = Array.from(memory.keys());
  if (addresses.length === 0) {
    return new Uint8Array(0);
  }

  addresses.sort((a, b) => a - b);
  const minAddr = addresses[0];
  const maxAddr = addresses[addresses.length - 1];
  
  // Criar array com bytes do programa
  const result = new Uint8Array(maxAddr - minAddr + 1);
  for (let i = 0; i < result.length; i++) {
    // ✅ CORREÇÃO 1: Evita que bytes 0x00 virem 0xFF (0 é falso em JS!)
    const val = memory.get(minAddr + i);
    result[i] = val !== undefined ? val : 0xFF; // 0xFF = flash não programada
  }

  return result;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
