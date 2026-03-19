# 🔧 Ajustes para CH340 (Arduino Uno Clone)

## ✅ Mudanças Implementadas

### 1️⃣ DTR + RTS Juntos (Para CH340)
**Linha: ~389**

Antes:
```javascript
await selectedPort.setSignals({ dataTerminalReady: false });
```

Depois:
```javascript
await selectedPort.setSignals({ 
  dataTerminalReady: false, 
  requestToSend: false 
});
```

**Por quê?** O chip CH340 (usado em clones) precisa de ambos os sinais (DTR + RTS) para fazer o reset corretamente.

---

### 2️⃣ Auto-swap de Baudrate (115200 → 57600)
**Linha: ~376-399**

Agora o código:
- Tenta **3 vezes com 115200 baud** (Optiboot moderno)
- Se falhar, fecha porta e reabre com **57600 baud** (Bootloader antigo)
- Tenta mais 2 vezes com 57600

Isso cobre:
- ✅ Arduinos Uno com bootloader moderno (Optiboot)
- ✅ Arduinos Nano antigos (baudRate 57600)
- ✅ Clones com bootloaders antigos

---

### 3️⃣ Mensagem de Diagnóstico Melhorada
**Linha: ~461**

Agora pede para **testar o LED**:

```
🔍 TESTE DIAGNÓSTICO:
Olhe para placa quando aparecer "RESET: DTR+RTS LOW":
  ✅ LED "L" piscou? → Vai para Solução 3
  ❌ LED "L" NÃO piscou? → Vai para Solução 1 ou 2
```

**O que testar:**
- Se **LED não piscou** → Problema de hardware (cabo, porta USB, etc)
- Se **LED piscou mas erro continua** → Bootloader antigo (57600 já foi tentado)

---

## 🧪 Como Testar

1. **Recarregue a página** (F5) para pegar as mudanças
2. **Clique "🔍 Conectar"** → Selecione porta Arduino
3. **Clique "🚀 Upload"**
4. **Observe o Arduino** durante os primeiros segundos
5. **Procure pelo LED "L"** na placa

### Resultados Esperados:

#### Cenário 1: LED piscou + Upload deu certo ✅
- CH340 funciona com DTR+RTS
- Bootloader responde em 115200
- **PARABÉNS! Sistema funcionando!**

#### Cenário 2: LED piscou + "Bootloader não respondeu"
- CH340 reset funciona
- Bootloader é muito antigo
- Campo "57600 baud" foi tentado
- **Solução: Use "🖥️ IDE"**

#### Cenário 3: LED NÃO piscou
- Problema de reset
- Verifique cabo USB
- Tente outra porta USB
- **Solução: Hardware check**

---

## 📊 Sequência de Eventos no Console

```
📡 RESET: DTR+RTS LOW (250ms) - Para CH340...    ← Neste momento, observe LED
📡 RESET: DTR+RTS HIGH...
⏳ Aguardando bootloader acordar (1.5s)...
🔍 Enviando STK_GET_SYNC (0x30 0x20)...
⏳ Aguardando resposta INSYNC...
✅ INSYNC recebido! Bootloader sincronizado!     ← Se chegar aqui = sucesso!
```

---

## 💡 Por que CH340 é diferente?

| Aspecto | ATmega16U2 (Original) | CH340 (Clone) |
|--------|---------------------|--------------|
| Chip | Oficial Arduino | Terceira empresa |
| DTR | Sozinho funciona | Precisa de RTS |
| RTS | Opcional | Obrigatório |
| Custo | Alto | Baixo |
| Compatibilidade | 100% | 95-99% |

---

## 🎯 Próximas Versões

Se este código não funcionar, investigar:

1. **Inverter lógica** - Tentar HIGH → LOW em vez de LOW → HIGH
2. **Detectar SO** - Talvez Windows precise de timing diferente
3. **Implementar stk500v2** - Para suportar Arduino Mega e outros
4. **Buffer de resposta** - Talvez bootloader envie mais bytes

---

## ✨ Conclusão

Você agora tem:
- ✅ DTR + RTS para CH340
- ✅ Auto-retry com 57600
- ✅ Diagnóstico visual (LED test)
- ✅ Fallback para Arduino IDE

Este é o máxima compatibilidade sem instalar nada de novo!
