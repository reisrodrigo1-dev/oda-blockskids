// app.js - App Nativo para comunicação com a extensão
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const tmp = require('tmp');

class ArduinoUploader {
  constructor() {
    this.setupNativeMessaging();
  }
  
  setupNativeMessaging() {
    // Configurar entrada/saída para Native Messaging
    process.stdin.setEncoding('utf8');
    
    let messageBuffer = '';
    
    process.stdin.on('data', (chunk) => {
      messageBuffer += chunk;
      
      // Protocolo Native Messaging: 4 bytes (length) + JSON
      while (messageBuffer.length >= 4) {
        const messageLength = messageBuffer.charCodeAt(0) + 
                            (messageBuffer.charCodeAt(1) << 8) + 
                            (messageBuffer.charCodeAt(2) << 16) + 
                            (messageBuffer.charCodeAt(3) << 24);
                            
        if (messageBuffer.length >= 4 + messageLength) {
          const messageText = messageBuffer.substring(4, 4 + messageLength);
          messageBuffer = messageBuffer.substring(4 + messageLength);
          
          try {
            const message = JSON.parse(messageText);
            this.handleMessage(message);
          } catch (error) {
            this.sendMessage({
              status: 'error',
              error: 'Erro ao parsear mensagem: ' + error.message
            });
          }
        } else {
          break;
        }
      }
    });
    
    process.stdin.on('end', () => {
      process.exit(0);
    });
  }
  
  sendMessage(message) {
    const messageText = JSON.stringify(message);
    const messageLength = Buffer.byteLength(messageText, 'utf8');
    
    // Enviar length (4 bytes) + message
    const lengthBuffer = Buffer.allocUnsafe(4);
    lengthBuffer.writeUInt32LE(messageLength, 0);
    
    process.stdout.write(lengthBuffer);
    process.stdout.write(messageText, 'utf8');
  }
  
  async handleMessage(message) {
    console.log('📨 Mensagem recebida:', JSON.stringify(message, null, 2));
    
    try {
      if (message.action === 'upload') {
        console.log('🚀 Iniciando processo de upload...');
        await this.uploadCode(message.code, message.board, message.port);
      } else {
        console.log('❌ Ação desconhecida:', message.action);
        this.sendMessage({
          status: 'error',
          error: 'Ação desconhecida: ' + message.action
        });
      }
    } catch (error) {
      console.error('❌ Erro no handleMessage:', error);
      this.sendMessage({
        status: 'error',
        error: error.message
      });
    }
  }
  
  async uploadCode(code, board = 'arduino:avr:uno', port = 'auto') {
    console.log('📋 Parâmetros de upload:');
    console.log('- Board:', board);
    console.log('- Port:', port);
    console.log('- Code length:', code.length, 'chars');
    console.log('- Code preview:', code.substring(0, 100) + '...');
    
    try {
      // 1. Criar arquivo temporário .ino
      console.log('📁 Criando arquivo temporário...');
      const tmpDir = tmp.dirSync({ unsafeCleanup: true });
      const sketchPath = path.join(tmpDir.name, 'sketch');
      const sketchFile = path.join(sketchPath, 'sketch.ino');
      
      fs.mkdirSync(sketchPath, { recursive: true });
      fs.writeFileSync(sketchFile, code);
      console.log('✅ Arquivo criado em:', sketchFile);
      
      this.sendMessage({
        status: 'progress',
        message: 'Arquivo criado, iniciando compilação...'
      });
      
      // 2. Detectar porta se necessário
      let targetPort = port;
      if (port === 'auto') {
        console.log('🔍 Detectando porta automaticamente...');
        targetPort = await this.detectArduinoPort();
        console.log('📍 Porta detectada:', targetPort);
      }
      
      this.sendMessage({
        status: 'progress',
        message: `Compilando para ${board} na porta ${targetPort}...`
      });
      
      // 3. Compilar e fazer upload usando Arduino CLI
      console.log('🔨 Iniciando compilação e upload...');
      await this.runArduinoCLI([
        'compile',
        '--upload',
        '-b', board,
        '-p', targetPort,
        sketchPath
      ]);
      
      console.log('✅ Upload concluído com sucesso!');
      this.sendMessage({
        status: 'success',
        message: 'Upload concluído com sucesso!'
      });
      
      // Limpar arquivo temporário
      tmpDir.removeCallback();
      
    } catch (error) {
      console.error('❌ Erro no upload:', error);
      this.sendMessage({
        status: 'error',
        error: 'Erro no upload: ' + error.message
      });
    }
  }
  
  async detectArduinoPort() {
    console.log('🔍 Iniciando detecção de porta...');
    try {
      const result = await this.runArduinoCLI(['board', 'list', '--format', 'json']);
      console.log('📋 Resultado do board list:', result);
      const boards = JSON.parse(result);
      
      for (const board of boards) {
        console.log('🔍 Verificando board:', board);
        if (board.matching_boards && board.matching_boards.length > 0) {
          console.log('✅ Arduino encontrado na porta:', board.address);
          return board.address;
        }
      }
      
      // Se não encontrar boards específicos, tentar COM3 (comum para Arduino)
      console.log('⚠️ Nenhum Arduino detectado automaticamente, tentando COM3...');
      return 'COM3';
      
    } catch (error) {
      console.error('❌ Erro ao detectar porta:', error);
      throw new Error('Erro ao detectar porta: ' + error.message);
    }
  }
  
  runArduinoCLI(args) {
    console.log('⚡ Executando Arduino CLI:', 'C:\\arduino-cli\\arduino-cli.exe', args.join(' '));
    
    return new Promise((resolve, reject) => {
      const process = spawn('C:\\arduino-cli\\arduino-cli.exe', args, {
        stdio: ['ignore', 'pipe', 'pipe']
      });
      
      let stdout = '';
      let stderr = '';
      
      process.stdout.on('data', (data) => {
        const output = data.toString();
        console.log('📤 STDOUT:', output);
        stdout += output;
      });
      
      process.stderr.on('data', (data) => {
        const output = data.toString();
        console.log('📤 STDERR:', output);
        stderr += output;
      });
      
      process.on('close', (code) => {
        console.log('🏁 Arduino CLI finalizado com código:', code);
        console.log('📄 STDOUT completo:', stdout);
        console.log('📄 STDERR completo:', stderr);
        
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(new Error(stderr || 'Erro no Arduino CLI'));
        }
      });
      
      process.on('error', (error) => {
        console.error('💥 Erro ao executar Arduino CLI:', error);
        if (error.code === 'ENOENT') {
          reject(new Error('Arduino CLI não encontrado. Instale em: https://arduino.cc/cli'));
        } else {
          reject(error);
        }
      });
    });
  }
}

// Iniciar o app
new ArduinoUploader();
