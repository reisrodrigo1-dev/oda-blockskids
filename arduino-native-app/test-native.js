// test-native.js - Script simples para testar Native Messaging
const fs = require('fs');

// Simular entrada do Chrome (4 bytes length + JSON)
function sendTestMessage() {
  const message = JSON.stringify({
    action: 'test',
    data: 'Hello from test'
  });
  
  console.log('Enviando mensagem de teste:', message);
  
  // No Native Messaging real, isso viria do Chrome
  // Aqui vamos apenas testar se o parsing funciona
  process.stdout.write('Teste concluído\n');
}

sendTestMessage();
