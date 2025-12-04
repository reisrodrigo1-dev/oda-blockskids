@echo off
REM =============================================================================
REM DIAGNOSTICO DO SISTEMA BLOCKUINO
REM Verifica se tudo esta funcionando corretamente
REM =============================================================================

echo.
echo ================================================
echo      DIAGNOSTICO BLOCKUINO
echo ================================================
echo.
echo Este programa verifica se tudo esta funcionando.
echo.

REM Criar arquivo de diagnostico
echo [%DATE% %TIME%] === INICIANDO DIAGNOSTICO === > diagnostico.txt

echo Verificando componentes do sistema...
echo.

REM 1. Verificar Arduino CLI
echo ================================================ >> diagnostico.txt
echo 1. VERIFICANDO ARDUINO CLI >> diagnostico.txt
echo ================================================ >> diagnostico.txt

echo 1. Arduino CLI:
if exist "C:\arduino-cli\arduino-cli.exe" (
    echo ✅ Arquivo encontrado em C:\arduino-cli\arduino-cli.exe
    echo ✅ ARQUIVO: OK >> diagnostico.txt

    C:\arduino-cli\arduino-cli.exe version > temp_version.txt 2>&1
    set /p VERSION=<temp_version.txt
    echo ✅ Versao: %VERSION%
    echo ✅ VERSAO: %VERSION% >> diagnostico.txt
    del temp_version.txt >nul 2>&1
) else (
    echo ❌ Arduino CLI nao encontrado em C:\arduino-cli\arduino-cli.exe
    echo ❌ ARQUIVO: FALHA >> diagnostico.txt

    if exist "arduino-cli.exe" (
        echo ⚠️  Encontrado na pasta atual. Copie para C:\arduino-cli\
        echo ⚠️  ARQUIVO LOCAL: ENCONTRADO >> diagnostico.txt
    ) else (
        echo ❌ Nenhum Arduino CLI encontrado
        echo ❌ ARQUIVO LOCAL: FALHA >> diagnostico.txt
    )
)

echo.

REM 2. Verificar pastas do projeto
echo ================================================ >> diagnostico.txt
echo 2. VERIFICANDO PASTAS DO PROJETO >> diagnostico.txt
echo ================================================ >> diagnostico.txt

echo 2. Pastas do projeto:
if exist "arduino-extension" (
    echo ✅ Pasta arduino-extension encontrada
    echo ✅ EXTENSAO: OK >> diagnostico.txt

    if exist "arduino-extension\manifest.json" (
        echo ✅ Arquivo manifest.json encontrado
        echo ✅ MANIFEST: OK >> diagnostico.txt
    ) else (
        echo ❌ manifest.json nao encontrado
        echo ❌ MANIFEST: FALHA >> diagnostico.txt
    )
) else (
    echo ❌ Pasta arduino-extension nao encontrada
    echo ❌ EXTENSAO: FALHA >> diagnostico.txt
)

if exist "arduino-native-app" (
    echo ✅ Pasta arduino-native-app encontrada
    echo ✅ APP NATIVO: OK >> diagnostico.txt

    if exist "arduino-native-app\app.js" (
        echo ✅ Arquivo app.js encontrado
        echo ✅ APP.JS: OK >> diagnostico.txt
    ) else (
        echo ❌ app.js nao encontrado
        echo ❌ APP.JS: FALHA >> diagnostico.txt
    )
) else (
    echo ❌ Pasta arduino-native-app nao encontrada
    echo ❌ APP NATIVO: FALHA >> diagnostico.txt
)

echo.

REM 3. Verificar Arduino conectado
echo ================================================ >> diagnostico.txt
echo 3. VERIFICANDO ARDUINO CONECTADO >> diagnostico.txt
echo ================================================ >> diagnostico.txt

