# 📡 Como Enviar Código para Arduino no /editor-offline - Guia Prático

## 🎯 Visão Geral do Fluxo

```
┌──────────────────────────────────────────────────────────────┐
│                PÁGINA /editor-offline                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Montar blocos visuais                                   │
│     ↓                                                        │
│  2. Código C++ gerado automaticamente (CodePanel)           │
│     ↓                                                        │
│  3. Conectar Arduino (Web Serial API)                       │
│     └─→ Browser pede permissão                             │
│     └─→ Selecionar porta COM3, COM4, etc                   │
│     ↓                                                        │
│  4. Clicar "Compilar e Upload" (STK500 Real!)             │
│     └─→ Envia código para backend                          │
│     └─→ Arduino CLI compila em .HEX                        │
│     └─→ Return hexfile ao navegador                        │
│     └─→ STK500v1 faz upload real                           │
│     ↓                                                        │
│  5. ✅ Arduino reinicia com código novo                    │
│     └─→ LED pisca / Código roda!                           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🚀 Passo a Passo para Enviar Código

### **PASSO 1: Preparar o Código**

**Arquivo:** `client/src/pages/editor-offline.tsx`

1. **Monte alguns blocos** na área de trabalho:
   - Arrastar bloco "Piscar LED" para o workspace
   - Ou "Acender LED" + "Esperar" + "Apagar LED"

2. **O código é gerado automaticamente** no `CodePanel`:
   ```cpp
   void setup() {
     Serial.begin(9600);
     pinMode(13, OUTPUT);
   }
   
   void loop() {
     digitalWrite(13, HIGH);
     delay(1000);
     digitalWrite(13, LOW);
     delay(1000);
   }
   ```

---

### **PASSO 2: Conectar ao Arduino**

**Localização no código:** `editor-offline.tsx` linha ~130

```typescript
const scanPorts = async () => {
  // 1️⃣ Verifica se o navegador suporta Web Serial API
  if (!('serial' in navigator)) {
    alert('❌ Use Chrome ou Edge!');
    return;
  }

  // 2️⃣ Abre modal do browser para selecionar porta
  const port = await navigator.serial.requestPort();
  
  // 3️⃣ Salva porta para usar depois
  setSelectedPort(port);
  console.log('✅ Porta selecionada!');
};
```

**O que o usuário vê:**
- Clica em algum botão "🔌 Conectar" ou "🔍 Escanear Portas"
- Aparece uma janela do browser mostrando:
  ```
  Selecione uma porta serial:
  ☑️ COM3 (Arduino Uno)  ← Selecionar esta
  ☐ COM4 (Outro device)
  [Conectar] [Cancelar]
  ```

---

### **PASSO 3: Compilar e Enviar (STK500)**

**Localização no código:** `editor-offline.tsx` linha ~165

Este é o **método principal** que chama o STK500:

```typescript
const compileAndUpload = async () => {
  // ✅ VERIFICAÇÃO 1: Porta selecionada?
  if (!selectedPort) {
    alert('❌ Selecione uma porta primeiro!');
    return;
  }

  try {
    setIsUploading(true);
    setUploadProgress(0);

    // ✅ PASSO 1: Validar código (10-30%)
    console.log('🔧 Validando código...');
    if (!generatedCode.includes('void setup()') || 
        !generatedCode.includes('void loop()')) {
      throw new Error('Código inválido!');
    }
    setUploadProgress(30);

    // ✅ PASSO 2: Enviar para backend compilar (30-70%)
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    setUploadProgress(50);
    
    const compileResponse = await fetch(`${apiUrl}/api/compile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: generatedCode,
        boardType: 'arduino:avr:uno'
      })
    });

    const compileResult = await compileResponse.json();
    if (!compileResult.success) {
      throw new Error('Compilação falhou!');
    }

    const hexContent = compileResult.hex; // ← Arquivo .HEX
    console.log('📦 Hex recebido:', hexContent.length, 'caracteres');

    // ✅ PASSO 3: UPLOAD REAL via STK500 (70-100%)
    setUploadProgress(70);
    console.log('🚀 Iniciando upload STK500...');

    // Abrir porta serial
    await selectedPort.open({ baudRate: 115200 });

    // ⭐ AQUI ACONTECE A MÁGICA DO STK500 ⭐
    // Chamando método de upload que implementamos:
    const uploadSuccess = await arduinoCompiler.upload(
      hexContent,
      selectedPort  // ← A porta COM3/COM4 selecionada
    );

    if (!uploadSuccess) {
      throw new Error('Falha no upload STK500');
    }

    setUploadProgress(100);
    console.log('🎉 Upload concluído!');
    alert('✅ Código enviado ao Arduino com sucesso!');

  } catch (error: any) {
    console.error('❌ Erro:', error);
    alert(`Erro: ${error.message}`);
  } finally {
    setIsUploading(false);
    await selectedPort.close();
  }
};
```

---

## 🔧 O Que Acontece NO STK500

**Arquivo:** `client/src/lib/arduino-compiler.ts`

Quando você chama `arduinoCompiler.upload(hexContent, port)`:

### **Fase 1: Reset via DTR**
```typescript
async resetArduino(port: SerialPort): Promise<void> {
  // Descer a linha DTR para resetar o Arduino
  await port.setSignals({ dataTerminalReady: false });
  await delay(250); // Esperar capacitor descarregar
  
  // Subir DTR de novo para sair do reset
  await port.setSignals({ dataTerminalReady: true });
  console.log('✅ Arduino resetado!');
}
```

**O que acontece fisicamente:**
- Pino RESET do Arduino vai para LOW
- Arduino reinicia
- Bootloader ativa (~1-2 segundos)

### **Fase 2: Sincronização com Bootloader**
```typescript
private async stk500Sync(port: SerialPort, writer: WritableStreamDefaultWriter) {
  // Enviar comando: 0x30 0x20 (GET_SYNC)
  await this.sendCommand(writer, [0x30, 0x20]);
  
  // Esperar resposta: 0x14 0x10 (INSYNC, OK)
  const response = await this.readResponse(port, 2, 1000);
  
  if (response[0] !== 0x14 || response[1] !== 0x10) {
    throw new Error('Bootloader não respondeu!');
  }
  console.log('✅ Sincronizado com bootloader!');
}
```

**Diagrama:**
```
PC (Browser)              Arduino Bootloader
    ↓                            ↑
[0x30, 0x20] ────────────→ "Tem alguém aí?"
    ↑                            ↓
[0x14, 0x10] ←──────────── "Estou aqui!"
```

### **Fase 3: Enter Programming Mode**
```typescript
private async stk500EnterProgMode(...) {
  // Enviar: 0x50 0x20 (ENTER_PROGMODE)
  await this.sendCommand(writer, [0x50, 0x20]);
  const response = await this.readResponse(port, 2, 1000);
  
  if (response[0] !== 0x14 || response[1] !== 0x10) {
    throw new Error('Não consegui entrar em modo de programação!');
  }
  console.log('✅ Modo de programação ativo!');
}
```

### **Fase 4: Parse do .HEX**
```typescript
private parseHex(hexString: string): Uint8Array {
  // Converter arquivo Intel HEX
  // :10 0000 00 A9878787... FF
  //  ^^  ^^^^ ^^                  ^^
  // len  addr type   dados      checksum
  
  // Resultado: Array de bytes pronto para gravar
  return new Uint8Array([0xA9, 0x87, 0x87, 0x87, ...]);
}
```

### **Fase 5: Upload em Páginas (128 bytes)**
```typescript
private async uploadPages(port: SerialPort, data: Uint8Array) {
  // Dividir em páginas de 128 bytes
  for (let addr = 0; addr < data.length; addr += 128) {
    const page = data.slice(addr, addr + 128);
    
    // 1️⃣ Enviar endereço
    await this.stk500LoadAddress(port, writer, addr >> 1);
    
    // 2️⃣ Enviar os 128 bytes
    await this.stk500ProgPage(port, writer, page);
    
    // 3️⃣ Confirmar: 0x14 0x10 (INSYNC, OK)
    // Se tudo OK, continuar para próxima página
    
    console.log(`📊 ${Math.round(addr/data.length*100)}% completo`);
  }
}
```

**Exemplo visualizado:**
```
PÁGINA 1 (bytes 0-127)
├─ Enviar: [0x55, 0x00, 0x00, 0x20] (LOAD_ADDRESS endereço 0x0000)
├─ Resposta: [0x14, 0x10] ✅
├─ Enviar: [0x64, 0x00, 0x80, 0x46] + 128 bytes de dados + [0x20]
├─ Resposta: [0x14, 0x10] ✅
└─ Progresso: 5%

PÁGINA 2 (bytes 128-255)
├─ Enviar: [0x55, 0x01, 0x00, 0x20] (endereço 0x0001)
├─ Resposta: [0x14, 0x10] ✅
├─ Enviar: [0x64, 0x00, 0x80, 0x46] + 128 bytes + [0x20]
├─ Resposta: [0x14, 0x10] ✅
└─ Progresso: 10%

... (repete até 100%)
```

### **Fase 6: Leave Programming Mode**
```typescript
private async stk500LeaveProgMode(...) {
  // Enviar: 0x51 0x20 (LEAVE_PROGMODE)
  await this.sendCommand(writer, [0x51, 0x20]);
  const response = await this.readResponse(port, 2, 1000);
  console.log('✅ Saindo do modo de programação!');
}
```

---

## 🎯 Logs do Console Para Acompanhar

Quando você faz o upload, você verá **no console do navegador** (F12):

```
🚀 Iniciando upload via protocolo STK500v1...
🔄 Resetando Arduino via DTR...
✅ Arduino resetado com sucesso!
📡 Iniciando sincronização com bootloader...
✅ Bootloader sincronizado!
🔐 Entrando em modo de programação...
✅ Modo de programação ativo!
📦 Parseando arquivo .HEX...
✅ 2048 bytes parsed para upload
📤 Enviando código compilado...
📊 Progresso: 0%
📊 Progresso: 25%
📊 Progresso: 50%
📊 Progresso: 75%
📊 Progresso: 100%
✅ Todas as páginas enviadas!
🔓 Saindo do modo de programação...
✅ Bootloader finalizado!
🎉 Upload concluído com sucesso!
✨ Seu código está rodando no Arduino agora!
```

---

## 🐛 Troubleshooting

### **Problema 1: "Bootloader não respondeu"**
```
❌ Erro: Falha na sincronização: Bootloader não respondeu correctamente
```

**Causas possíveis:**
- Arduino não está plugado corretamente
- Cabo USB ruim
- Porta errada selecionada
- Arduino não tem bootloader (placa queimada)

**Solução:**
1. Despluga e repluga o Arduino
2. Tenta novamente

### **Problema 2: "Timeout reading response"**
```
❌ Erro ao ler resposta: Timeout
```

**Causa:** Bootloader não está respondendo em tempo

**Solução:**
1. Espera 2 segundos
2. Clica no botão de upload novamente

### **Problema 3: "Compilação falhou"**
```
❌ Erro na compilação: Código Arduino inválido
```

**Causa:** Código não tem `void setup()` ou `void loop()`

**Solução:**
1. Arrasta blocos novamente
2. Verifica se código gerado tem as 2 funções

---

## 📱 Fluxo no UI (O que Usuário Clica)

Na página `/editor-offline`, você precisa de 2 botões:

### **Botão 1: Conectar**
```
[🔌 Conectar Arduino] ← Chama scanPorts()
```
- Quando clicado: Browser abre modal pedindo permissão
- Usuário seleciona porta COM
- Estado muda para `isConnected = true`

### **Botão 2: Compilar e Upload** 
```
[📡 Compilar e Upload] ← Chama compileAndUpload()
```
- Quando clicado: Inicia fluxo completo STK500
- Mostra progresso: `uploadProgress` % (0-100%)
- Quando termina: Alert "✅ Sucesso!"

---

## ✅ Checklist para Testar

- [ ] Arduino Uno plugado via USB
- [ ] Navegador Chrome ou Edge
- [ ] Servidor rodando em http://localhost:5000
- [ ] Frontend rodando em http://localhost:5173
- [ ] Você consegue arrastar blocos
- [ ] Código C++ é gerado no CodePanel
- [ ] Clica em "Conectar" e seleciona porta COM
- [ ] Clica em "Compilar e Upload"
- [ ] Vê progresso aumentando (0%, 25%, 50%, ..., 100%)
- [ ] Alert de sucesso aparece
- [ ] ✨ LED do Arduino pisca ou seu código roda!

---

## 🔗 Arquivos Envolvidos

| Arquivo | Responsabilidade |
|---------|------------------|
| `client/src/pages/editor-offline.tsx` | Interface, botões, fluxo principal |
| `client/src/lib/arduino-compiler.ts` | **STK500v1 protocol (IMPLEMENTADO)** |
| `client/src/hooks/use-arduino-serial.ts` | Hook com estados de conexão/upload |
| `arduino-server.js` | Backend que compila com Arduino CLI |

---

## 🚀 Próximas Melhorias Possíveis

1. **Retry automático** - Se falhar, tenta 3x
2. **Progress bar visual** - Mostrar barra na UI
3. **Suporte múltiplos Arduinos** - Nano, Mega, etc
4. **Detecção automática** de placa
5. **Salvar logs** do upload para debug

---

**Status:** ✅ STK500 Implementado e Pronto para Testar  
**Data:** 6 de Março de 2026
