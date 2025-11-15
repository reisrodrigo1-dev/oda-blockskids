@echo off
REM =============================================================================
REM INSTALADOR AUTOMATICO DO BLOCKUINO ARDUINO SYSTEM
REM Versao: 2.0 - Para usuarios que nao dominam internet
REM Data: %DATE% %TIME%
REM =============================================================================

REM Criar log de instalacao
echo [%DATE% %TIME%] Iniciando instalacao > instalacao_log.txt

echo.
echo ================================================
echo    BLOCKUINO - INSTALADOR AUTOMATICO
echo ================================================
echo.
echo Este instalador vai configurar tudo automaticamente!
echo.
echo IMPORTANTE:
echo - Feche todos os outros programas
echo - Conecte seu Arduino UNO ao computador
echo - Execute este arquivo como ADMINISTRADOR
echo.
echo Pressione qualquer tecla para continuar...
pause >nul

echo [%DATE% %TIME%] Usuario confirmou inicio >> instalacao_log.txt

echo.
echo ================================================
echo PASSO 1: Verificando permissoes de administrador...
echo ================================================

net session >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Executando como administrador!
) else (
    echo ❌ ERRO: Execute como ADMINISTRADOR!
    echo.
    echo SOLUCAO:
    echo 1. Clique direito no arquivo
    echo 2. Escolha "Executar como administrador"
    echo.
    echo [%DATE% %TIME%] ERRO: Sem permissoes de administrador >> instalacao_log.txt
    pause
    exit /b 1
)

echo [%DATE% %TIME%] Permissoes de administrador OK >> instalacao_log.txt

echo.
echo ================================================
echo PASSO 1: Verificando conexao com internet...
echo ================================================

ping -n 1 google.com >nul 2>&1
if errorlevel 1 (
    echo ❌ ERRO: Sem conexao com internet!
    echo.
    echo SOLUCAO: Conecte-se a internet e tente novamente.
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Conexao com internet OK!
)

echo.
echo ================================================
echo PASSO 2: Criando pastas necessarias...
echo ================================================

if not exist "C:\arduino-cli" (
    mkdir "C:\arduino-cli" 2>nul
    if errorlevel 1 (
        echo ❌ ERRO: Nao foi possivel criar pasta C:\arduino-cli
        echo.
        echo SOLUCAO: Execute como ADMINISTRADOR
        echo.
        pause
        exit /b 1
    )
    echo ✅ Pasta C:\arduino-cli criada!
) else (
    echo ✅ Pasta C:\arduino-cli ja existe!
)

echo.
echo ================================================
echo PASSO 3: Baixando Arduino CLI...
echo ================================================

echo Baixando arduino-cli...
powershell -Command "try { Invoke-WebRequest -Uri 'https://downloads.arduino.cc/arduino-cli/arduino-cli_latest_Windows_64bit.zip' -OutFile 'arduino-cli.zip' -TimeoutSec 60; exit 0 } catch { exit 1 }" >nul 2>&1

if not exist "arduino-cli.zip" (
    echo ❌ ERRO: Falha no download do Arduino CLI!
    echo.
    echo SOLUCOES:
    echo 1. Verifique sua conexao com internet
    echo 2. Execute como ADMINISTRADOR
    echo 3. Desative antivirus temporariamente
    echo.
    pause
    exit /b 1
)

echo ✅ Download concluido!

echo.
echo ================================================
echo PASSO 4: Instalando Arduino CLI...
echo ================================================

echo Extraindo arquivos...
powershell -Command "Expand-Archive -Path 'arduino-cli.zip' -DestinationPath 'C:\arduino-cli' -Force" >nul 2>&1

if not exist "C:\arduino-cli\arduino-cli.exe" (
    echo ❌ ERRO: Falha na extracao!
    echo.
    pause
    exit /b 1
)

echo ✅ Arduino CLI instalado!

echo.
echo ================================================
echo PASSO 5: Configurando Arduino CLI...
echo ================================================

echo Inicializando configuracao...
"C:\arduino-cli\arduino-cli.exe" config init >nul 2>&1

echo Atualizando indice de placas...
"C:\arduino-cli\arduino-cli.exe" core update-index >nul 2>&1

echo Instalando suporte ao Arduino AVR...
"C:\arduino-cli\arduino-cli.exe" core install arduino:avr >nul 2>&1

