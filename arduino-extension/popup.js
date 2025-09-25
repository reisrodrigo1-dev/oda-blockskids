// popup.js - Script do popup da extensão
document.addEventListener('DOMContentLoaded', async () => {
  const statusDiv = document.getElementById('status');
  const installBtn = document.getElementById('installBtn');
  const testBtn = document.getElementById('testBtn');
  
  async function checkStatus() {
    try {
      const response = await chrome.runtime.sendMessage({type: 'CHECK_NATIVE'});
      
      if (response.connected) {
        statusDiv.className = 'status connected';
        statusDiv.textContent = '✅ App nativo conectado';
        installBtn.style.display = 'none';
      } else {
        statusDiv.className = 'status disconnected';
        statusDiv.textContent = '❌ App nativo não encontrado';
        installBtn.style.display = 'block';
      }
    } catch (error) {
      statusDiv.className = 'status disconnected';
      statusDiv.textContent = '❌ Erro na conexão';
      installBtn.style.display = 'block';
    }
  }
  
  // Verificar status inicial
  await checkStatus();
  
  // Botão de testar
  testBtn.addEventListener('click', async () => {
    testBtn.textContent = 'Testando...';
    testBtn.disabled = true;
    
    await checkStatus();
    
    testBtn.textContent = 'Testar Conexão';
    testBtn.disabled = false;
  });
  
  // Botão de instalar
  installBtn.addEventListener('click', () => {
    chrome.tabs.create({
      url: 'https://github.com/seu-usuario/blockuino-arduino-uploader/releases'
    });
  });
});
