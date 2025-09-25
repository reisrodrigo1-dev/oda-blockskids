// simple-test.js - Teste simples de upload
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const tmp = require('tmp');

const testCode = `
void setup() {
  Serial.begin(9600);
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
  Serial.println("LED blinked!");
}
`;

async function testUpload() {
  try {
    console.log('🧪 Testando upload direto...');
    
    // 1. Criar arquivo temporário
    console.log('📁 Criando arquivo temporário...');
    const tmpDir = tmp.dirSync({ unsafeCleanup: true });
    const sketchPath = path.join(tmpDir.name, 'sketch');
    const sketchFile = path.join(sketchPath, 'sketch.ino');
    
    fs.mkdirSync(sketchPath, { recursive: true });
    fs.writeFileSync(sketchFile, testCode);
    console.log('✅ Arquivo criado em:', sketchFile);
    
    // 2. Listar portas
    console.log('🔍 Listando portas disponíveis...');
    const listResult = await runCommand('C:\\arduino-cli\\arduino-cli.exe', ['board', 'list']);
    console.log('📋 Portas:', listResult);
    
    // 3. Tentar upload na COM3
    console.log('🚀 Tentando upload na COM3...');
    const uploadResult = await runCommand('C:\\arduino-cli\\arduino-cli.exe', [
      'compile',
      '--upload',
      '-b', 'arduino:avr:uno',
      '-p', 'COM3',
      sketchPath
    ]);
    
    console.log('✅ Upload concluído!');
    console.log('📤 Resultado:', uploadResult);
    
    // Limpar
    tmpDir.removeCallback();
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    console.log('⚡ Executando:', command, args.join(' '));
    
    const process = spawn(command, args, {
      stdio: ['ignore', 'pipe', 'pipe']
    });
    
    let stdout = '';
    let stderr = '';
    
    process.stdout.on('data', (data) => {
      const output = data.toString();
      console.log('📤 OUT:', output.trim());
      stdout += output;
    });
    
    process.stderr.on('data', (data) => {
      const output = data.toString();
      console.log('📤 ERR:', output.trim());
      stderr += output;
    });
    
    process.on('close', (code) => {
      console.log('🏁 Código de saída:', code);
      
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(stderr || `Comando falhou com código ${code}`));
      }
    });
    
    process.on('error', (error) => {
      console.error('💥 Erro de processo:', error);
      reject(error);
    });
  });
}

// Executar teste
testUpload();
