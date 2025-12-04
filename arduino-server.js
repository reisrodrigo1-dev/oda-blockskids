import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import os from 'os';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const app = express();
const PORT = process.env.PORT || 3001;

// Obter __dirname em ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Compilação Arduino
app.post('/compile', async (req, res) => {
  const { code, boardType } = req.body;

  if (!code || !boardType) {
    return res.status(400).json({
      success: false,
      error: 'Missing code or boardType'
    });
  }

  let tempDir = null;

  try {
    console.log('📝 Recebendo código para compilação real');
    console.log('🎯 Placa:', boardType);
    console.log('📏 Tamanho do código:', code.length, 'caracteres');

    // Criar diretório temporário
    tempDir = path.join(os.tmpdir(), `arduino_compile_${Date.now()}`);
    const sketchPath = path.join(tempDir, 'sketch.ino');

    // Criar diretório
    await fs.promises.mkdir(tempDir, { recursive: true });

    // Escrever código no arquivo
    await fs.promises.writeFile(sketchPath, code);

    console.log('📁 Diretório temporário:', tempDir);
    console.log('📄 Código a compilar:', code.substring(0, 200) + '...');

    // Verificar se Arduino CLI está disponível
    try {
      const { stdout: cliVersion } = await execAsync('arduino-cli version');
      console.log('✅ Arduino CLI encontrado:', cliVersion.trim());
    } catch (cliError) {
      console.log('❌ Arduino CLI não encontrado, tentando instalar...');

      // Instalar Arduino CLI
      try {
        await execAsync('curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh');
        console.log('✅ Arduino CLI instalado');
      } catch (installError) {
        console.log('❌ Falha ao instalar Arduino CLI:', installError);
        return res.status(500).json({
          success: false,
          message: 'Arduino CLI não disponível no servidor',
          error: 'CLI_NOT_AVAILABLE'
        });
      }
    }

    // Configurar Arduino CLI
    console.log('🔧 Configurando Arduino CLI...');
    try {
      await execAsync('arduino-cli config init --additional-urls ""');
      await execAsync('arduino-cli core update-index');
      await execAsync('arduino-cli core install arduino:avr');
      console.log('✅ Core Arduino AVR instalado');
    } catch (configError) {
      console.log('⚠️ Erro na configuração (pode já estar configurado):', configError.message);
    }

    // Compilar usando Arduino CLI
    console.log('⚙️ Compilando código real...');
    const compileCommand = `arduino-cli compile --fqbn ${boardType} --output-dir "${tempDir}/build" "${sketchPath}"`;
    console.log('🛠️ Comando:', compileCommand);

    const { stdout: compileStdout, stderr: compileStderr } = await execAsync(compileCommand, {
      timeout: 60000,
      cwd: tempDir
    });

    console.log('📤 Saída da compilação:', compileStdout);
    if (compileStderr) {
      console.log('⚠️ Avisos da compilação:', compileStderr);
    }

    // Verificar se arquivo hex foi gerado
    const hexPath = path.join(tempDir, 'build', 'sketch.ino.hex');
    console.log('🔍 Procurando arquivo hex em:', hexPath);

    if (!fs.existsSync(hexPath)) {
      const altHexPath = path.join(tempDir, 'sketch.ino.hex');
      if (fs.existsSync(altHexPath)) {
        console.log('✅ Hex encontrado em caminho alternativo');
        await fs.promises.copyFile(altHexPath, hexPath);
      } else {
        const files = await fs.promises.readdir(tempDir);
        console.log('📁 Arquivos no diretório temp:', files);

        if (fs.existsSync(path.join(tempDir, 'build'))) {
          const buildFiles = await fs.promises.readdir(path.join(tempDir, 'build'));
          console.log('📁 Arquivos no build:', buildFiles);
        }

        throw new Error('Arquivo hex não foi gerado');
      }
    }

    // Ler arquivo hex gerado
    const hexContent = await fs.promises.readFile(hexPath, 'utf8');
    console.log('📦 Hex gerado com sucesso, tamanho:', hexContent.length, 'caracteres');

    // Limpar arquivos temporários
    try {
      if (tempDir) {
        await fs.promises.rm(tempDir, { recursive: true, force: true });
      }
      console.log('🧹 Arquivos temporários limpos');
    } catch (cleanupError) {
      console.log('⚠️ Erro na limpeza:', cleanupError);
    }

    res.status(200).json({
      success: true,
      hex: hexContent,
      message: 'Compilação online bem-sucedida',
      boardType: boardType,
      compileOutput: compileStdout
    });

  } catch (error) {
    console.error('❌ Erro na compilação online:', error);

    // Limpar arquivos temporários em caso de erro
    try {
      if (tempDir) {
        await fs.promises.rm(tempDir, { recursive: true, force: true });
      }
    } catch (cleanupError) {
      console.log('⚠️ Erro na limpeza após erro:', cleanupError);
    }

    res.status(500).json({
      success: false,
      message: 'Erro na compilação online',
      error: error.message,
      details: error.stderr || error.stdout || 'Erro desconhecido'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor de compilação Arduino rodando na porta ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 Compilação: POST http://localhost:${PORT}/compile`);
});