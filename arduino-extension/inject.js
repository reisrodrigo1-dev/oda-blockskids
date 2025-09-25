// inject.js - Script injetado no contexto da página
console.log('🔧 BlockuinoEditor Arduino Bridge injetado');

// API global para o site usar
window.BlockuinoArduino = {
  // Verificar se extensão está disponível
  async checkExtension() {
    console.log('🔍 Verificando status da extensão...');
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        console.log('⏰ Timeout ao verificar extensão');
        resolve({available: false, error: 'Extensão não instalada'});
      }, 1000);
      
      const handler = (event) => {
        if (event.data.type === 'BLOCKUINO_EXTENSION_STATUS') {
          console.log('✅ Status recebido:', event.data);
          clearTimeout(timeout);
          window.removeEventListener('message', handler);
          resolve({
            available: event.data.available,
            nativeConnected: event.data.nativeConnected
          });
        }
      };
      
      window.addEventListener('message', handler);
      window.postMessage({type: 'BLOCKUINO_CHECK_EXTENSION'}, '*');
    });
  },
  
  // Upload de código
  async uploadCode(code, options = {}) {
    const requestId = Date.now().toString();
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout: Upload demorou mais que 30s'));
      }, 30000);
      
      const handler = (event) => {
        if (event.data.type === 'BLOCKUINO_UPLOAD_RESPONSE' && 
            event.data.requestId === requestId) {
          clearTimeout(timeout);
          window.removeEventListener('message', handler);
          
          if (event.data.success) {
            resolve({success: true});
          } else {
            reject(new Error(event.data.error || 'Erro no upload'));
          }
        }
        
        if (event.data.type === 'BLOCKUINO_NATIVE_RESPONSE') {
          // Feedback do app nativo
          if (event.data.data.status === 'success') {
            clearTimeout(timeout);
            window.removeEventListener('message', handler);
            resolve({
              success: true,
              message: event.data.data.message
            });
          } else if (event.data.data.status === 'error') {
            clearTimeout(timeout);
            window.removeEventListener('message', handler);
            reject(new Error(event.data.data.error));
          }
          // Para status 'progress', continuar escutando
        }
      };
      
      window.addEventListener('message', handler);
      window.postMessage({
        type: 'BLOCKUINO_UPLOAD',
        requestId: requestId,
        code: code,
        board: options.board || 'arduino:avr:uno',
        port: options.port || 'auto'
      }, '*');
    });
  }
};

// Evento para notificar que a API está pronta
console.log('🎉 Disparando evento blockuino-arduino-ready');
window.dispatchEvent(new CustomEvent('blockuino-arduino-ready'));

// Log para debug
console.log('🔗 window.BlockuinoArduino:', window.BlockuinoArduino);
