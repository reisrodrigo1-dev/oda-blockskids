// update-extension-id.js - Script para atualizar ID da extensão
const fs = require('fs');
const path = require('path');
const os = require('os');

function updateExtensionId(extensionId) {
  if (!extensionId || extensionId.length < 20) {
    console.error('❌ ID da extensão inválido. Deve ter pelo menos 20 caracteres.');
    console.log('Exemplo: abcdefghijklmnopqrstuvwxyz');
    return;
  }
  
  const manifestPath = path.join(
    os.homedir(),
    'AppData',
    'Local',
    'Google',
    'Chrome',
    'User Data',
    'NativeMessagingHosts',
    'com.blockuino.arduino_uploader.json'
  );
  
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // Atualizar allowed_origins com o ID real
    manifest.allowed_origins = [
      `chrome-extension://${extensionId}/`
    ];
    
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    
    console.log('✅ ID da extensão atualizado com sucesso!');
    console.log('📁 Manifest atualizado em:', manifestPath);
    console.log('🔗 Allowed origins:', manifest.allowed_origins);
    console.log('');
    console.log('🎉 Agora você pode:');
    console.log('1. Recarregar a extensão no Chrome');
    console.log('2. Abrir seu site e testar o upload direto');
    console.log('3. Verificar o popup da extensão');
    
  } catch (error) {
    console.error('❌ Erro ao atualizar manifest:', error.message);
  }
}

// Usar o primeiro argumento da linha de comando
const extensionId = process.argv[2];

if (!extensionId) {
  console.log('📋 Uso: node update-extension-id.js <ID_DA_EXTENSAO>');
  console.log('');
  console.log('Como obter o ID:');
  console.log('1. Abra chrome://extensions/');
  console.log('2. Ative "Modo do desenvolvedor"');
  console.log('3. Carregue a pasta arduino-extension');
  console.log('4. Copie o ID que aparece (32 caracteres)');
  console.log('5. Execute: node update-extension-id.js <ID_COPIADO>');
} else {
  updateExtensionId(extensionId);
}
