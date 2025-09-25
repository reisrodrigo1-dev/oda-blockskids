@echo off
REM Batch file para abrir Arduino IDE com configurações pré-definidas
REM Gerado pelo BlockuinoEditor

REM Nome do arquivo e pasta
set sketchName=blockuino_sketch_2025-08-28T09-46-01

REM Criar pasta para o sketch
if not exist "%~dp0%sketchName%" mkdir "%~dp0%sketchName%"

REM Mover arquivo .ino para a pasta
move "%~dp0%sketchName%.ino" "%~dp0%sketchName%" >nul 2>&1

REM Verificar se o Arduino IDE está instalado
set ARDUINO_PATH="C:\Program Files\Arduino\arduino.exe"
if not exist %ARDUINO_PATH% (
    echo ❌ Arduino IDE não encontrado no caminho padrão.
    pause
    exit /b 1
)

REM Abrir Arduino IDE com o arquivo .ino
start "" %ARDUINO_PATH% "%~dp0%sketchName%\%sketchName%.ino"
pause
