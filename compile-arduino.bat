@echo off
setlocal enabledelayedexpansion

REM Script para compilar código Arduino usando arduino-cli
REM Parâmetros: %1 = caminho do arquivo .ino, %2 = arquivo de saída (opcional)

if "%~1"=="" (
    echo Erro: Arquivo fonte não fornecido
    exit /b 1
)

set "SOURCE_FILE=%~1"
set "OUTPUT_FILE=%~2"
if "%OUTPUT_FILE%"=="" set "OUTPUT_FILE=temp.hex"

REM Verificar se arquivo fonte existe
if not exist "%SOURCE_FILE%" (
    echo Erro: Arquivo fonte não encontrado: %SOURCE_FILE%
    exit /b 1
)

REM Criar diretório temporário para a compilação
set "TEMP_DIR=%TEMP%\arduino_compile_%RANDOM%"
mkdir "%TEMP_DIR%" 2>nul

REM Copiar arquivo fonte para o diretório temporário
copy "%SOURCE_FILE%" "%TEMP_DIR%\sketch.ino" >nul

REM Compilar usando arduino-cli
cd /d "%~dp0"
.\arduino-cli.exe compile --fqbn arduino:avr:uno "%TEMP_DIR%" --output-dir "%TEMP_DIR%\build"

if %errorlevel% neq 0 (
    echo Erro na compilação
    rmdir /s /q "%TEMP_DIR%" 2>nul
    exit /b 1
)

REM Copiar arquivo hex gerado
for %%f in ("%TEMP_DIR%\build\*.hex") do (
    copy "%%f" "%OUTPUT_FILE%" >nul
    echo Compilação bem-sucedida: %OUTPUT_FILE%
    goto :success
)

echo Erro: Arquivo hex não encontrado
rmdir /s /q "%TEMP_DIR%" 2>nul
exit /b 1

:success
REM Limpar
rmdir /s /q "%TEMP_DIR%" 2>nul
exit /b 0