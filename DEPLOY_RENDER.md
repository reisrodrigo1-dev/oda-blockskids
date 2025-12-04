# 🚀 Deploy na Render - Guia Completo (Firebase)

## 📋 Pré-requisitos

1. **Conta na Render** (gratuita): [render.com](https://render.com)
2. **Projeto Firebase** já configurado (você já tem!)
3. **Repositório no GitHub** com seu código

## � Seu Firebase já está configurado!

Seu projeto já usa **Firebase** para:
- ✅ **Autenticação** (login/logout)
- ✅ **Firestore** (dados do usuário)
- ✅ **Storage** (uploads de arquivos)
- ✅ **MemStorage** (projetos Arduino - armazenamento temporário)

**Não precisa configurar banco adicional!**

## 🌐 Passo 2: Deploy na Render

### Opção A: Deploy Automático (Recomendado)

1. **Fork este repositório** no seu GitHub
2. **Acesse [render.com](https://render.com)**
3. Clique **"New +"** → **"Web Service"**
4. Conecte sua conta do **GitHub**
5. Selecione o repositório **oda-blockskids**
6. Configure o serviço:

#### Configurações Básicas:
- **Name**: `oda-blockskids` (ou nome que preferir)
- **Runtime**: `Node`
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

#### Variáveis de Ambiente (Environment Variables):
```
NODE_ENV=production
PORT=10000
SESSION_SECRET=[gere-uma-chave-segura]
ARDUINO_CLI_VERSION=0.37.0
```
**Nota:** Firebase já está configurado no código, não precisa de DATABASE_URL!

#### Configurações Avançadas:
- **Instance Type**: `Starter` (gratuito)
- **Region**: `Frankfurt` (EU) ou `Oregon` (US-West)
- **Health Check Path**: `/api/health`

7. Clique **"Create Web Service"**
8. Aguarde o deploy (5-10 minutos)

### Opção B: Usando render.yaml

1. **Commit o arquivo `render.yaml`** neste repositório
2. No Render Dashboard, clique **"New +"** → **"Blueprint"**
3. Conecte seu repositório GitHub
4. Render detectará automaticamente o `render.yaml`
5. Configure apenas a `DATABASE_URL` no dashboard

## 🌍 Passo 3: Configurar Domínio (Opcional)

1. No Render Dashboard, vá para seu serviço
2. Aba **"Settings"** → **"Custom Domain"**
3. Adicione seu domínio personalizado
4. Configure os registros DNS conforme instruído

## 🔍 Passo 4: Verificar Deploy

1. Acesse a URL do seu serviço Render
2. Teste a aplicação Blockly
3. Verifique se a compilação Arduino funciona

### URLs Importantes:
- **Aplicação**: `https://[seu-serviço].onrender.com`
- **API Health**: `https://[seu-serviço].onrender.com/api/health`
- **Compilação**: `https://[seu-serviço].onrender.com/api/compile`

## 🐛 Troubleshooting

### Erro: "arduino-cli not found"
- Verifique se `ARDUINO_CLI_VERSION=0.37.0` está configurado
- Render instala automaticamente durante o build

### Erro: "Database connection failed"
- Firebase já está configurado no código
- Verifique se as credenciais do Firebase estão corretas no código

### Erro: "Build timeout"
- Builds podem demorar 5-10 minutos na primeira vez
- Render tem timeout de 15 minutos para builds

### Erro: "Port already in use"
- Render usa automaticamente a porta da variável `PORT`
- Não mude a configuração de porta

## 💰 Custos

### Plano Gratuito (Starter):
- **500 horas/mês** de uptime
- **750 horas build** /mês
- **Auto-sleep** após 15 minutos de inatividade

### Upgrade para Paid ($7/mês):
- **Uptime 24/7** (sempre ligado)
- **Mais recursos** (CPU/RAM)
- **Sem auto-sleep**

## 🔄 Atualizações

1. **Push para GitHub** → Render detecta automaticamente
2. **Deploy automático** em 2-5 minutos
3. **Rollback** possível se algo der errado

## 📞 Suporte

- **Render Docs**: [docs.render.com](https://docs.render.com)
- **Firebase Docs**: [firebase.google.com/docs](https://firebase.google.com/docs)
- **GitHub Issues**: Para bugs específicos

---

## 🎉 Pronto!

Sua aplicação Blockly + Arduino + Firebase estará rodando na nuvem! 🚀

**Próximos passos:**
1. Teste a compilação Arduino
2. Configure WebSerial no frontend
3. Adicione seu domínio personalizado