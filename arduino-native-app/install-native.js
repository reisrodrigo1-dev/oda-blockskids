// install-native.js - Script para instalar Native Messaging Host
const fs = require('fs');
const path = require('path');
const os = require('os');

function installNativeMessagingHost() {
  const appPath = path.resolve(__dirname, 'app.js');
  const hostName = 'com.blockuino.arduino_uploader';
  
  // Configuração do Native Messaging Host para Windows
  const hostManifest = {
    name: hostName,
    description: 'BlockuinoEditor Arduino Uploader',
    path: 'node',
    arguments: [appPath],
    type: 'stdio',
    allowed_origins: [
      'chrome-extension://[EXTENSION_ID]/'  // Substituir pelo ID real da extensão
    ]
  };
  
  let manifestPath;
  
  if (os.platform() === 'win32') {
    // Windows: Registry + arquivo
    const manifestDir = path.join(os.homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'NativeMessagingHosts');
    fs.mkdirSync(manifestDir, { recursive: true });
    manifestPath = path.join(manifestDir, `${hostName}.json`);
    
    // Criar registro no Windows Registry
    const { spawn } = require('child_process');
    const regKey = `HKEY_CURRENT_USER\\SOFTWARE\\Google\\Chrome\\NativeMessagingHosts\\${hostName}`;
    
    spawn('reg', ['add', regKey, '/ve', '/d', manifestPath, '/f'], { stdio: 'inherit' });
    
  } else if (os.platform() === 'darwin') {
    // macOS
    manifestPath = path.join(os.homedir(), 'Library', 'Application Support', 'Google', 'Chrome', 'NativeMessagingHosts', `${hostName}.json`);
    fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
    
  } else {
    // Linux
    manifestPath = path.join(os.homedir(), '.config', 'google-chrome', 'NativeMessagingHosts', `${hostName}.json`);
    fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  }
  
  // Escrever arquivo manifest
  fs.writeFileSync(manifestPath, JSON.stringify(hostManifest, null, 2));
  
  console.log('✅ Native Messaging Host instalado com sucesso!');
  console.log('📁 Manifest criado em:', manifestPath);
  console.log('');
  console.log('🔧 Próximos passos:');
  console.log('1. Instale o Arduino CLI: https://arduino.cc/cli');
  console.log('2. Substitua [EXTENSION_ID] no manifest pelo ID real da extensão');
  console.log('3. Carregue a extensão no Chrome (modo desenvolvedor)');
  console.log('4. Teste a conexão no popup da extensão');
}

if (require.main === module) {
  installNativeMessagingHost();
}

module.exports = { installNativeMessagingHost };
