// background.js - Service Worker da Extensão
let nativePort = null;

// Conectar ao app nativo
function connectNative() {
  if (nativePort) return;
  
  try {
    nativePort = chrome.runtime.connectNative('com.blockuino.arduino_uploader');
    
    nativePort.onMessage.addListener((message) => {
      console.log('Mensagem do app nativo:', message);
      
      // Enviar resposta de volta para o content script
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: 'UPLOAD_RESPONSE',
            data: message
          });
        }
      });
    });
    
    nativePort.onDisconnect.addListener(() => {
      console.log('App nativo desconectado');
      nativePort = null;
    });
    
  } catch (error) {
    console.error('Erro ao conectar app nativo:', error);
  }
}

// Escutar mensagens do content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPLOAD_CODE') {
    connectNative();
    
    if (nativePort) {
      // Enviar código para o app nativo
      nativePort.postMessage({
        action: 'upload',
        code: message.code,
        board: message.board || 'arduino:avr:uno',
        port: message.port || 'auto'
      });
      
      sendResponse({success: true});
    } else {
      sendResponse({
        success: false, 
        error: 'App nativo não conectado. Instale o Arduino Uploader.'
      });
    }
  }
  
  if (message.type === 'CHECK_NATIVE') {
    connectNative();
    sendResponse({connected: !!nativePort});
  }
  
  return true; // Manter canal aberto para resposta assíncrona
});

// Auto-conectar ao iniciar
chrome.runtime.onStartup.addListener(connectNative);
chrome.runtime.onInstalled.addListener(connectNative);
