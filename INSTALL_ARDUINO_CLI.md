# Como Instalar o Arduino CLI

## 📋 Pré-requisitos

- Sistema Operacional: Windows 10 ou superior
- Conexão com internet para download

## 🚀 Instalação Automática (Recomendado)

### Passo 1: Baixar o Arduino CLI
```bash
# Criar pasta para o Arduino CLI
New-Item -ItemType Directory -Force -Path "C:\arduino-cli"

# Baixar a versão mais recente
Invoke-WebRequest -Uri "https://downloads.arduino.cc/arduino-cli/arduino-cli_latest_Windows_64bit.zip" -OutFile "arduino-cli.zip"
```

### Passo 2: Extrair e Instalar
```bash
# Extrair o arquivo zip
Expand-Archive -Path "arduino-cli.zip" -DestinationPath "C:\arduino-cli" -Force

# Verificar se foi extraído corretamente
Get-ChildItem "C:\arduino-cli"
```

### Passo 3: Verificar Instalação
```bash
# Executar versão para verificar
C:\arduino-cli\arduino-cli.exe version
```

**Resultado esperado:**
```
arduino-cli Version: 1.3.1 Commit: ...
```

## 🔧 Instalação Manual

### Opção 1: Site Oficial Arduino
1. Acesse: https://arduino.github.io/arduino-cli/0.35/installation/
2. Baixe a versão para Windows (64-bit)
3. Extraia para `C:\arduino-cli\`
4. Renomeie o executável para `arduino-cli.exe`

### Opção 2: GitHub Releases
1. Acesse: https://github.com/arduino/arduino-cli/releases
2. Baixe: `arduino-cli_latest_Windows_64bit.zip`
3. Extraia para `C:\arduino-cli\`

## ⚙️ Configuração Inicial

### Instalar Core do Arduino Uno
```bash
C:\arduino-cli\arduino-cli.exe config init
C:\arduino-cli\arduino-cli.exe core update-index
C:\arduino-cli\arduino-cli.exe core install arduino:avr
```

### Verificar Instalação Completa
```bash
# Verificar versão
C:\arduino-cli\arduino-cli.exe version

# Listar placas disponíveis
C:\arduino-cli\arduino-cli.exe board listall | findstr "uno"
```

## 🔍 Verificação no Sistema

### No Painel Arduino do BlockuinoEditor
- Abra o painel Arduino (canto inferior direito)
- Procure a seção **"Arduino CLI Instalado"**
- Deve mostrar ✅ verde se estiver funcionando

### Verificação Manual
```bash
# Teste básico
C:\arduino-cli\arduino-cli.exe --help

# Teste de compilação
C:\arduino-cli\arduino-cli.exe core list
```

## 🐛 Problemas Comuns

### ❌ "arduino-cli não é reconhecido"
**Solução:** Verifique se o arquivo está em `C:\arduino-cli\arduino-cli.exe`

### ❌ "Access denied" ao executar
**Solução:** Execute o PowerShell como Administrador

### ❌ "Core não encontrado"
**Solução:** Execute `arduino-cli core install arduino:avr`

### ❌ Painel mostra "Não Encontrado"
**Solução:** Reinicie o navegador e verifique o caminho do arquivo

## 📞 Suporte

Se ainda tiver problemas:
1. Verifique se o arquivo existe: `Test-Path "C:\arduino-cli\arduino-cli.exe"`
2. Teste execução direta: `& "C:\arduino-cli\arduino-cli.exe" version`
3. Reinicie o computador
4. Verifique permissões da pasta

## ✅ Teste Final

Após instalação, o painel Arduino deve mostrar:
- ✅ **Arduino CLI Instalado**
- ✅ **Status: Pronto para compilar**
- ✅ **Localização: C:\arduino-cli\arduino-cli.exe**

Agora você pode usar o botão **"⚡ Upload Direto (Arduino CLI)"** para upload real! 🚀</content>
<parameter name="filePath">c:\Users\rodrigo.reis\Desktop\OdA\oda-blockskids\INSTALL_ARDUINO_CLI.md