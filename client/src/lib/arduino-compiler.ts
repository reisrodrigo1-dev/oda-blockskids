/**
 * Arduino Compiler com Protocolo STK500v1 Implementado
 * Upload real para Arduino via Web Serial API
 */

interface CompilerOptions {
  board: string;
  port: string;
  libraries?: string[];
}

interface CompilationResult {
  success: boolean;
  hex?: string; // Código compilado em hex
  error?: string;
  warnings?: string[];
}

// Constantes do protocolo STK500v1
const STK_OK = 0x10;
const STK_INSYNC = 0x14;
const STK_PARAMETER = 0x40;
const STK_SET_PARAMETER = 0x40;
const STK_GET_PARAMETER = 0x41;
const STK_GET_SYNC = 0x30;
const STK_SET_DEVICE = 0x42;
const STK_ENTER_PROGMODE = 0x50;
const STK_LEAVE_PROGMODE = 0x51;
const STK_LOAD_ADDRESS = 0x55;
const STK_PROG_PAGE = 0x64;
const CRC_EOP = 0x20;

export class ArduinoCompiler {
  private wasmModule: any = null;
  private isInitialized = false;

  async initialize(): Promise<boolean> {
    try {
      console.log('🔧 Inicializando Arduino Compiler...');
      
      // Em uma implementação real, carregaríamos o WASM do Arduino CLI
      // Por enquanto, simularemos a compilação
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.isInitialized = true;
      console.log('✅ Arduino Compiler inicializado!');
      return true;
    } catch (error) {
      console.error('❌ Erro ao inicializar compiler:', error);
      return false;
    }
  }

