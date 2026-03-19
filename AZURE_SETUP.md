# Setup no Azure para ODA Blocks Kids

## Pré-requisitos no Servidor Azure

### 1. Node.js 18+ instalado

```bash
node --version  # Verificar
```

### 2. Arduino CLI instalado

#### Windows (na máquina local, siga INSTALL_ARDUINO_CLI.md)
- Instala em `C:\Arduino-CLI`
- Configurado automaticamente

#### Linux (Azure App Service - Ubuntu)

```bash
# Baixar Arduino CLI
mkdir -p ~/.arduino15/bin
cd ~/.arduino15/bin
wget https://downloads.arduino.cc/arduino-cli/arduino-cli_latest_Linux_64bit.tar.gz
tar xzf arduino-cli_latest_Linux_64bit.tar.gz

# Tornar executável
chmod +x arduino-cli

# Adicionar ao PATH
export PATH="$HOME/.arduino15/bin:$PATH"

# Instalar core AVR
arduino-cli core update-index
arduino-cli core install arduino:avr
```

#### macOS (via Homebrew)

```bash
brew install arduino-cli
arduino-cli core update-index
arduino-cli core install arduino:avr
```

### 3. Variáveis de Ambiente (Recomendado)

Se Arduino CLI não estiver no PATH padrão, adicione ao `.env`:

```env
ARDUINO_CLI_PATH=/usr/local/bin/arduino-cli
# ou no Windows:
# ARDUINO_CLI_PATH=C:\Arduino-CLI\arduino-cli.exe
```

## Instalação em Azure App Service

### Opção 1: Manual (Recomendado para produção)

1. Conectar via SSH à App Service
2. Executar os comandos Linux acima
3. Testar: `which arduino-cli`

### Opção 2: Docker (Melhor Prática)

Crie um `Dockerfile`:

```dockerfile
FROM node:18-alpine

# Instalar dependencies necessárias
RUN apk add --no-cache \
    curl \
    wget \
    tar \
    gzip \
    python3 \
    make \
    g++

# Instalar Arduino CLI
RUN mkdir -p /arduino && cd /arduino && \
    wget https://downloads.arduino.cc/arduino-cli/arduino-cli_latest_Linux_64bit.tar.gz && \
    tar xzf arduino-cli_latest_Linux_64bit.tar.gz && \
    chmod +x arduino-cli && \
    ln -s /arduino/arduino-cli /usr/local/bin/arduino-cli

# Instalar Arduino cores
RUN arduino-cli core update-index && \
    arduino-cli core install arduino:avr

# Setup da aplicação
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000
CMD ["npm", "run", "start"]
```

## Tester Compilação

```bash
curl -X POST http://localhost:5000/api/compile \
  -H "Content-Type: application/json" \
  -d '{"code":"void setup(){pinMode(13,OUTPUT);} void loop(){digitalWrite(13,HIGH);delay(1000);digitalWrite(13,LOW);delay(1000);}"}'
```

## Possíveis Erros

### "arduino-cli not found"
- ✅ Solução: Instalar Arduino CLI no servidor

### "Core arduino:avr not installed"
- ✅ Solução: `arduino-cli core install arduino:avr`

### "Compilation timeout"
- ✅ Solução: Aumentar timeout em `routes.ts` (linha ~60)

## Variáveis importantes para produção

```env
NODE_ENV=production
PORT=5000
ARDUINO_CLI_PATH=/usr/local/bin/arduino-cli  # Ubuntu/Mac
# ARDUINO_CLI_PATH=C:\Arduino-CLI\arduino-cli.exe  # Windows Server
```
