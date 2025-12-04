# 📋 GUIA IMPRESSO - BLOCKUINO ARDUINO SYSTEM
# Para quem NÃO domina internet

## 🎯 OBJETIVO
Configurar tudo para enviar código do computador direto para Arduino

---

## 📦 O QUE VOCÊ RECEBEU
- Pasta com arquivos do BlockuinoEditor
- Arduino Uno (placa azul retangular)
- Cabo USB
- Este guia impresso

---

## ⚙️ INSTALAÇÃO AUTOMÁTICA (MAIS FÁCIL)

### PASSO 1: Executar Instalador
1. **Localize** o arquivo `INSTALADOR_AUTOMATICO.bat`
2. **Clique com botão direito** no arquivo
3. **Escolha** "Executar como administrador"
4. **Aguarde** terminar (leva 2-3 minutos)
5. **Siga as instruções** que aparecem na tela

### O QUE O INSTALADOR FAZ:
- ✅ Baixa e instala Arduino CLI
- ✅ Configura suporte ao Arduino
- ✅ Testa se está funcionando
- ✅ Verifica se Arduino está conectado

---

## 🔧 INSTALAÇÃO MANUAL (SE AUTOMÁTICA DER ERRO)

### PARTE 1: Instalar Arduino CLI

#### Opção A: Usar arquivo pronto
1. Procure arquivo `arduino-cli.exe` na pasta do projeto
2. Copie para `C:\arduino-cli\arduino-cli.exe`
3. Se pasta não existir, crie ela

#### Opção B: Download manual
1. Peça para alguém baixar: https://downloads.arduino.cc/arduino-cli/arduino-cli_latest_Windows_64bit.zip
2. Extraia o ZIP
3. Copie `arduino-cli.exe` para `C:\arduino-cli\`

### PARTE 2: Configurar Arduino CLI
1. Abra **Prompt de Comando** (pesquise no Windows)
2. Digite estes comandos um por vez:
```
C:\arduino-cli\arduino-cli.exe config init
C:\arduino-cli\arduino-cli.exe core update-index
C:\arduino-cli\arduino-cli.exe core install arduino:avr
C:\arduino-cli\arduino-cli.exe version
```

---

## 🌐 INSTALAR EXTENSÃO CHROME (PASSO MANUAL)

### PASSO 1: Abrir Chrome
1. Clique no ícone do Google Chrome na área de trabalho
2. Na barra de endereço, digite: `chrome://extensions/`
3. Pressione Enter

### PASSO 2: Ativar Modo Desenvolvedor
1. No canto superior direito, **ative** "Modo do desenvolvedor"
2. Aparecerá um botão azul "Carregar extensão sem compactação"

### PASSO 3: Carregar Extensão
1. Clique **"Carregar extensão sem compactação"**
2. Procure e selecione a pasta `arduino-extension`
3. A extensão será instalada
4. **IMPORTANTE:** Copie o ID que aparece (parece código longo)

---

## 📱 INSTALAR APP NATIVO

### PASSO 1: Abrir Prompt de Comando
1. Pressione **Windows + R**
2. Digite `cmd` e pressione Enter

### PASSO 2: Ir para pasta certa
1. Digite: `cd arduino-native-app`
2. Pressione Enter

### PASSO 3: Instalar dependências
1. Digite: `npm install`
2. Pressione Enter
3. Aguarde terminar

### PASSO 4: Registrar app
1. Digite: `node install-native.js`
2. Pressione Enter
3. Quando pedir ID da extensão, **cole o ID copiado** anteriormente
4. Pressione Enter

---

## 🧪 TESTAR INSTALAÇÃO

### PASSO 1: Abrir BlockuinoEditor
1. Procure arquivo `start_server.bat`
2. Clique duas vezes para executar
3. Aguarde abrir navegador

### PASSO 2: Verificar painel Arduino
1. No site, clique no **botão 🔧** (canto inferior direito)
2. Deve aparecer painel Arduino
3. Procure:
   - ✅ **Arduino CLI Instalado** (verde)
   - ⚡ **Upload Direto Disponível** (roxo)

---

## 🚀 USANDO O SISTEMA

### CRIAR PROGRAMA
1. Arraste blocos na tela
2. Monte um circuito simples (ex: LED piscando)

### ENVIAR PARA ARDUINO
1. **Conecte Arduino** via cabo USB
2. Clique **botão azul roxo** "🌐 Compilar Online + Upload Direto"
3. Quando pedir permissão, clique **"Permitir"**
4. Aguarde barras de progresso
5. **PRONTO!** Código no Arduino

---

## 🔍 SOLUÇÃO DE PROBLEMAS

### ❌ "Sem internet"
- Conecte cabo de rede ou WiFi
- Teste abrindo site qualquer

### ❌ "Acesso negado"
- Execute tudo como **ADMINISTRADOR**
- Clique direito → "Executar como administrador"

### ❌ "Arduino não detectado"
- Tente outra porta USB
- Use cabo USB original
- Feche outros programas

### ❌ "Extensão não carrega"
- Certifique-se que pasta `arduino-extension` existe
- Tente recarregar página

### ❌ "App nativo falha"
- Execute Prompt como administrador
- Digite comandos exatamente como mostrado

---

## 📞 SUPORTE

### Se nada funcionar:
1. Reinicie computador
2. Execute instalador novamente
3. Peça ajuda para alguém que entende de computador

### Arquivos importantes:
- `INSTALADOR_AUTOMATICO.bat` - Instalação automática
- `arduino-extension/` - Pasta da extensão Chrome
- `arduino-native-app/` - Pasta do app nativo
- `INSTALL_ARDUINO_CLI.md` - Guia detalhado

---

## ✅ CHECKLIST FINAL

- [ ] Arduino CLI instalado (C:\arduino-cli\arduino-cli.exe)
- [ ] Extensão Chrome carregada
- [ ] App nativo registrado
- [ ] Arduino conectado via USB
- [ ] Painel mostra tudo verde ✅
- [ ] Upload direto funcionando

**PARABÉNS! Agora você pode programar Arduino com blocos! 🎉**