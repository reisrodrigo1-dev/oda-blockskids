# ============================================
# ODA BlocksKids - Development Startup Script
# ============================================

Write-Host "`n🚀 Iniciando ODA BlocksKids...`n" -ForegroundColor Cyan

# Verificar Node.js
Write-Host "📋 Verificando requisitos..." -ForegroundColor Yellow
$nodeVersion = node --version
$npmVersion = npm --version
Write-Host "  ✓ Node.js $nodeVersion" -ForegroundColor Green
Write-Host "  ✓ npm $npmVersion`n" -ForegroundColor Green

# Verificar .env
if (-not (Test-Path '.env')) {
    Write-Host "⚠️  Arquivo .env não encontrado!" -ForegroundColor Red
    Write-Host "   Copie .env.example para .env e configure as variáveis`n" -ForegroundColor Yellow
    exit 1
}

# Instalar dependências se necessário
Write-Host "📦 Verificando dependências..." -ForegroundColor Yellow

if (-not (Test-Path 'node_modules')) {
    Write-Host "  Instalando dependências root..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao instalar dependências root" -ForegroundColor Red
        exit 1
    }
}

if (-not (Test-Path 'client/node_modules')) {
    Write-Host "  Instalando dependências client..." -ForegroundColor Yellow
    Microsoft.PowerShell.Management\Set-Location -Path client
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao instalar dependências client" -ForegroundColor Red
        exit 1
    }
    Microsoft.PowerShell.Management\Set-Location -Path ..
}

Write-Host "  ✓ Dependências OK`n" -ForegroundColor Green

# Iniciar servidor e cliente em paralelo
Write-Host "🔥 Iniciando servidor e cliente...`n" -ForegroundColor Cyan

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host "Backend: http://localhost:5000" -ForegroundColor Blue
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Blue
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Blue

# Iniciar servidor backend em background
Write-Host "Starting Backend..." -ForegroundColor Green
$backendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", `
    "Microsoft.PowerShell.Management\Set-Location -Path '$PWD'; `$env:NODE_ENV='development'; npm run dev" `
    -PassThru -NoNewWindow

# Aguardar um pouco para o servidor iniciar
Start-Sleep -Seconds 3

# Iniciar frontend
Write-Host "Starting Frontend..." -ForegroundColor Green
Microsoft.PowerShell.Management\Set-Location -Path client
npm run dev

# Se frontend fechar, encerrar ambos
Write-Host "`n🛑 Frontend encerrado. Encerrando backend..." -ForegroundColor Yellow
Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue

Write-Host "✅ Sistema encerrado`n" -ForegroundColor Green
