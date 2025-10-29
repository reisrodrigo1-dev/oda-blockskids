import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const [,, sourceFile, outputFile] = process.argv;

if (!sourceFile) {
  console.error('Erro: Arquivo fonte não fornecido');
  process.exit(1);
}

const finalOutputFile = outputFile || 'temp.hex';

try {
  // Verificar se arquivo fonte existe
  if (!fs.existsSync(sourceFile)) {
    console.error(`Erro: Arquivo fonte não encontrado: ${sourceFile}`);
    process.exit(1);
  }

  // Criar diretório temporário para a compilação
  const tempDir = path.join(os.tmpdir(), `arduino_compile_${Date.now()}`);
  fs.mkdirSync(tempDir, { recursive: true });

  // Copiar arquivo fonte para o diretório temporário
  const sketchFile = path.join(tempDir, 'sketch.ino');
  fs.copyFileSync(sourceFile, sketchFile);

  // Compilar usando arduino-cli
  const arduinoCliPath = path.join(process.cwd(), 'arduino-cli.exe');
  const compileProcess = spawn(arduinoCliPath, [
    'compile',
    '--fqbn', 'arduino:avr:uno',
    tempDir,
    '--output-dir', path.join(tempDir, 'build')
  ], {
    cwd: process.cwd(),
    stdio: 'inherit'
  });

  compileProcess.on('close', (code) => {
    if (code === 0) {
      // Procurar arquivo hex gerado
      const buildDir = path.join(tempDir, 'build');
      const hexFiles = fs.readdirSync(buildDir).filter(file => file.endsWith('.hex'));

      if (hexFiles.length > 0) {
        const hexFile = path.join(buildDir, hexFiles[0]);
        fs.copyFileSync(hexFile, finalOutputFile);
        console.log(`Compilação bem-sucedida: ${finalOutputFile}`);
      } else {
        console.error('Erro: Arquivo hex não encontrado');
        process.exit(1);
      }
    } else {
      console.error('Erro na compilação');
      process.exit(1);
    }

    // Limpar diretório temporário
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (error) {
      console.error('Erro ao limpar arquivos temporários:', error);
    }
  });

  compileProcess.on('error', (error) => {
    console.error('Erro ao executar arduino-cli:', error);
    process.exit(1);
  });

} catch (error) {
  console.error('Erro:', error);
  process.exit(1);
}