echo 3. Arduino conectado:
if exist "C:\arduino-cli\arduino-cli.exe" (
    echo Procurando Arduino...
    C:\arduino-cli\arduino-cli.exe board list > temp_boards.txt 2>&1

    findstr /C:"arduino:avr:uno" temp_boards.txt >nul
    if errorlevel 1 (
        echo ❌ Nenhum Arduino Uno detectado
        echo ❌ ARDUINO: NAO DETECTADO >> diagnostico.txt
        echo.
        echo SOLUCOES para Arduino nao detectado:
        echo - Conecte Arduino Uno via USB
        echo - Use cabo USB original
        echo - Tente outra porta USB
        echo - Feche Arduino IDE se estiver aberto
    ) else (
        echo ✅ Arduino Uno detectado!
        echo ✅ ARDUINO: DETECTADO >> diagnostico.txt
    )

    del temp_boards.txt >nul 2>&1
) else (
    echo ⚠️  Pule verificacao Arduino (Arduino CLI nao instalado)
    echo ⚠️  ARDUINO: NAO VERIFICADO >> diagnostico.txt
)

echo.

REM 4. Verificar servidor
echo ================================================ >> diagnostico.txt
echo 4. VERIFICANDO SERVIDOR >> diagnostico.txt
echo ================================================ >> diagnostico.txt

echo 4. Servidor local:
echo Verificando se porta 5000 esta livre...

netstat -an | findstr ":5000" >nul
if errorlevel 1 (
    echo ✅ Porta 5000 livre (servidor pode iniciar)
    echo ✅ PORTA 5000: LIVRE >> diagnostico.txt
) else (
    echo ⚠️  Porta 5000 ocupada (servidor pode nao iniciar)
    echo ⚠️  PORTA 5000: OCUPADA >> diagnostico.txt
)

echo.

REM 5. Verificar Node.js
echo ================================================ >> diagnostico.txt
echo 5. VERIFICANDO NODE.JS >> diagnostico.txt
echo ================================================ >> diagnostico.txt

echo 5. Node.js:
node --version > temp_node.txt 2>&1
set /p NODE_VERSION=<temp_node.txt
echo %NODE_VERSION% | findstr "v" >nul
if errorlevel 1 (
    echo ❌ Node.js nao encontrado
    echo ❌ NODE.JS: FALHA >> diagnostico.txt
    echo.
    echo SOLUCAO: Instale Node.js de https://nodejs.org
) else (
    echo ✅ Node.js encontrado: %NODE_VERSION%
    echo ✅ NODE.JS: %NODE_VERSION% >> diagnostico.txt
)

npm --version > temp_npm.txt 2>&1
set /p NPM_VERSION=<temp_npm.txt
echo %NPM_VERSION% | findstr "[0-9]" >nul
if errorlevel 1 (
    echo ❌ NPM nao encontrado
    echo ❌ NPM: FALHA >> diagnostico.txt
) else (
    echo ✅ NPM encontrado: %NPM_VERSION%
    echo ✅ NPM: %NPM_VERSION% >> diagnostico.txt
)

del temp_node.txt temp_npm.txt >nul 2>&1

echo.

REM 6. Verificar Chrome
echo ================================================ >> diagnostico.txt
echo 6. VERIFICANDO GOOGLE CHROME >> diagnostico.txt
echo ================================================ >> diagnostico.txt

echo 6. Google Chrome:
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    echo ✅ Chrome encontrado no local padrao
    echo ✅ CHROME: OK >> diagnostico.txt
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    echo ✅ Chrome encontrado (x86)
    echo ✅ CHROME: OK >> diagnostico.txt
) else (
    echo ❌ Chrome nao encontrado no local padrao
    echo ❌ CHROME: FALHA >> diagnostico.txt
    echo.
    echo NOTA: Chrome necessario para Web Serial API
)

echo.

REM Resumo final
echo ================================================ >> diagnostico.txt
echo RESUMO FINAL >> diagnostico.txt
echo ================================================ >> diagnostico.txt

echo.
echo ================================================
echo               RESUMO FINAL
echo ================================================
echo.
echo Arquivo de diagnostico criado: diagnostico.txt
echo.
echo Se tudo estiver OK, voce pode usar o sistema!
echo Se houver problemas, consulte o arquivo diagnostico.txt
echo ou o GUIA_IMPRESSO.md para solucoes.
echo.

echo [%DATE% %TIME%] === DIAGNOSTICO CONCLUIDO === >> diagnostico.txt

pause
exit /b 0