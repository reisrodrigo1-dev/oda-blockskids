@echo off
echo 🚀 Iniciando servidor para upload Arduino...
echo.
echo Pressione qualquer tecla para começar...
pause >nul

echo [PASSO 1] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado.
    echo Baixando Node.js...
    powershell -command "try { Invoke-WebRequest -Uri 'https://nodejs.org/dist/v18.17.0/node-v18.17.0-x64.msi' -OutFile 'nodejs.msi'; echo 'Download OK' } catch { echo 'Erro no download'; exit 1 }"
    if not exist nodejs.msi (
        echo ❌ Falha no download do Node.js
        echo Pressione qualquer tecla para sair...
        pause >nul
        exit /b 1
    )
    echo Instalando Node.js (isso pode demorar)...
    msiexec /i nodejs.msi /quiet /norestart
    if %errorlevel% neq 0 (
        echo ❌ Falha na instalação do Node.js
        del nodejs.msi 2>nul
        echo Pressione qualquer tecla para sair...
        pause >nul
        exit /b 1
    )
    del nodejs.msi
    echo ✅ Node.js instalado!
) else (
    for /f "tokens=*" %%i in ('node --version') do echo ✅ Node.js encontrado: %%i
)
echo Pressione qualquer tecla para continuar...
pause >nul

echo.
echo [PASSO 2] Verificando Arduino CLI...
arduino-cli version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Arduino CLI não encontrado.
    echo Baixando Arduino CLI...
    powershell -command "try { Invoke-WebRequest -Uri 'https://downloads.arduino.cc/arduino-cli/arduino-cli_latest_Windows_64bit.zip' -OutFile 'arduino-cli.zip'; echo 'Download OK' } catch { echo 'Erro no download'; exit 1 }"
    if not exist arduino-cli.zip (
        echo ❌ Falha no download do Arduino CLI
        echo Pressione qualquer tecla para sair...
        pause >nul
        exit /b 1
    )
    echo Extraindo Arduino CLI...
    powershell -command "Expand-Archive -Path 'arduino-cli.zip' -DestinationPath '.' -Force"
    if exist arduino-cli.exe (
        echo ✅ Arduino CLI extraído!
    ) else (
        move arduino-cli.exe arduino-cli.exe 2>nul
        if not exist arduino-cli.exe (
            echo ❌ Falha na extração do Arduino CLI
            del arduino-cli.zip 2>nul
            echo Pressione qualquer tecla para sair...
            pause >nul
            exit /b 1
        )
    )
    del arduino-cli.zip
    echo ✅ Arduino CLI instalado!
) else (
    for /f "tokens=*" %%i in ('arduino-cli version') do echo ✅ Arduino CLI encontrado: %%i
)
echo Pressione qualquer tecla para continuar...
pause >nul

echo.
echo [PASSO 3] Criando servidor...
(
echo const express = require('express'^);
echo const cors = require('cors'^);
echo const { exec } = require('child_process'^);
echo const fs = require('fs'^);
echo const app = express(^);
echo app.use(cors(^)^);
echo app.use(express.json(^)^);
echo app.post('/upload', (req, res^) => {
echo   console.log('Recebendo upload...'^);
echo   const { code } = req.body;
echo   try {
echo     fs.writeFileSync('sketch.ino', code^);
echo     console.log('Arquivo criado'^);
echo     exec('arduino-cli compile --fqbn arduino:avr:uno sketch.ino', (err, stdout, stderr^) => {
echo       if (err^) {
echo         console.log('Erro na compilação:', stderr^);
echo         res.send('Erro na compilação: ' + stderr^);
echo         return;
echo       }
echo       console.log('Compilação OK'^);
echo       exec('arduino-cli upload -p COM3 --fqbn arduino:avr:uno sketch.ino', (err2, stdout2, stderr2^) => {
echo         fs.unlinkSync('sketch.ino'^);
echo         if (err2^) {
echo           console.log('Erro no upload:', stderr2^);
echo           res.send('Erro no upload: ' + stderr2^);
echo         } else {
echo           console.log('Upload OK'^);
echo           res.send('Sucesso! Código enviado ao Arduino.'^);
echo         }
echo       }^);
echo     }^);
echo   } catch (e^) {
echo     res.send('Erro interno: ' + e.message^);
echo   }
echo }^);
echo app.listen(3001, (^) => {
echo   console.log('🚀 Servidor rodando em http://localhost:3001'^);
echo   console.log('Aguardando conexões...'^);
echo }^);
echo }^);
) > server.js

if not exist server.js (
    echo ❌ Falha ao criar server.js
    echo Pressione qualquer tecla para sair...
    pause >nul
    exit /b 1
)
echo ✅ Servidor criado.
type server.js
echo Pressione qualquer tecla para continuar...
pause >nul

echo.
echo [PASSO 4] Instalando dependências...
call npm install express cors
if %errorlevel% neq 0 (
    echo ❌ Falha ao instalar dependências
    echo Pressione qualquer tecla para sair...
    pause >nul
    exit /b 1
)
echo ✅ Dependências instaladas.

echo.
echo [PASSO 5] Iniciando servidor...
echo 🚀 Servidor será iniciado agora!
echo.
echo IMPORTANTE:
echo - O servidor ficará rodando nesta janela
echo - Não feche esta janela
echo - Volte ao navegador e clique "Iniciar e Upload"
echo - Para parar, pressione Ctrl+C nesta janela
echo.
echo Pressione qualquer tecla para iniciar o servidor...
pause >nul

node server.js