echo.
echo ================================================
echo PASSO 6: Testando instalacao...
echo ================================================

echo Testando Arduino CLI...
"C:\arduino-cli\arduino-cli.exe" version > temp_version.txt 2>&1
set /p VERSION=<temp_version.txt
del temp_version.txt >nul 2>&1

echo %VERSION% | findstr "arduino-cli" >nul
if errorlevel 1 (
    echo ❌ ERRO: Arduino CLI nao esta funcionando!
    echo.
    echo SOLUCAO: Execute o instalador novamente como ADMINISTRADOR
    echo.
    pause
    exit /b 1
)

echo ✅ Arduino CLI funcionando! Versao: %VERSION%

echo.
echo ================================================
echo PASSO 7: Verificando Arduino conectado...
echo ================================================

echo Procurando Arduino...
"C:\arduino-cli\arduino-cli.exe" board list > temp_boards.txt 2>&1

findstr /C:"arduino:avr:uno" temp_boards.txt >nul
if errorlevel 1 (
    echo ⚠️  AVISO: Nenhum Arduino Uno detectado!
    echo.
    echo SOLUCOES:
    echo 1. Conecte seu Arduino Uno ao computador
    echo 2. Certifique-se de que esta usando cabo USB original
    echo 3. Tente outra porta USB
    echo.
    echo Pressione qualquer tecla para continuar mesmo assim...
    pause >nul
) else (
    echo ✅ Arduino Uno detectado!
)

del temp_boards.txt >nul 2>&1

echo.
echo ================================================
echo INSTALACAO CONCLUIDA COM SUCESSO! 🎉
echo ================================================
echo.
echo O que foi instalado:
echo ✅ Arduino CLI (compilador)
echo ✅ Suporte ao Arduino AVR
echo ✅ Configuracao basica
echo.
echo ================================================
echo PROXIMOS PASSOS MANUAIS:
echo ================================================
echo.
echo 1. INSTALAR EXTENSAO CHROME:
echo    - Abra Google Chrome
echo    - Digite na barra: chrome://extensions/
echo    - Ative "Modo do desenvolvedor" (canto superior direito)
echo    - Clique "Carregar extensao sem compactacao"
echo    - Selecione a pasta: arduino-extension
echo    - COPIE E GUARDE o ID da extensao
echo.
echo 2. INSTALAR APP NATIVO:
echo    - Abra Prompt de Comando como ADMINISTRADOR
echo    - Digite: cd arduino-native-app
echo    - Digite: npm install
echo    - Digite: node install-native.js
echo    - Cole o ID da extensao quando solicitado
echo.
echo 3. TESTAR SISTEMA:
echo    - Execute start_server.bat
echo    - Abra navegador em http://localhost:5000
echo    - Clique botao 🔧 (painel Arduino)
echo    - Deve mostrar verde ✅ em tudo
echo.
echo 4. USAR SISTEMA:
echo    - Crie programa com blocos
echo    - Conecte Arduino USB
echo    - Clique "🌐 Compilar Online + Upload Direto"
echo    - Permita acesso quando navegador pedir
echo    - Aguarde... PRONTO! 🎉
echo.
echo.
echo ================================================
echo ARQUIVOS IMPORTANTES CRIADOS:
echo ================================================
echo.
echo ✅ C:\arduino-cli\arduino-cli.exe (Arduino CLI)
echo ✅ instalacao_log.txt (Log desta instalacao)
echo ✅ GUIA_IMPRESSO.md (Guia completo passo-a-passo)
echo.
echo.
echo ================================================
echo SUPORTE TECNICO
echo ================================================
echo.
echo Se algo deu errado:
echo 1. Verifique instalacao_log.txt para erros
echo 2. Execute este instalador novamente
echo 3. Certifique-se de executar como ADMINISTRADOR
echo 4. Feche antivirus temporariamente
echo 5. Reinicie computador
echo 6. Consulte GUIA_IMPRESSO.md
echo.
echo [%DATE% %TIME%] Instalacao concluida com sucesso >> instalacao_log.txt
echo.
pause

REM Limpar arquivos temporarios
if exist "arduino-cli.zip" (
    del "arduino-cli.zip" >nul 2>&1
    echo [%DATE% %TIME%] Arquivo temporario arduino-cli.zip removido >> instalacao_log.txt
)

exit /b 0