# 🚀 Deploy do Servidor Arduino Compiler

## Configuração do Frontend

Após fazer o deploy do servidor, você precisa configurar o frontend para usar a URL correta da API.

### 1. Configurar variável de ambiente

Crie ou edite o arquivo `.env` na pasta `client/`:

```bash
# Para desenvolvimento local
VITE_API_URL=http://localhost:5000

# Para produção no Railway
VITE_API_URL=https://seu-projeto-railway.up.railway.app

# Para produção no Render
VITE_API_URL=https://seu-app-arduino.onrender.com

# Para produção no VPS
VITE_API_URL=https://seu-dominio.com
```

### 2. Rebuild do frontend

```bash
cd client
npm run build
```

### 3. Deploy do frontend

Faça o deploy normalmente no Vercel, Netlify, etc.

---

# Deploy no Railway (recomendado)

## 1. Criar conta no Railway
- Acesse: https://railway.app
- Conecte com GitHub

## 2. Deploy do servidor
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Criar novo projeto
railway init arduino-compiler

# Deploy
railway up
```

## 3. Configurar domínio (opcional)
```bash
railway domain
```

## 4. Atualizar frontend
No seu código frontend, mude a URL da API:
```javascript
const API_URL = 'https://seu-projeto-railway.up.railway.app';
```

# Alternativa: Render

## 1. Criar conta no Render
- Acesse: https://render.com
- Conecte com GitHub

## 2. Criar Web Service
- New → Web Service
- Conectar repositório
- Runtime: Node
- Build Command: `npm install`
- Start Command: `npm start`

## 3. Configurar variáveis de ambiente (opcional)
- Adicionar PORT=10000

# Alternativa: VPS (DigitalOcean, Linode, etc.)

## 1. Instalar Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## 2. Instalar PM2
```bash
sudo npm install -g pm2
```

## 3. Deploy
```bash
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo
npm install
pm2 start arduino-server.js --name arduino-compiler
pm2 startup
pm2 save
```

## 4. Configurar Nginx (opcional)
```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

# Teste local

```bash
# Instalar dependências
npm install express cors

# Instalar Arduino CLI (Linux/Mac)
curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh

# Executar servidor
node arduino-server.js

# Testar
curl -X POST http://localhost:3001/compile \
  -H "Content-Type: application/json" \
  -d '{"code":"void setup() { pinMode(13, OUTPUT); } void loop() { digitalWrite(13, HIGH); delay(1000); digitalWrite(13, LOW); delay(1000); }","boardType":"arduino:avr:uno"}'
```