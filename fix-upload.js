import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'client', 'src', 'pages', 'editor-offline.tsx');

let fileContent = fs.readFileSync(filePath, 'utf8');

// Substituir a implementação antiga pela nova
const oldCode = `        // Para Optiboot, enviar dados byte por byte
        for (let i = 0; i < programData.length; i++) {
          const byte = programData[i];
          await sendData(new Uint8Array([0x42, 0x00, 0x00, byte])); // 'B' + address + data
          await new Promise(resolve => setTimeout(resolve, 10));

          if (i % 100 === 0) {
            console.log(\`📤 Enviado \${i}/\${programData.length} bytes\`);
            setUploadProgress(80 + Math.floor((i / programData.length) * 15));
          }
        }

        console.log('📤 Todos os bytes enviados');

        // Comando 'Q' - Leave programming mode
        console.log('� Enviando comando AVR109: Leave programming mode');
        await sendData(new Uint8Array([0x51])); // 'Q'
        await new Promise(resolve => setTimeout(resolve, 100));`;

const newCode = `        // IMPLEMENTAÇÃO CORRIGIDA DO AVR109 PROTOCOL
        // Função auxiliar para calcular checksum STK500
        const calculateChecksum = (data) => {
          let sum = 0;
          for (let i = 0; i < data.length; i++) {
            sum ^= data[i];
          }
          return sum;
        };

        // Função para enviar comando STK500 e esperar resposta
        const sendStkCommand = async (command) => {
          // STK500 frame: MESSAGE_START(0x1B) + SEQUENCE_NUMBER(0x01) + MESSAGE_SIZE(2 bytes) + TOKEN(0x0E) + DATA + CHECKSUM
          const messageSize = command.length + 1; // +1 for TOKEN
          const frame = new Uint8Array(5 + messageSize);
          frame[0] = 0x1B; // MESSAGE_START
          frame[1] = 0x01; // SEQUENCE_NUMBER
          frame[2] = messageSize & 0xFF; // MESSAGE_SIZE low
          frame[3] = (messageSize >> 8) & 0xFF; // MESSAGE_SIZE high
          frame[4] = 0x0E; // TOKEN
          frame.set(command, 5); // DATA
          frame[frame.length - 1] = calculateChecksum(frame.slice(4, -1)); // CHECKSUM

          console.log(\`📡 Enviando comando STK500: \${Array.from(frame).map(b => b.toString(16).padStart(2, '0')).join(' ')}\`);
          await sendData(frame);

          // Aguardar resposta
          await new Promise(resolve => setTimeout(resolve, 50));
          try {
            const response = await receiveData(300); // STK500 response can be up to ~300 bytes
            console.log(\`📡 Resposta STK500: \${Array.from(response.slice(0, 20)).map(b => b.toString(16).padStart(2, '0')).join(' ')}\${response.length > 20 ? '...' : ''}\`);
            return response;
          } catch (e) {
            console.log('⚠️ Não foi possível ler resposta STK500');
            return new Uint8Array(0);
          }
        };

        // Comando AVR109: Enter programming mode
        console.log('📡 Enviando comando AVR109: Enter programming mode');
        const enterProgResponse = await sendStkCommand(new Uint8Array([0x50])); // 'P'
        if (enterProgResponse.length === 0 || enterProgResponse[5] !== 0x10) {
          console.log('⚠️ Resposta inesperada para Enter Programming Mode');
        }

        // Comando AVR109: Set device type (AVR109)
        console.log('📡 Enviando comando AVR109: Set device type');
        await sendStkCommand(new Uint8Array([0x54, 0x00])); // 'T' + device code (0x00 for generic)

        // Comando AVR109: Set address to 0
        console.log('📡 Enviando comando AVR109: Set address to 0');
        await sendStkCommand(new Uint8Array([0x41, 0x00, 0x00])); // 'A' + address high + address low

        // Parse Intel HEX and send in blocks
        const BLOCK_SIZE = 128; // AVR109 typical block size
        let currentAddress = 0;

        for (let offset = 0; offset < programData.length; offset += BLOCK_SIZE) {
          const blockSize = Math.min(BLOCK_SIZE, programData.length - offset);
          const blockData = programData.slice(offset, offset + blockSize);

          // Set address for this block
          const addressHigh = (currentAddress >> 8) & 0xFF;
          const addressLow = currentAddress & 0xFF;
          console.log(\`📡 Set address: 0x\${currentAddress.toString(16).padStart(4, '0')} (\${addressHigh.toString(16).padStart(2, '0')} \${addressLow.toString(16).padStart(2, '0')})\`);
          await sendStkCommand(new Uint8Array([0x41, addressHigh, addressLow])); // 'A' + address

          // Write block
          const writeCommand = new Uint8Array(2 + blockSize);
          writeCommand[0] = 0x42; // 'B'
          writeCommand[1] = blockSize;
          writeCommand.set(blockData, 2);

          console.log(\`📡 Write block: \${blockSize} bytes at address 0x\${currentAddress.toString(16).padStart(4, '0')}\`);
          const writeResponse = await sendStkCommand(writeCommand);
          if (writeResponse.length === 0 || writeResponse[5] !== 0x10) {
            console.log('⚠️ Resposta inesperada para Write Block');
          }

          currentAddress += blockSize;

          // Update progress
          const progressPercent = Math.floor((offset + blockSize) / programData.length * 15);
          setUploadProgress(80 + progressPercent);

          console.log(\`📤 Enviado \${offset + blockSize}/\${programData.length} bytes\`);
        }

        console.log('📤 Todos os bytes enviados');

        // Comando AVR109: Leave programming mode
        console.log('📡 Enviando comando AVR109: Leave programming mode');
        await sendStkCommand(new Uint8Array([0x51])); // 'Q'`;

fileContent = fileContent.replace(oldCode, newCode);

fs.writeFileSync(filePath, fileContent, 'utf8');

console.log('✅ Arquivo atualizado com sucesso!');