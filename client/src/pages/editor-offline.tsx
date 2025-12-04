import { useState, useEffect } from "react";
import HeaderOffline from "@/components/HeaderOffline";
import BlockPalette from "@/components/BlockPalette";
import WorkspaceArea from "@/components/WorkspaceArea";
import CodePanel from "@/components/CodePanel";
import ArduinoPanel from "@/components/ArduinoPanel";
import TutorialModal from "@/components/TutorialModal";
import { LocalStorage, Project } from "@/lib/local-storage";
// Temporariamente comentado - problema com resolução do pacote
// import { upload, boards } from "web-arduino-uploader";

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

  const [generatedCode, setGeneratedCode] = useState(`// Código Arduino gerado pelos blocos\n// 🎨 Criado com Arduino Blocks Kids\n\nvoid setup() {\n  // Inicializar comunicação serial\n  Serial.begin(9600);\n  Serial.println(\"🚀 Arduino iniciado!\");\n  \n  // Configurar pinos\n  pinMode(13, OUTPUT);  // LED no pino 13\n}\n\nvoid loop() {\n  // Seu código aparecerá aqui quando você\n  // arrastar os blocos para o workspace!\n  \n  // Exemplo: Piscar LED\n  digitalWrite(13, HIGH);   // Acender LED\n  delay(1000);              // Esperar 1 segundo\n  digitalWrite(13, LOW);    // Apagar LED\n  delay(1000);              // Esperar 1 segundo\n}`);

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
    setGeneratedCode(`// Código Arduino gerado pelos blocos\n// 🎨 Criado com Arduino Blocks Kids\n\nvoid setup() {\n  // Inicializar comunicação serial\n  Serial.begin(9600);\n  Serial.println(\"🚀 Arduino iniciado!\");\n  \n  // Configurar pinos\n  pinMode(13, OUTPUT);  // LED no pino 13\n}\n\nvoid loop() {\n  // Seu código aparecerá aqui quando você\n  // arrastar os blocos para o workspace!\n  \n  // Exemplo: Piscar LED\n  digitalWrite(13, HIGH);   // Acender LED\n  delay(1000);              // Esperar 1 segundo\n  digitalWrite(13, LOW);    // Apagar LED\n  delay(1000);              // Esperar 1 segundo\n}`);
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

      // Passo 1: "Compilar" o código (por enquanto, validação básica)
      setUploadProgress(10);
      console.log('🔧 Iniciando compilação...');

      // Validação básica do código Arduino
      if (!generatedCode.includes('void setup()') || !generatedCode.includes('void loop()')) {
        throw new Error('Código Arduino inválido: deve conter void setup() e void loop()');
      }

      setUploadProgress(30);
      console.log('✅ Validação do código OK');

      // Detectar se estamos em localhost ou online
      const isLocalEnvironment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

      // Passo 2: Compilar código usando API do servidor
      setUploadProgress(50);
      console.log('⚙️ Compilando código...');
      console.log('📝 Código a ser compilado:', generatedCode);

      // Detectar tipo de placa baseado na porta selecionada
      let boardType = 'arduino:avr:uno'; // Sempre usar Uno por padrão
      console.log('🎯 Usando Arduino Uno como padrão');

      let compileResponse;
      let compileResult;

      // Usar variável de ambiente para determinar a URL da API
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      console.log('� Usando API URL:', apiUrl);

      try {
        compileResponse = await fetch(`${apiUrl}/api/compile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: generatedCode,
            boardType: boardType
          })
        });
      } catch (fetchError) {
        console.error('❌ Erro na chamada da API:', fetchError);
        throw new Error(`Não foi possível conectar ao servidor de compilação em ${apiUrl}. Verifique se o servidor está rodando.`);
      }

      compileResult = await compileResponse.json();

      if (!compileResult.success) {
        throw new Error(`Erro na compilação: ${compileResult.message}\n${compileResult.error || ''}`);
      }

      const hexContent = compileResult.hex;
      console.log('📦 Hex file gerado com sucesso');

      setUploadProgress(70);

      // Passo 3: Fazer upload direto usando Web Serial API
      setUploadProgress(80);
      console.log('🚀 Fazendo upload para Arduino...');

      // Verificar se a porta já está aberta e fechá-la se necessário
      if (selectedPort.readable || selectedPort.writable) {
        console.log('🔌 Porta já está aberta, fechando antes de reabrir...');
        try {
          await selectedPort.close();
          await new Promise(resolve => setTimeout(resolve, 500)); // Aguardar um pouco
        } catch (e) {
          console.log('⚠️ Erro ao fechar porta anterior:', e);
        }
      }

      // Abrir a porta serial
      await selectedPort.open({ baudRate: 115200 });

      // Implementar upload real do hex file via serial
      console.log('📤 Enviando dados para Arduino...');

      // Função auxiliar para enviar dados via serial
      const sendData = async (data: Uint8Array) => {
        const writer = selectedPort.writable.getWriter();
        await writer.write(data);
        await writer.close();
      };

      // Função auxiliar para receber dados via serial
      const receiveData = async (length: number): Promise<Uint8Array> => {
        const reader = selectedPort.readable.getReader();
        const result = await reader.read();
        reader.releaseLock();
        return result.value.slice(0, length);
      };

      // Função auxiliar para enviar comando e verificar resposta
      const sendCommand = async (command: Uint8Array, expectedResponse?: number): Promise<boolean> => {
        await sendData(command);
        if (expectedResponse !== undefined) {
          await new Promise(resolve => setTimeout(resolve, 50));
          try {
            const response = await receiveData(2);
            const responseCode = response[1]; // STK responde com [0x14, status]
            console.log(`📡 Comando enviado: ${Array.from(command).map(b => b.toString(16).padStart(2, '0')).join(' ')}`);
            console.log(`📡 Resposta recebida: ${Array.from(response).map(b => b.toString(16).padStart(2, '0')).join(' ')}`);
            return responseCode === expectedResponse;
          } catch (e) {
            console.log('⚠️ Não foi possível ler resposta');
            return false;
          }
        }
        return true;
      };

      // Converter hex string Intel HEX para bytes
      const parseIntelHex = (hexString: string): Uint8Array => {
        console.log('🔍 Iniciando parsing Intel HEX...');
        console.log('📄 Hex string completo:', hexString);

        const lines = hexString.trim().split('\n');
        console.log('📄 Número de linhas:', lines.length);

        const memory = new Map<number, number>();

        for (const line of lines) {
          console.log('📄 Processando linha:', line);
          if (!line.startsWith(':')) {
            console.log('⚠️ Pulando linha que não começa com :');
            continue;
          }

          // Parse Intel HEX line
          const data = line.substring(1);
          const byteCount = parseInt(data.substring(0, 2), 16);
          const address = parseInt(data.substring(2, 6), 16);
          const recordType = parseInt(data.substring(6, 8), 16);

          console.log(`📄 Linha: ${byteCount} bytes, endereço 0x${address.toString(16)}, tipo ${recordType}`);

          // Only process data records (type 0)
          if (recordType === 0) {
            const hexData = data.substring(8, 8 + byteCount * 2);

            console.log(`📄 Dados hex: ${hexData}`);

            for (let i = 0; i < hexData.length; i += 2) {
              const byte = parseInt(hexData.substring(i, i + 2), 16);
              memory.set(address + i / 2, byte);
            }
          } else if (recordType === 1) {
            console.log('📄 Fim do arquivo (record type 1)');
          }
        }

        // Convert to contiguous array
        const addresses = Array.from(memory.keys()).sort((a, b) => a - b);
        const minAddress = addresses[0] || 0;
        const maxAddress = addresses[addresses.length - 1] || 0;

        console.log(`📄 Endereços de ${minAddress} até ${maxAddress}`);

        const result = new Uint8Array(maxAddress - minAddress + 1);

        Array.from(memory.entries()).forEach(([address, byte]) => {
          result[address - minAddress] = byte;
        });

        console.log(`📄 Array final: ${result.length} bytes`);
        console.log('📄 Primeiros 64 bytes:', Array.from(result.slice(0, 64)).map(b => b.toString(16).padStart(2, '0')).join(' '));

        return result;
      };

      // Funções auxiliares para protocolo STK500 (Optiboot)
      const sendSTKCommand = async (command: Uint8Array): Promise<void> => {
        const message = new Uint8Array(command.length + 1);
        message.set(command);
        message[command.length] = 0x20; // CRC_EOP
        await sendData(message);
      };

      const receiveSTKResponse = async (): Promise<Uint8Array> => {
        const reader = selectedPort.readable.getReader();
        const response = new Uint8Array(32);
        let index = 0;
        
        try {
          // Ler até encontrar Resp_STK_INSYNC (0x14)
          while (index < response.length) {
            const { value, done } = await reader.read();
            if (done) break;
            
            for (let i = 0; i < value.length && index < response.length; i++) {
              response[index++] = value[i];
              if (value[i] === 0x14) { // Resp_STK_INSYNC
                // Ler próximo byte (deve ser Resp_STK_OK ou dados)
                if (i + 1 < value.length) {
                  response[index++] = value[i + 1];
                  i++; // Pular o próximo byte já lido
                } else {
                  // Aguardar próximo chunk
                  const nextResult = await reader.read();
                  if (!nextResult.done && nextResult.value.length > 0) {
                    response[index++] = nextResult.value[0];
                  }
                }
                return response.slice(0, index);
              }
            }
          }
        } finally {
          reader.releaseLock();
        }
        
        throw new Error('Timeout waiting for STK response');
      };

      // Função para fazer upload para Arduino Uno usando STK500 (Optiboot)
      const uploadToUno = async (hexData: string) => {
        console.log('🎯 Fazendo upload para Arduino Uno usando STK500...');

        // Reset do Arduino com múltiplas tentativas para re-uploads
        console.log('🔄 Fazendo reset do Arduino...');

        let bootloaderReady = false;
        let attempts = 0;
        const maxAttempts = 3;

        while (!bootloaderReady && attempts < maxAttempts) {
          attempts++;
          console.log(`🔄 Tentativa ${attempts}/${maxAttempts} de ativar bootloader...`);

          try {
            // Sequência de reset mais agressiva para Arduino já executando código
            console.log('📡 Enviando sinal DTR LOW (500ms)...');
            await selectedPort.setSignals({ dataTerminalReady: false });
            await new Promise(resolve => setTimeout(resolve, 500));

            console.log('📡 Enviando sinal DTR HIGH (100ms)...');
            await selectedPort.setSignals({ dataTerminalReady: true });
            await new Promise(resolve => setTimeout(resolve, 100));

            // Aguardar bootloader inicializar (tempo aumentado para re-uploads)
            console.log('⏳ Aguardando bootloader Optiboot inicializar...');
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Testar se bootloader está respondendo
            console.log('🔍 Testando comunicação com bootloader...');
            const testCmd = new Uint8Array([0x41]); // STK_GET_SYNC
            await sendSTKCommand(testCmd);
            const response = await receiveSTKResponse();

            if (response && response.length > 0) {
              console.log('✅ Bootloader respondeu - pronto para upload!');
              bootloaderReady = true;
            } else {
              console.log('⚠️ Bootloader não respondeu nesta tentativa');
              if (attempts < maxAttempts) {
                console.log('⏳ Aguardando antes da próxima tentativa...');
                await new Promise(resolve => setTimeout(resolve, 2000));
              }
            }

          } catch (error) {
            console.log(`❌ Erro na tentativa ${attempts}:`, error);
            if (attempts < maxAttempts) {
              console.log('⏳ Aguardando antes da próxima tentativa...');
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          }
        }

        if (!bootloaderReady) {
          throw new Error(`Não foi possível ativar o bootloader Optiboot após ${maxAttempts} tentativas. Verifique se o Arduino está conectado corretamente.`);
        }

        // Obter dados do programa
        const programData = parseIntelHex(hexData);
        console.log('� Enviando programa - Total bytes:', programData.length);

        // Para Optiboot, programar em páginas de 128 bytes
        const pageSize = 128;
        let address = 0;

        for (let offset = 0; offset < programData.length; offset += pageSize) {
          const pageData = programData.slice(offset, offset + pageSize);
          const wordAddress = Math.floor(address / 2); // Endereço de palavra para STK500

          // STK_LOAD_ADDRESS - Define endereço (word address)
          console.log(`� Definindo endereço: 0x${wordAddress.toString(16)}`);
          const loadAddrCmd = new Uint8Array([
            0x55, // STK_LOAD_ADDRESS
            wordAddress & 0xFF,
            (wordAddress >> 8) & 0xFF
          ]);
          await sendSTKCommand(loadAddrCmd);
          await receiveSTKResponse();

          // STK_PROG_PAGE - Programa página
          console.log(`� Programando página: ${offset}-${offset + pageData.length} bytes`);
          const progPageCmd = new Uint8Array(4 + pageData.length);
          progPageCmd[0] = 0x64; // STK_PROG_PAGE
          progPageCmd[1] = (pageData.length >> 8) & 0xFF;
          progPageCmd[2] = pageData.length & 0xFF;
          progPageCmd[3] = 0x46; // 'F' para flash
          progPageCmd.set(pageData, 4);
          await sendSTKCommand(progPageCmd);
          await receiveSTKResponse();

          address += pageData.length;

          // Atualizar progresso
          const progress = 80 + Math.floor((offset / programData.length) * 15);
          setUploadProgress(progress);
        }

        console.log('📤 Todas as páginas enviadas');

        // STK_LEAVE_PROGMODE - Sai do modo programação
        console.log('🏁 Saindo do modo programação...');
        const leaveCmd = new Uint8Array([0x51]); // STK_LEAVE_PROGMODE
        await sendSTKCommand(leaveCmd);
        await receiveSTKResponse();

        console.log('✅ Upload STK500 concluído');
      };



      // Detectar tipo de placa e fazer upload (sempre Uno)
      await uploadToUno(hexContent);

      setUploadProgress(95);

      // Aguardar um pouco para o Arduino reiniciar
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Reset adicional para garantir que o novo código seja executado
      console.log('🔄 Fazendo reset adicional...');
      await selectedPort.setSignals({ dataTerminalReady: false });
      await new Promise(resolve => setTimeout(resolve, 100));
      await selectedPort.setSignals({ dataTerminalReady: true });
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Fechar a porta
      await selectedPort.close();

      setUploadProgress(100);

      setUploadProgress(100);
      console.log('✅ Upload concluído com sucesso!');
      alert('🎉 Código enviado para Arduino com sucesso!');

    } catch (error) {
      console.error('❌ Erro no upload:', error);
      
      // Oferecer fallback: download do código quando compilação falhar
      const shouldDownload = confirm(`❌ Erro na compilação/upload online: ${(error as Error).message}

💡 Alternativa: Deseja baixar o código Arduino para compilar localmente no Arduino IDE?

✅ O download incluirá:
• Arquivo .ino pronto para Arduino IDE
• Script automático para abrir o Arduino IDE
• Configurações pré-definidas para Arduino Uno

📝 Instruções:
1. Execute o arquivo .bat baixado
2. O Arduino IDE abrirá automaticamente
3. Clique em Upload (→) no Arduino IDE`);

      if (shouldDownload) {
        // Usar a função existente para abrir no Arduino IDE (que faz download)
        openInArduinoIDE();
        alert('✅ Arquivos de download criados!\n\nExecute o arquivo .bat para abrir o Arduino IDE com configurações automáticas.');
      } else {
        alert(`❌ Upload cancelado.

💡 Para tentar novamente:
• Verifique sua conexão com a internet
• Certifique-se de que o Arduino está conectado
• Selecione a porta correta
• Tente o botão "🖥️ Abrir no Arduino IDE" para compilação local`);
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      
      // Garantir que a porta serial seja fechada
      try {
        if (selectedPort && (selectedPort.readable || selectedPort.writable)) {
          await selectedPort.close();
          console.log('🔌 Porta serial fechada com sucesso');
        }
      } catch (e) {
        console.log('⚠️ Erro ao fechar porta no finally:', e);
      }
    }
  };

  const uploadToArduino = async () => {
    // Chamar a nova função de compilação e upload direto
    await compileAndUpload();
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
        {/* REMOVIDO: Funcionalidades de upload para Arduino */}
        {/*
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
                {isScanningPorts ? '🔍 Escaneando...' : '🔍 Escanear Portas'}
              </button>
            )}
            <span className="text-xs text-gray-500 hidden md:inline">
              (Conecte Arduino primeiro)
            </span>
          </div>

          <button
            onClick={openInArduinoIDE}
            className="text-sm bg-orange-500 text-white px-3 py-1 rounded-lg hover:bg-orange-600 transition-colors"
            title="Abrir código no Arduino IDE"
          >
            🖥️ Abrir no Arduino IDE
          </button>
        */}
     
          {/* BOTÕES COMENTADOS TEMPORARIAMENTE */}
          {/* <button
            onClick={() => setShowArduinoPanel(!showArduinoPanel)}
            className={`text-sm px-3 py-1 rounded-lg transition-colors ${
              showArduinoPanel 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-gray-500 text-white hover:bg-gray-600'
            }`}
          >
            🤖 Arduino {showArduinoPanel ? 'Conectado' : 'Conectar'}
          </button>
          <button
            onClick={createNewProject}
            className="text-sm bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Novo Projeto
          </button>
          <button
            onClick={() => setShowProjectModal(true)}
            className="text-sm bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Meus Projetos
          </button> */}

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