  async compile(code: string, options: CompilerOptions): Promise<CompilationResult> {
    if (!this.isInitialized) {
      throw new Error('Compiler não inicializado. Chame initialize() primeiro.');
    }

    try {
      console.log('🔨 Compilando código Arduino...');
      console.log('📋 Opções:', options);

      // Simular processo de compilação
      await this.simulateCompilation(code, options);

      // Em uma implementação real, retornaríamos o hex compilado
      const mockHex = this.generateMockHex(code);

      return {
        success: true,
        hex: mockHex,
        warnings: ['Compilação simulada - implementação experimental']
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async upload(hex: string, port: SerialPort): Promise<boolean> {
    try {
      console.log('🚀 Iniciando upload via protocolo STK500v1...');

      // Fazer reset via DTR antes de tentar upload
      await this.resetArduino(port);
      
      // Esperar bootloader estar pronto
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Implementar protocolo STK500v1 para upload
      const success = await this.stk500Upload(hex, port);
      
      if (success) {
        console.log('✅ Upload concluído com sucesso!');
      } else {
        console.log('❌ Falha no upload');
      }

      return success;
    } catch (error) {
      console.error('❌ Erro durante upload:', error);
      return false;
    }
  }

  private async simulateCompilation(code: string, options: CompilerOptions): Promise<void> {
    // Simular etapas de compilação
    const steps = [
      'Verificando sintaxe...',
      'Compilando código C++...',
      'Linkando bibliotecas...',
      'Gerando arquivo hex...',
      'Otimizando código...'
    ];

    for (let i = 0; i < steps.length; i++) {
      console.log(`📝 ${steps[i]}`);
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
    }

    // Verificar sintaxe básica
    if (!code.includes('void setup()')) {
      throw new Error('Código deve conter função setup()');
    }
    if (!code.includes('void loop()')) {
      throw new Error('Código deve conter função loop()');
    }
  }

  private generateMockHex(code: string): string {
    // Gerar um hex simulado baseado no código
    const lines = code.split('\n').length;
    const mockHex = Array.from({ length: lines * 2 }, (_, i) => {
      const addr = (i * 16).toString(16).padStart(4, '0').toUpperCase();
      const data = Array.from({ length: 16 }, () => 
        Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()
      ).join('');
      const checksum = ((256 - (16 + parseInt(addr.substr(0, 2), 16) + parseInt(addr.substr(2, 2), 16) + 
        data.match(/.{2}/g)!.reduce((sum, byte) => sum + parseInt(byte, 16), 0)) % 256) % 256)
        .toString(16).padStart(2, '0').toUpperCase();
      return `:10${addr}00${data}${checksum}`;
    });
    
    mockHex.push(':00000001FF'); // End of file record
    return mockHex.join('\n');
  }

  // ===== PROTOCOLO STK500v1 COMPLETO =====

  /**
   * Reseta o Arduino via sinal DTR da porta serial
   * Isso "acorda" o bootloader
   */
  private async resetArduino(port: SerialPort): Promise<void> {
    try {
      // Cast para acessar methods não padronizados
      const portAny = port as any;
      
      console.log('🔄 Resetando Arduino via DTR...');
      
      // Descer DTR (sinal de reset)
      if (portAny.setSignals) {
        await portAny.setSignals({ dataTerminalReady: false });
        await new Promise(resolve => setTimeout(resolve, 250)); // Capacitor precisa descarregar
        
        // Subir DTR de novo
        await portAny.setSignals({ dataTerminalReady: true });
        console.log('✅ Arduino resetado com sucesso!');
      } else {
        console.warn('⚠️ setSignals não disponível - reset DTR não funciona');
      }
    } catch (error) {
      console.warn('⚠️ Erro ao resetar via DTR:', error);
      // Continuar mesmo com erro
    }
  }

  /**
   * Implementação completa do protocolo STK500v1
   */
  private async stk500Upload(hex: string, port: SerialPort): Promise<boolean> {
    const writer = port.writable?.getWriter();
    if (!writer) {
      throw new Error('Não foi possível obter writer da porta');
    }

    try {
      console.log('📡 Iniciando sincronização com bootloader...');
      
      // Passo 1: Sincronize com bootloader
      await this.stk500Sync(port, writer);
      console.log('✅ Bootloader sincronizado!');

      // Passo 2: Enter Programming Mode
      console.log('🔐 Entrando em modo de programação...');
      await this.stk500EnterProgMode(port, writer);
      console.log('✅ Modo de programação ativo!');

      // Passo 3: Parse e converter .HEX para array de bytes
      console.log('📦 Parseando arquivo .HEX...');
      const hexData = this.parseHex(hex);
      console.log(`✅ ${hexData.length} bytes parsed para upload`);

      // Passo 4: Upload das páginas
      console.log('📤 Enviando código compilado...');
      await this.uploadPages(port, writer, hexData);
      console.log('✅ Todas as páginas enviadas!');

      // Passo 5: Leave Programming Mode
      console.log('🔓 Saindo do modo de programação...');
      await this.stk500LeaveProgMode(port, writer);
      console.log('✅ Bootloader finalizado!');

      writer.releaseLock();
      return true;
    } catch (error) {
      console.error('❌ Erro no protocolo STK500:', error);
      try {
        writer.releaseLock();
      } catch (e) {
        // Ignorar se já foi liberado
      }
      return false;
    }
  }

  /**
   * Sincroniza com o bootloader (aperto de mão)
   */
  private async stk500Sync(port: SerialPort, writer: WritableStreamDefaultWriter): Promise<void> {
    // Enviar comando GET_SYNC: [0x30, 0x20]
    await this.sendCommand(writer, [STK_GET_SYNC, CRC_EOP]);
    
    // Esperar resposta: [0x14, 0x10] (INSYNC, OK)
    const response = await this.readResponse(port, 2, 1000);
    
    if (!response || response[0] !== STK_INSYNC || response[1] !== STK_OK) {
      throw new Error('Falha na sincronização: Bootloader não respondeu correctamente');
    }
  }

  /**
   * Entra em modo de programação
   */
  private async stk500EnterProgMode(port: SerialPort, writer: WritableStreamDefaultWriter): Promise<void> {
    // Enviar comando ENTER_PROGMODE: [0x50, 0x20]
    await this.sendCommand(writer, [STK_ENTER_PROGMODE, CRC_EOP]);
    
    // Esperar resposta: [0x14, 0x10]
    const response = await this.readResponse(port, 2, 1000);
    
    if (!response || response[0] !== STK_INSYNC || response[1] !== STK_OK) {
      throw new Error('Falha ao entrar em modo de programação');
    }
  }

  /**
   * Sai do modo de programação
   */
  private async stk500LeaveProgMode(port: SerialPort, writer: WritableStreamDefaultWriter): Promise<void> {
    // Enviar comando LEAVE_PROGMODE: [0x51, 0x20]
    await this.sendCommand(writer, [STK_LEAVE_PROGMODE, CRC_EOP]);
    
    // Esperar resposta: [0x14, 0x10]
    const response = await this.readResponse(port, 2, 1000);
    
    if (!response || response[0] !== STK_INSYNC || response[1] !== STK_OK) {
      throw new Error('Falha ao sair do modo de programação');
    }
  }

  /**
   * Parse do arquivo .HEX e conversão para array de bytes
   * Formato .HEX: :10 0000 00 A9878787... FF
   *               ^^  ^^^^ ^^ ^^^^^^^^^^^^^^ ^^
   *               len addr type    data    chk
   */
  private parseHex(hexString: string): Uint8Array {
    const lines = hexString.split('\n').filter(line => line.startsWith(':'));
    const bytes: number[] = [];
    let currentAddr = 0;
    let extendedAddr = 0;

    for (const line of lines) {
      const byteCount = parseInt(line.substr(1, 2), 16);
      const address = parseInt(line.substr(3, 4), 16);
      const recordType = parseInt(line.substr(7, 2), 16);
      
      // Tipo 0x00 = Data
      if (recordType === 0x00) {
        const fullAddr = extendedAddr + address;
        
        // Garantir espaço para todos os bytes
        while (bytes.length < fullAddr + byteCount) {
          bytes.push(0xff);
        }
        
        // Ler bytes de dados
        for (let i = 0; i < byteCount; i++) {
          const byteStr = line.substr(9 + i * 2, 2);
          bytes[fullAddr + i] = parseInt(byteStr, 16);
        }
      }
      // Tipo 0x01 = End of file
      else if (recordType === 0x01) {
        break;
      }
      // Tipo 0x04 = Extended linear address
      else if (recordType === 0x04) {
        extendedAddr = parseInt(line.substr(9, 4), 16) * 65536;
      }
    }

    return new Uint8Array(bytes);
  }

  /**
   * Upload das páginas de 128 bytes
   */
  private async uploadPages(port: SerialPort, writer: WritableStreamDefaultWriter, data: Uint8Array): Promise<void> {
    const pageSize = 128; // Arduino Uno usa 128 bytes por página
    
    for (let addr = 0; addr < data.length; addr += pageSize) {
      const page = data.slice(addr, Math.min(addr + pageSize, data.length));
      const padded = new Uint8Array(pageSize);
      padded.fill(0xff); // Preencher com 0xff (padrão)
      padded.set(page);
      
      // Enviar endereço (em palavras de 16 bits)
      const addrWords = addr >> 1; // Converter bytes para words
      await this.stk500LoadAddress(port, writer, addrWords);
      
      // Enviar página
      await this.stk500ProgPage(port, writer, padded);
      
      // Log de progresso
      if (addr % (pageSize * 10) === 0) {
        const progress = Math.round((addr / data.length) * 100);
        console.log(`📊 Progresso: ${progress}%`);
      }
    }
  }

  /**
   * Comando STK_LOAD_ADDRESS: define endereço de escrita
   */
  private async stk500LoadAddress(port: SerialPort, writer: WritableStreamDefaultWriter, addr: number): Promise<void> {
    const addrLow = addr & 0xff;
    const addrHigh = (addr >> 8) & 0xff;
    
    await this.sendCommand(writer, [STK_LOAD_ADDRESS, addrLow, addrHigh, CRC_EOP]);
    const response = await this.readResponse(port, 2, 500);
    
    if (!response || response[0] !== STK_INSYNC || response[1] !== STK_OK) {
      throw new Error(`Falha ao carregar endereço 0x${addr.toString(16)}`);
    }
  }

  /**
   * Comando STK_PROG_PAGE: escreve uma página na memória
   */
  private async stk500ProgPage(port: SerialPort, writer: WritableStreamDefaultWriter, page: Uint8Array): Promise<void> {
    const pageSize = page.length;
    const pageSizeLow = pageSize & 0xff;
    const pageSizeHigh = (pageSize >> 8) & 0xff;
    
    // Montar comando: [0x64, pageHigh, pageLow, 0x46] + data + [0x20]
    const command: number[] = [STK_PROG_PAGE, pageSizeHigh, pageSizeLow, 0x46];
    
    // Adicionar dados da página
    for (let i = 0; i < page.length; i++) {
      command.push(page[i]);
    }
    
    // Terminar com CRC_EOP
    command.push(CRC_EOP);
    
    await this.sendCommand(writer, command);
    const response = await this.readResponse(port, 2, 1000);
    
    if (!response || response[0] !== STK_INSYNC || response[1] !== STK_OK) {
      throw new Error('Falha ao gravar página');
    }
  }

  /**
   * Envia um comando para o bootloader
   */
  private async sendCommand(writer: WritableStreamDefaultWriter, command: number[]): Promise<void> {
    const buffer = new Uint8Array(command);
    await writer.write(buffer);
    // Pequena pausa para o dispositivo processar
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  /**
   * Lê resposta do bootloader com timeout
   */
  private async readResponse(port: SerialPort, expectedBytes: number, timeoutMs: number): Promise<Uint8Array | null> {
    return new Promise((resolve) => {
      let timeoutHandle: any = null;
      
      const doRead = async () => {
        try {
          const reader = port.readable?.getReader();
          if (!reader) {
            resolve(null);
            return;
          }

          // Ler com timeout
          const readPromise = reader.read();
          const timeoutPromise = new Promise<any>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout reading response')), timeoutMs)
          );

          const { value } = await Promise.race([readPromise, timeoutPromise]);
          reader.releaseLock();

          if (value && value.length >= expectedBytes) {
            resolve(value.slice(0, expectedBytes));
          } else {
            resolve(null);
          }
        } catch (error) {
          console.warn('Erro ao ler resposta:', error);
          resolve(null);
        } finally {
          if (timeoutHandle) clearTimeout(timeoutHandle);
        }
      };

      doRead();
    });
  }

  // Detectar placa automaticamente
  async detectBoard(port: SerialPort): Promise<string> {
    try {
      // Implementar detecção automática da placa
      // Por enquanto, retornar Arduino Uno como padrão
      return 'arduino:avr:uno';
    } catch (error) {
      console.warn('⚠️ Não foi possível detectar a placa. Usando Arduino Uno como padrão.');
      return 'arduino:avr:uno';
    }
  }
}

// Instância singleton
export const arduinoCompiler = new ArduinoCompiler();
