import { useState, useEffect } from "react";
import HeaderOffline from "@/components/HeaderOffline";
import BlockPalette from "@/components/BlockPalette";
import WorkspaceArea from "@/components/WorkspaceArea";
import CodePanel from "@/components/CodePanel";
import ArduinoPanel from "@/components/ArduinoPanel";
import TutorialModal from "@/components/TutorialModal";
import { LocalStorage, Project } from "@/lib/local-storage";
import { uploadToArduino } from "@/lib/web-serial-stk500";

export default function EditorOffline() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showArduinoPanel, setShowArduinoPanel] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [savedProjects, setSavedProjects] = useState<Project[]>([]);

  // Detectar se estamos rodando localmente ou online
  const isLocalEnvironment = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1' ||
     window.location.hostname.includes('oda-blockskids'));

  const [generatedCode, setGeneratedCode] = useState(`// Código Arduino gerado pelos blocos\n// 🎨 Criado com Arduino Blocks Kids\n\nvoid setup() {\n  // Configurar pinos\n  pinMode(13, OUTPUT);  // LED no pino 13\n}\n\nvoid loop() {\n  // Seu código aparecerá aqui quando você\n  // arrastar os blocos para o workspace!\n  \n  // Exemplo: Piscar LED\n  digitalWrite(13, HIGH);   // Acender LED\n  delay(1000);              // Esperar 1 segundo\n  digitalWrite(13, LOW);    // Apagar LED\n  delay(1000);              // Esperar 1 segundo\n}`);

  // Estado para upload
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Estado para portas Arduino
  const [availablePorts, setAvailablePorts] = useState<any[]>([]);
  const [selectedPort, setSelectedPort] = useState<any>(null);
  const [isScanningPorts, setIsScanningPorts] = useState(false);

  // Carregar projetos salvos e projeto atual
  useEffect(() => {
    const projects = LocalStorage.getAllProjects();
    setSavedProjects(projects);
    
    const current = LocalStorage.getCurrentProject();
    if (current) {
      setCurrentProject(current);
      setGeneratedCode(current.code);
    }
  }, []);

  // Auto-salvar projeto atual
  useEffect(() => {
    if (currentProject) {
      const updated = LocalStorage.updateProject(currentProject.id, {
        code: generatedCode,
        blocks: {} // Aqui você pode salvar o estado dos blocos se necessário
      });
      if (updated) {
        setCurrentProject(updated);
      }
    }
  }, [generatedCode]);

  const saveNewProject = (name: string, description?: string) => {
    const project = LocalStorage.saveProject({
      name,
      description,
      blocks: {}, // Estado dos blocos
      code: generatedCode
    });
    
    setCurrentProject(project);
    LocalStorage.setCurrentProject(project);
    setSavedProjects(LocalStorage.getAllProjects());
  };

  const loadProject = (project: Project) => {
    setCurrentProject(project);
    setGeneratedCode(project.code);
    LocalStorage.setCurrentProject(project);
  };

  const deleteProject = (projectId: string) => {
    if (LocalStorage.deleteProject(projectId)) {
      setSavedProjects(LocalStorage.getAllProjects());
      if (currentProject?.id === projectId) {
        setCurrentProject(null);
        LocalStorage.clearCurrentProject();
      }
    }
  };

  const createNewProject = () => {
    setCurrentProject(null);
    LocalStorage.clearCurrentProject();
    setGeneratedCode(`// Código Arduino gerado pelos blocos\n// 🎨 Criado com Arduino Blocks Kids\n\nvoid setup() {\n  // Configurar pinos\n  pinMode(13, OUTPUT);  // LED no pino 13\n}\n\nvoid loop() {\n  // Seu código aparecerá aqui quando você\n  // arrastar os blocos para o workspace!\n  \n  // Exemplo: Piscar LED\n  digitalWrite(13, HIGH);   // Acender LED\n  delay(1000);              // Esperar 1 segundo\n  digitalWrite(13, LOW);    // Apagar LED\n  delay(1000);              // Esperar 1 segundo\n}`);
  };

  // Função para escanear portas disponíveis
  const scanPorts = async () => {
    if (!('serial' in navigator)) {
      alert('❌ Web Serial API não é suportada neste navegador. Use Chrome ou Edge.');
      return;
    }

    setIsScanningPorts(true);
    try {
      console.log('🔍 Escaneando portas Arduino...');

      // Solicitar acesso a uma porta (isso abre o seletor do navegador)
      const port = await (navigator as any).serial.requestPort();

      if (port) {
        setSelectedPort(port);
        setAvailablePorts([port]);

        // Tentar obter informações da porta
        try {
          const info = await port.getInfo();
          console.log('📡 Porta selecionada:', info);
        } catch (e) {
          console.log('ℹ️ Porta selecionada (info não disponível)');
        }

        alert('✅ Porta Arduino selecionada com sucesso!');
      }
    } catch (error) {
      console.error('❌ Erro ao escanear portas:', error);
      if (error instanceof Error && error.name !== 'NotFoundError') {
        alert(`❌ Erro ao acessar porta serial: ${error.message}`);
      }
    } finally {
      setIsScanningPorts(false);
    }
  };

  const compileAndUpload = async () => {
    if (!selectedPort) {
      alert('❌ Selecione uma porta Arduino primeiro! Clique em "Escanear Portas" para escolher sua placa.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Passo 1: Validação básica do código
      setUploadProgress(10);
      console.log('🔧 Iniciando compilação...');

      if (!generatedCode.includes('void setup()') || !generatedCode.includes('void loop()')) {
        throw new Error('Código Arduino inválido: deve conter void setup() e void loop()');
      }

      setUploadProgress(30);
      console.log('✅ Validação do código OK');

      // Passo 2: Compilar código no servidor
      setUploadProgress(50);
      console.log('⚙️ Compilando código...');
      console.log('📝 Código a ser compilado:', generatedCode);

      const apiUrl = (import.meta.env.VITE_API_URL || '').trim();
      const compileEndpoint = `${apiUrl}/api/compile`;
      const cliStatusEndpoint = `${apiUrl}/api/check-arduino-cli`;
      console.log('🌐 Usando API URL:', apiUrl || '(mesmo dominio)');

      // Verificação de saúde do compilador no backend (útil em produção/Azure)
      try {
        const cliStatusResponse = await fetch(cliStatusEndpoint);
        if (!cliStatusResponse.ok) {
          console.warn('⚠️ Arduino CLI indisponível no backend. Pode ocorrer fallback de compilação.');
        }
      } catch {
        console.warn('⚠️ Não foi possível verificar status do Arduino CLI. Seguindo para compilação.');
      }

      let compileResult;
      try {
        const compileResponse = await fetch(compileEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: generatedCode,
            boardType: 'arduino:avr:uno'
          })
        });

        compileResult = await compileResponse.json();
      } catch (fetchError) {
        console.error('❌ Erro na chamada da API:', fetchError);
        throw new Error(`Não foi possível conectar ao servidor em ${apiUrl || 'mesmo dominio'}. Verifique se está rodando.`);
      }

      if (!compileResult.success) {
        throw new Error(`Erro na compilação: ${compileResult.message}\n${compileResult.error || ''}`);
      }

      const hexContent = compileResult.hex;
      console.log('📦 Arquivo HEX gerado com sucesso');
      console.log(`📊 Tamanho do HEX: ${hexContent.length} caracteres`);

      // Se backend retornar HEX de teste, confirmar com o usuário antes de gravar na placa.
      if (typeof compileResult.message === 'string' && compileResult.message.includes('HEX de teste')) {
        const shouldContinue = confirm(`⚠️ O servidor retornou HEX de teste (sem compilação real).\n\n${compileResult.message}\n\nDeseja continuar mesmo assim?`);
        if (!shouldContinue) {
          console.warn('⚠️ Upload cancelado: compilação real indisponível no servidor.');
          return;
        }
      }

      setUploadProgress(70);

      // Passo 3: Upload direto via Web Serial + STK500
      setUploadProgress(80);
      console.log('🚀 Fazendo upload para Arduino com STK500...');

      try {
        // Upload real via Web Serial + STK500
        await uploadToArduino(selectedPort, hexContent, {
          board: 'uno',
          onProgress: (progress, message) => {
            setUploadProgress(Math.min(99, 80 + Math.floor(progress / 5))); // Map to 80-99
            console.log(`📊 ${message}`);
          },
          onLog: console.log
        });

        setUploadProgress(100);
        console.log('✅ Upload concluído com sucesso!');
        alert('🎉 Código enviado para Arduino com sucesso! O LED deve começar a piscar em 2 segundos.');

      } catch (uploadError) {
        console.error('❌ Erro no upload STK500:', uploadError);
        
        const shouldTryIDE = confirm(`❌ Erro no upload: ${(uploadError as Error).message}

💡 Alternativa: Seu Arduino pode ter bootloader incompatível ou conexão instável.

Deseja abrir no Arduino IDE para upload manual?`);
        
        if (shouldTryIDE) {
          openInArduinoIDE();
        }
        throw uploadError;
      }

    } catch (error) {
      console.error('❌ Erro geral:', error);

      alert(`❌ Erro: ${(error as Error).message}

Tente:
1. Reconectar o Arduino USB
2. Usar o botão "🖥️ IDE" para upload manual
3. Verificar drivers do CH340 se estiver usando clone`);

    } finally {
      setIsUploading(false);
      setUploadProgress(0);

      // Garantir que a porta seja fechada
      try {
        if (selectedPort && selectedPort.readable) {
          await selectedPort.close();
          console.log('🔌 Porta serial fechada');
        }
      } catch (e) {
        console.log('⚠️ Erro ao fechar porta:', e);
      }
    }
  };

  // Nova função: Abrir diretamente no Arduino IDE
  const openInArduinoIDE = () => {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const sketchContent = `/*
 * Sketch gerado pelo BlockuinoEditor - Editor Offline
 * Data/Hora: ${timestamp}
 * Projeto: ${currentProject?.name || 'Sem título'}
 *
 * ⚙️ CONFIGURAÇÕES PRÉ-DEFINIDAS:
 * - Placa: Arduino Uno
 * - Porta: Será detectada automaticamente
 *
 * INSTRUÇÕES PARA UPLOAD:
 * 1. Este arquivo já está pronto para upload
 * 2. Conecte seu Arduino via USB
 * 3. Verifique se a placa e porta estão corretas
 * 4. Clique em Upload (→) no Arduino IDE
 */

${generatedCode}

/*
 * NOTAS:
 * - Código gerado automaticamente pelos blocos no Editor Offline
 * - Configurações otimizadas para Arduino Uno
 * - Verifique se todas as bibliotecas necessárias estão instaladas
 */
`;

    // Criar arquivo .ino
    const inoBlob = new Blob([sketchContent], { type: 'text/plain' });
    const inoUrl = URL.createObjectURL(inoBlob);
    const inoLink = document.createElement('a');
    inoLink.href = inoUrl;
    inoLink.download = `blockuino_sketch_${timestamp}.ino`;
    document.body.appendChild(inoLink);
    inoLink.click();
    document.body.removeChild(inoLink);
    URL.revokeObjectURL(inoUrl);

    // Criar arquivo .bat para abrir Arduino IDE com configurações
    const batchContent = `@echo off
REM Batch file para abrir Arduino IDE com configurações pré-definidas
REM Gerado pelo BlockuinoEditor - Editor Offline em ${timestamp}
REM Projeto: ${currentProject?.name || 'Sem título'}
REM Configurações: Arduino Uno na porta COM3

echo 🔧 Abrindo Arduino IDE com configurações pré-definidas...
echo 📁 Projeto: ${currentProject?.name || 'Sem título'}
echo 📄 Arquivo: blockuino_sketch_${timestamp}.ino
echo ⚙️ Configurações: Arduino Uno - Porta COM3
echo.

REM Verificar se porta COM3 está disponível
echo 📡 Verificando porta COM3...
powershell -command "Get-WmiObject Win32_SerialPort | Where-Object {$_.DeviceID -eq 'COM3'} | Select-Object DeviceID,Description" > temp_com3.txt 2>nul
if exist temp_com3.txt (
    findstr /C:"COM3" temp_com3.txt >nul
    if %errorlevel%==0 (
        echo ✅ Porta COM3 encontrada e disponível
        for /f "tokens=*" %%i in (temp_com3.txt) do echo    Descrição: %%i
    ) else (
        echo ⚠️ Porta COM3 não encontrada - verifique se o Arduino está conectado
        echo 💡 Dicas:
        echo    • Conecte o Arduino Uno na porta USB
        echo    • Desconecte e reconecte se necessário
        echo    • Verifique se outro programa está usando a porta
    )
) else (
    echo ⚠️ Não foi possível verificar porta COM3
    echo 💡 Continuando mesmo assim...
)
if exist temp_com3.txt del temp_com3.txt

REM Tentar múltiplos caminhos do Arduino IDE
set ARDUINO_PATH=""

REM Caminhos mais comuns
if exist "C:\\Program Files\\Arduino\\arduino.exe" (
    set ARDUINO_PATH="C:\\Program Files\\Arduino\\arduino.exe"
    goto :found_arduino
)
if exist "C:\\Program Files (x86)\\Arduino\\arduino.exe" (
    set ARDUINO_PATH="C:\\Program Files (x86)\\Arduino\\arduino.exe"
    goto :found_arduino
)
if exist "%USERPROFILE%\\AppData\\Local\\Arduino15\\arduino.exe" (
    set ARDUINO_PATH="%USERPROFILE%\\AppData\\Local\\Arduino15\\arduino.exe"
    goto :found_arduino
)
if exist "C:\\Program Files\\Arduino IDE\\arduino.exe" (
    set ARDUINO_PATH="C:\\Program Files\\Arduino IDE\\arduino.exe"
    goto :found_arduino
)
if exist "C:\\Program Files (x86)\\Arduino IDE\\arduino.exe" (
    set ARDUINO_PATH="C:\\Program Files (x86)\\Arduino IDE\\arduino.exe"
    goto :found_arduino
)

REM Procurar Arduino IDE no registro do Windows
for /f "tokens=2*" %%a in ('reg query "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall" /s /f "Arduino" /d 2^>nul ^| find "InstallLocation"') do (
    if exist "%%b\\arduino.exe" (
        set ARDUINO_PATH="%%b\\arduino.exe"
        goto :found_arduino
    )
)

REM Procurar na variável PATH
where arduino.exe >nul 2>&1
if %errorlevel%==0 (
    for /f "delims=" %%i in ('where arduino.exe') do (
        set ARDUINO_PATH="%%i"
        goto :found_arduino
    )
)

REM Se não encontrou, tentar abrir manualmente
echo ❌ Arduino IDE não encontrado automaticamente.
echo 🔍 Tentando abrir o arquivo .ino diretamente...
start "" "%~dp0blockuino_sketch_${timestamp}.ino"
echo.
echo 📝 Instruções manuais:
echo 1. O arquivo .ino foi aberto no editor padrão
echo 2. Abra o Arduino IDE manualmente
echo 3. No Arduino IDE: File ^> Open ^> Selecione o arquivo blockuino_sketch_${timestamp}.ino
echo 4. Configure: Tools ^> Board ^> Arduino Uno
echo 5. Configure: Tools ^> Port ^> COM3
echo 6. Clique em Upload (→)
echo.
pause
exit /b 1

:found_arduino

echo ✅ Arduino IDE encontrado: %ARDUINO_PATH%
echo 🚀 Abrindo arquivo com configurações Arduino Uno + COM3...

REM Verificar se há conflitos de processos
echo 🔍 Verificando conflitos de processos...
tasklist /fi "imagename eq arduino.exe" /nh 2>nul | find /i "arduino.exe" >nul 2>nul
if %errorlevel%==0 (
    echo ⚠️ Arduino IDE já está rodando - será usado a instância existente
) else (
    echo ✅ Nenhum conflito de processo detectado
)

REM Verificar permissões do arquivo
if exist "%~dp0blockuino_sketch_${timestamp}.ino" (
    echo ✅ Arquivo .ino criado com sucesso
) else (
    echo ❌ Erro: Arquivo .ino não foi encontrado
    echo 🔄 Recriando arquivo...
    echo // Código Arduino gerado pelo BlockuinoEditor - Editor Offline > "%~dp0blockuino_sketch_${timestamp}.ino"
    echo // Data/Hora: ${timestamp} >> "%~dp0blockuino_sketch_${timestamp}.ino"
    echo // Projeto: ${currentProject?.name || 'Sem título'} >> "%~dp0blockuino_sketch_${timestamp}.ino"
    echo. >> "%~dp0blockuino_sketch_${timestamp}.ino"
    echo ${generatedCode} >> "%~dp0blockuino_sketch_${timestamp}.ino"
)

REM Criar arquivo de preferências para Arduino Uno e porta COM3
if not exist "%USERPROFILE%\\AppData\\Local\\Arduino15" mkdir "%USERPROFILE%\\AppData\\Local\\Arduino15"

REM Fazer backup das configurações existentes
if exist "%USERPROFILE%\\AppData\\Local\\Arduino15\\preferences.txt" (
    copy "%USERPROFILE%\\AppData\\Local\\Arduino15\\preferences.txt" "%USERPROFILE%\\AppData\\Local\\Arduino15\\preferences_backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%.txt" >nul 2>nul
    echo 📁 Backup das configurações criado
)

REM Aplicar configurações no diretório do usuário (mais confiável)
echo board=arduino:avr:uno > "%USERPROFILE%\\AppData\\Local\\Arduino15\\preferences.txt"
echo serial.port=COM3 >> "%USERPROFILE%\\AppData\\Local\\Arduino15\\preferences.txt"
echo serial.port.file=COM3 >> "%USERPROFILE%\\AppData\\Local\\Arduino15\\preferences.txt"
echo sketchbook.path=%~dp0 >> "%USERPROFILE%\\AppData\\Local\\Arduino15\\preferences.txt"
echo editor.antialias=true >> "%USERPROFILE%\\AppData\\Local\\Arduino15\\preferences.txt"
echo editor.font=Monospaced,plain,12 >> "%USERPROFILE%\\AppData\\Local\\Arduino15\\preferences.txt"
echo update.check=false >> "%USERPROFILE%\\AppData\\Local\\Arduino15\\preferences.txt"
echo last.sketch.path=%~dp0blockuino_sketch_${timestamp}.ino >> "%USERPROFILE%\\AppData\\Local\\Arduino15\\preferences.txt"
echo last.sketch.name=blockuino_sketch_${timestamp} >> "%USERPROFILE%\\AppData\\Local\\Arduino15\\preferences.txt"

REM Tentar também nos diretórios de instalação do Arduino
if exist "C:\\Program Files\\Arduino" (
    if not exist "C:\\Program Files\\Arduino\\lib" mkdir "C:\\Program Files\\Arduino\\lib" 2>nul
    echo board=arduino:avr:uno > "C:\\Program Files\\Arduino\\lib\\preferences.txt" 2>nul
    echo serial.port=COM3 >> "C:\\Program Files\\Arduino\\lib\\preferences.txt" 2>nul
    echo serial.port.file=COM3 >> "C:\\Program Files\\Arduino\\lib\\preferences.txt" 2>nul
    echo sketchbook.path=%~dp0 >> "C:\\Program Files\\Arduino\\lib\\preferences.txt" 2>nul
)
if exist "C:\\Program Files (x86)\\Arduino" (
    if not exist "C:\\Program Files (x86)\\Arduino\\lib" mkdir "C:\\Program Files (x86)\\Arduino\\lib" 2>nul
    echo board=arduino:avr:uno > "C:\\Program Files (x86)\\Arduino\\lib\\preferences.txt" 2>nul
    echo serial.port=COM3 >> "C:\\Program Files (x86)\\Arduino\\lib\\preferences.txt" 2>nul
    echo serial.port.file=COM3 >> "C:\\Program Files (x86)\\Arduino\\lib\\preferences.txt" 2>nul
    echo sketchbook.path=%~dp0 >> "C:\\Program Files (x86)\\Arduino\\lib\\preferences.txt" 2>nul
)

REM Também tentar configurar via registro do Windows (mais persistente)
reg add "HKCU\\Software\\Arduino\\preferences" /v board /t REG_SZ /d arduino:avr:uno /f 2>nul
reg add "HKCU\\Software\\Arduino\\preferences" /v serial.port /t REG_SZ /d COM3 /f 2>nul
reg add "HKCU\\Software\\Arduino\\preferences" /v serial.port.file /t REG_SZ /d COM3 /f 2>nul
reg add "HKCU\\Software\\Arduino\\preferences" /v sketchbook.path /t REG_SZ /d "%~dp0" /f 2>nul
reg add "HKCU\\Software\\Arduino\\preferences" /v last.sketch.path /t REG_SZ /d "%~dp0blockuino_sketch_${timestamp}.ino" /f 2>nul

REM Criar um arquivo de configuração adicional no diretório do projeto
echo # Arduino IDE Configuration for BlockuinoEditor > arduino_config.txt
echo # This file contains the configuration for Arduino Uno + COM3 >> arduino_config.txt
echo board=arduino:avr:uno >> arduino_config.txt
echo serial.port=COM3 >> arduino_config.txt
echo serial.port.file=COM3 >> arduino_config.txt
echo sketchbook.path=%~dp0 >> arduino_config.txt
echo. >> arduino_config.txt
echo # To apply manually if needed: >> arduino_config.txt
echo # 1. Open Arduino IDE >> arduino_config.txt
echo # 2. Go to File ^> Preferences >> arduino_config.txt
echo # 3. Copy the settings above to the preferences file >> arduino_config.txt

echo.
echo 📋 CONFIGURAÇÕES PRÉ-DEFINIDAS APLICADAS:
echo ✅ Placa: Arduino Uno
echo ✅ Porta: COM3
echo ✅ Arquivo: blockuino_sketch_${timestamp}.ino
echo.
echo � ARQUIVOS DE CONFIGURAÇÃO CRIADOS:
if exist "%USERPROFILE%\\AppData\\Local\\Arduino15\\preferences.txt" (
    echo ✅ %USERPROFILE%\\AppData\\Local\\Arduino15\\preferences.txt
)
if exist "C:\\Program Files\\Arduino\\lib\\preferences.txt" (
    echo ✅ C:\\Program Files\\Arduino\\lib\\preferences.txt
)
if exist "C:\\Program Files (x86)\\Arduino\\lib\\preferences.txt" (
    echo ✅ C:\\Program Files (x86)\\Arduino\\lib\\preferences.txt
)
if exist arduino_config.txt (
    echo ✅ arduino_config.txt (instruções manuais)
)
echo.
echo 📋 REGISTRO DO WINDOWS:
reg query "HKCU\\Software\\Arduino\\preferences" /v board 2>nul | find "board" >nul
if %errorlevel%==0 (
    echo ✅ Registro do Windows configurado
) else (
    echo ⚠️ Registro do Windows não pôde ser configurado
)
echo.
echo 📋 STATUS:
echo 🔌 Arduino deve estar conectado na porta COM3
echo 🖥️ Arduino IDE deve abrir automaticamente
echo ⚙️ Configurações aplicadas em múltiplos locais
echo ⚡ Pronto para upload com um clique!
echo.
echo 💡 SE AS CONFIGURAÇÕES NÃO APARE CEREM NO IDE:
echo    1. Feche completamente o Arduino IDE
echo    2. Execute novamente este arquivo .bat
echo    3. Ou aplique manualmente usando arduino_config.txt
echo    4. Vá em: Tools ^> Board ^> Arduino Uno
echo    5. Vá em: Tools ^> Port ^> COM3
echo.
echo 🔧 DIAGNÓSTICO ADICIONAL:
echo 📂 Verificando arquivos de configuração...
if exist "%USERPROFILE%\\AppData\\Local\\Arduino15\\preferences.txt" (
    echo 📄 Lendo configurações do usuário...
    type "%USERPROFILE%\\AppData\\Local\\Arduino15\\preferences.txt" | find "board=" | find "uno"
    if %errorlevel%==0 (
        echo ✅ Configuração Arduino Uno encontrada no arquivo do usuário
    ) else (
        echo ⚠️ Configuração Arduino Uno NÃO encontrada no arquivo do usuário
    )
)
echo.
echo 🚨 SE AINDA NÃO FUNCIONAR:
echo    • Execute como Administrador (botão direito ^> Executar como administrador)
echo    • Desative temporariamente o antivírus
echo    • Verifique se o Arduino IDE não está sendo executado por outro usuário
echo    • Reinicie o computador
echo    • Reinstale o Arduino IDE se necessário

pause
`;

    const batchBlob = new Blob([batchContent], { type: 'text/plain' });
    const batchUrl = URL.createObjectURL(batchBlob);
    const batchLink = document.createElement('a');
    batchLink.href = batchUrl;
    batchLink.download = `abrir_arduino_${timestamp}.bat`;
    document.body.appendChild(batchLink);
    batchLink.click();
    document.body.removeChild(batchLink);
    URL.revokeObjectURL(batchUrl);

    // Mostrar feedback
    alert(`✅ Arquivos criados com sucesso!

📁 blockuino_sketch_${timestamp}.ino
⚙️ abrir_arduino_${timestamp}.bat

🚀 Execute o arquivo .bat para abrir o Arduino IDE automaticamente com as configurações otimizadas!

💡 O arquivo .bat irá:
• Detectar automaticamente o Arduino IDE
• Abrir o arquivo .ino
• Configurar para Arduino Uno
• Fornecer instruções detalhadas`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 font-nunito">
      <HeaderOffline
        onShowTutorial={() => setShowTutorial(true)}
        generatedCode={generatedCode}
      />

      {/* Project Bar */}
      <div className="bg-white border-b-2 border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-semibold text-gray-600">
            Projeto: {currentProject?.name || "Sem título"}
          </span>
          {currentProject && (
            <span className="text-xs text-gray-400">
              Salvo automaticamente
            </span>
          )}
          {showArduinoPanel && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              🔌 Arduino Panel Ativo
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-lg">
            <span className="text-xs text-gray-600">Porta:</span>
            {selectedPort ? (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                ✅ Selecionada
              </span>
            ) : (
              <button
                onClick={scanPorts}
                disabled={isScanningPorts}
                className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                {isScanningPorts ? '🔍 Escaneando...' : '🔍 Conectar'}
              </button>
            )}
            <span className="text-xs text-gray-500 hidden md:inline">
              (Conecte Arduino primeiro)
            </span>
          </div>

          <button
            onClick={() => compileAndUpload()}
            disabled={isUploading || !selectedPort}
            className="text-sm bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
            title="Compilar e fazer upload do código para Arduino"
          >
            {isUploading ? '🚀 Enviando...' : '🚀 Upload'}
          </button>

          <button
            onClick={openInArduinoIDE}
            className="text-sm bg-orange-500 text-white px-3 py-1 rounded-lg hover:bg-orange-600 transition-colors"
            title="Abrir código no Arduino IDE"
          >
            🖥️ IDE
          </button>

          <button
            onClick={() => setShowProjectModal(true)}
            className="text-sm bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600 transition-colors"
          >
            💾 Projetos
          </button>
        </div>

      </div>

      <div className="flex h-screen pt-2">
        <BlockPalette />
        <WorkspaceArea onCodeChange={setGeneratedCode} />
        <CodePanel code={generatedCode} />
        {showArduinoPanel && (
          <ArduinoPanel code={generatedCode} />
        )}
      </div>

      <TutorialModal
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
      />

      {/* Project Management Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Meus Projetos</h2>
              <button
                onClick={() => setShowProjectModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {/* Save Current Project */}
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Salvar Projeto Atual</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const name = formData.get('name') as string;
                  const description = formData.get('description') as string;
                  if (name.trim()) {
                    saveNewProject(name.trim(), description.trim());
                    setShowProjectModal(false);
                  }
                }}
                className="space-y-2"
              >
                <input
                  name="name"
                  placeholder="Nome do projeto"
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
                <input
                  name="description"
                  placeholder="Descrição (opcional)"
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Salvar
                </button>
              </form>
            </div>

            {/* Projects List */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">Projetos Salvos</h3>
              {savedProjects.length === 0 ? (
                <p className="text-gray-500">Nenhum projeto salvo ainda.</p>
              ) : (
                savedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <h4 className="font-medium">{project.name}</h4>
                      {project.description && (
                        <p className="text-sm text-gray-600">{project.description}</p>
                      )}
                      <p className="text-xs text-gray-400">
                        Atualizado em {project.updatedAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          loadProject(project);
                          setShowProjectModal(false);
                        }}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                      >
                        Carregar
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir este projeto?')) {
                            deleteProject(project.id);
                          }
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      </div>

  );
}
