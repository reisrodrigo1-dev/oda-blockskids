const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const os = require('os');

const execAsync = promisify(exec);

module.exports = async (req, res) => {
  // Configurar headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Responder a preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, boardType } = req.body;

  if (!code || !boardType) {
    return res.status(400).json({ error: 'Missing code or boardType' });
  }

  let tempDir = null;

  try {
    // Criar diretório temporário
    tempDir = path.join(os.tmpdir(), `arduino_compile_${Date.now()}`);
    const sketchPath = path.join(tempDir, 'sketch.ino');

    // Criar diretório
    await fs.promises.mkdir(tempDir, { recursive: true });

    // Escrever código no arquivo
    await fs.promises.writeFile(sketchPath, code);

    console.log('📝 Código recebido:', code.substring(0, 100) + '...');
    console.log('🎯 Placa:', boardType);
    console.log('📁 Diretório temporário:', tempDir);

    // Verificar se Arduino CLI está disponível
    try {
      const { stdout: cliVersion } = await execAsync('arduino-cli version');
      console.log('✅ Arduino CLI encontrado:', cliVersion.trim());
    } catch (cliError) {
      console.log('❌ Arduino CLI não encontrado, tentando instalar...');

      // Tentar instalar Arduino CLI se não estiver disponível
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

    // Configurar Arduino CLI (adicionar core do Arduino AVR)
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
    console.log('⚙️ Compilando código...');
    const compileCommand = `arduino-cli compile --fqbn ${boardType} --output-dir "${tempDir}/build" "${sketchPath}"`;
    console.log('🛠️ Comando:', compileCommand);

    const { stdout: compileStdout, stderr: compileStderr } = await execAsync(compileCommand, {
      timeout: 60000, // 60 segundos timeout
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
      // Tentar outros possíveis caminhos
      const altHexPath = path.join(tempDir, 'sketch.ino.hex');
      if (fs.existsSync(altHexPath)) {
        console.log('✅ Hex encontrado em caminho alternativo');
        // Copiar para o caminho esperado
        await fs.promises.copyFile(altHexPath, hexPath);
      } else {
        // Listar arquivos no diretório para debug
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
      await fs.promises.rm(tempDir, { recursive: true, force: true });
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
};