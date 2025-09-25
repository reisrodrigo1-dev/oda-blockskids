// content.js - Script injetado na página
console.log('🔌 BlockuinoEditor Arduino Extension carregada');

// Injetar script na página para acessar o window
const script = document.createElement('script');
script.src = chrome.runtime.getURL('inject.js');
script.onload = function() {
  console.log('✅ Script inject.js carregado');
  this.remove();
};
(document.head || document.documentElement).appendChild(script);

// Escutar mensagens da página
window.addEventListener('message', (event) => {
  if (event.source !== window) return;
  
  if (event.data.type === 'BLOCKUINO_UPLOAD') {
    console.log('Solicitação de upload recebida:', event.data);
    
    // Enviar para background script
    chrome.runtime.sendMessage({
      type: 'UPLOAD_CODE',
      code: event.data.code,
      board: event.data.board,
      port: event.data.port
    }, (response) => {
      // Responder de volta para a página
      window.postMessage({
        type: 'BLOCKUINO_UPLOAD_RESPONSE',
        requestId: event.data.requestId,
        success: response.success,
        error: response.error
      }, '*');
    });
  }
  
  if (event.data.type === 'BLOCKUINO_CHECK_EXTENSION') {
    // Verificar se app nativo está conectado
    chrome.runtime.sendMessage({type: 'CHECK_NATIVE'}, (response) => {
      window.postMessage({
        type: 'BLOCKUINO_EXTENSION_STATUS',
        available: true,
        nativeConnected: response.connected
      }, '*');
    });
  }
});

// Escutar respostas do background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPLOAD_RESPONSE') {
    // Repassar resposta para a página
    window.postMessage({
      type: 'BLOCKUINO_NATIVE_RESPONSE',
      data: message.data
    }, '*');
  }
});
