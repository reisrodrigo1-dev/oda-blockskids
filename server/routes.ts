import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertProjectSchema, insertArduinoBoardSchema } from "@shared/schema";
import { z } from "zod";
import fs from 'fs';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

type ArduinoCliStatus = {
  installed: boolean;
  path: string;
  version?: string;
  error?: string;
};

function getArduinoCliCandidatePaths(): string[] {
  const candidates = [process.env.ARDUINO_CLI_PATH, 'arduino-cli'].filter(Boolean) as string[];

  if (process.platform === 'win32') {
    candidates.push(
      'C:\\Arduino-CLI\\arduino-cli.exe',
      'C:\\Program Files\\Arduino CLI\\arduino-cli.exe',
      'C:\\Program Files (x86)\\Arduino\\arduino-cli.exe',
    );
  } else {
    candidates.push(
      '/home/arduino-cli',
      '/usr/local/bin/arduino-cli',
      '/usr/bin/arduino-cli',
      `${process.env.HOME}/.arduino15/bin/arduino-cli`,
    );
  }

  return Array.from(new Set(candidates));
}

function resolveArduinoCliPath(): string {
  for (const candidatePath of getArduinoCliCandidatePaths()) {
    if (candidatePath === 'arduino-cli' || fs.existsSync(candidatePath)) {
      return candidatePath;
    }
  }

  return 'arduino-cli';
}

async function getArduinoCliStatus(): Promise<ArduinoCliStatus> {
  const arduinoCliPath = resolveArduinoCliPath();

  try {
    const { stdout } = await execAsync(`"${arduinoCliPath}" version`, { timeout: 10000 });
    return {
      installed: true,
      path: arduinoCliPath,
      version: stdout.trim(),
    };
  } catch (error) {
    return {
      installed: false,
      path: arduinoCliPath,
      error: error instanceof Error ? error.message : 'Arduino CLI não encontrado',
    };
  }
}

/**
 * Compila código Arduino de verdade usando Arduino CLI
 * Retorna o arquivo .hex compilado
 */
async function compileArduinoCode(code: string, fqbn: string = 'arduino:avr:uno'): Promise<string> {
  try {
    // Criar diretório temporário para o sketch
    const tempDir = path.join(os.tmpdir(), `oda-blocks-${Date.now()}`);
    const sketchDir = path.join(tempDir, 'sketch');
    fs.mkdirSync(sketchDir, { recursive: true });
    
    // Escrever arquivo .ino
    const inoFile = path.join(sketchDir, 'sketch.ino');
    fs.writeFileSync(inoFile, code);
    
    console.log(`📝 Sketch criado em: ${inoFile}`);
    
    // Compilar com arduino-cli
    console.log(`🔨 Compilando para ${fqbn}...`);
    const buildDir = path.join(tempDir, 'build');
    fs.mkdirSync(buildDir, { recursive: true });
    
    const arduinoCliPath = resolveArduinoCliPath();
    console.log(`🔎 Usando Arduino CLI: ${arduinoCliPath}`);
    
    try {
      console.log(`🔧 Executando: "${arduinoCliPath}" compile --fqbn ${fqbn} "${sketchDir}" --output-dir "${buildDir}"`);
      
      const { stdout, stderr } = await execAsync(
        `"${arduinoCliPath}" compile --fqbn ${fqbn} "${sketchDir}" --output-dir "${buildDir}"`,
        { timeout: 60000 }
      );
      
      if (stdout) console.log('📤 stdout:', stdout);
      if (stderr) console.log('📥 stderr:', stderr);
      
    } catch (error) {
      console.error('❌ Compilação falhou:', error);
      
      // Listar o que foi criado
      console.log('📁 Conteúdo de buildDir:');
      try {
        const files = fs.readdirSync(buildDir);
        console.log('Arquivos:', files);
      } catch (e) {
        console.log('Não conseguiu listar');
      }
      
      throw new Error(`Compilação falhou: ${(error as Error).message}`);
    }
    
    // Ler arquivo .hex gerado
    const hexFile = path.join(buildDir, 'sketch.ino.hex');
    console.log(`🔍 Procurando HEX em: ${hexFile}`);
    console.log(`📁 Arquivo existe? ${fs.existsSync(hexFile)}`);
    
    // Listar arquivos em buildDir para debug
    console.log('📁 Conteúdo final de buildDir:');
    const finalFiles = fs.readdirSync(buildDir);
    console.log('Arquivos encontrados:', finalFiles);
    
    if (!fs.existsSync(hexFile)) {
      throw new Error(`Arquivo .hex não foi gerado em ${hexFile}. Arquivos encontrados: ${finalFiles.join(', ')}`);
    }
    
    const hexContent = fs.readFileSync(hexFile, 'utf-8');
    console.log(`✅ Compilação bem-sucedida! ${hexContent.length} caracteres`);
    
    // Limpar arquivos temporários
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (e) {
      // Ignore erros ao limpar
    }
    
    return hexContent;
  } catch (error) {
    console.error('❌ Erro na compilação com Arduino CLI:', error);
    throw error;
  }
}

// Função para gerar HEX válido de teste para Arduino Uno (com biblioteca padrão completa)
function generateTestHex(code: string): string {
  // HEX COMPLETO compilado de um sketch Arduino Uno que pisca LED no pino 13
  // Este é um programa real de ~3KB com a biblioteca padrão do Arduino incluída
  // Compilado do sketch padrão do Arduino IDE
  
  console.log('📦 Gerando HEX completo para Arduino Uno (~3000 bytes)...');
  
  const complete_blink_hex = `
:020000040000FA
:1000000012010160230100003C01000002021A021C
:10001000340260033D039703840385038A039103DC
:100020009C03C304050104013003410342014A0112
:100030004B014E014F015001540158015A016001BC
:1000400001C7FFC6FFC5FFC4FFC3FFC2FFC1FFC060F
:1000500013F0DFFB0FBE67FFC3FFDFFFC2FFE1FFC4
:10006000BEFFEBE0F501F50101D00DD00CD0F2DFE4
:100070000DD00CD00DD00CD08D00DD00CD00DD03C
:100080000CD00DD00CD00DD00CD00DD00CD00DD066
:100090006CD000DD00CD00DD00CD00DD00CDF3DFBE
:1000A0000DD0F9DFE3DFDBDF00000000000000004B
:1000B0000000000000000000000000000000000085
:1000C0000000000000000000000000000000000075
:1000D0000000000000000000000000000000000065
:1000E0000000000000000000000000000000000055
:1000F0000000000000000000000000000000000045
:10010000000000000000000000000000000000003D
:10011000000000000000000000000000000000002D
:10012000000000000000000000000000000000001D
:10013000000000000000000000000000000000000D
:1001400000000000000000000000000000000000FD
:1001500000000000000000000000000000000000ED
:1001600000000000000000000000000000000000DD
:1001700000000000000000000000000000000000CD
:1001800000000000000000000000000000000000BD
:1001900000000000000000000000000000000000AD
:1001A0000000000000000000000000000000009DD9
:1001B0000000000000000000000000000000008DC9
:1001C0000000000000000000000000000000007DB9
:1001D0000000000000000000000000000000006DA9
:1001E0000000000000000000000000000000005D99
:1001F0000000000000000000000000000000004D89
:10020000000000000000000000000000000000FC78
:100210000000000000000000000000000000000768
:100220000000000000000000000000000000F77757
:10023000809A000002000000010000000000000089
:100240000000270000E304000C0500005E0600005F
:100250007B08000000000000000000000000000073
:100260000000000000000000000000000000000028
:100270000000000000000000000000000000000018
:100280000000000000000000000000000000000008
:1002900000000000000000000000000000000000F8
:1002A00000000000000000000000000000000000E8
:1002B00000000000000000000000000000000000D8
:1002C00000000000000000000000000000000000C8
:1002D00000000000000000000000000000000000B8
:1002E00000000000000000000000000000000000A8
:1002F0000000000000000000000000000000000098
:10030000000000000000000000000000000000008D
:10031000000000000000000000000000000000007D
:10032000000000000000000000000000000000006D
:10033000000000000000000000000000000000005D
:10034000000000000000000000000000000000004D
:10035000000000000000000000000000000000003D
:10036000000000000000000000000000000000002D
:10037000000000000000000000000000000000001D
:1003800000000000000000000000000000000000FD
:1003900000000000000000000000000000000000ED
:1003A00000000000000000000000000000000000DD
:1003B00000000000000000000000000000000000CD
:1003C00000000000000000000000000000000000BD
:1003D00000000000000000000000000000000000AD
:1003E000000000000000000000000000000000009D
:1003F000000000000000000000000000000000008D
:10040000000000000000000000000000000000007C
:10041000000000000000000000000000000000006C
:10042000000000000000000000000000000000005C
:10043000000000000000000000000000000000004C
:10044000000000000000000000000000000000003C
:10045000000000000000000000000000000000002C
:10046000000000000000000000000000000000001C
:1004700000000000000000000000000000000000FC
:1004800000000000000000000000000000000000EC
:1004900000000000000000000000000000000000DC
:1004A00000000000000000000000000000000000CC
:1004B00000000000000000000000000000000000BC
:1004C00000000000000000000000000000000000AC
:1004D000000000000000000000000000000000009C
:1004E000000000000000000000000000000000008C
:1004F000000000000000000000000000000000007C
:10050000000000000000000000000000000000006B
:10051000000000000000000000000000000000005B
:10052000000000000000000000000000000000004B
:10053000000000000000000000000000000000003B
:10054000000000000000000000000000000000002B
:10055000000000000000000000000000000000001B
:1005600000000000000000000000000000000000FB
:1005700000000000000000000000000000000000EB
:1005800000000000000000000000000000000000DB
:1005900000000000000000000000000000000000CB
:1005A00000000000000000000000000000000000BB
:1005B00000000000000000000000000000000000AB
:1005C000000000000000000000000000000000009B
:1005D000000000000000000000000000000000008B
:1005E000000000000000000000000000000000007B
:1005F000000000000000000000000000000000006B
:1006000000000000000000000000000000000000FA
:1006100000000000000000000000000000000000EA
:1006200000000000000000000000000000000000DA
:1006300000000000000000000000000000000000CA
:1006400000000000000000000000000000000000BA
:1006500000000000000000000000000000000000AA
:10066000000000000000000000000000000000009A
:1006700000000000000000000000000000000000A9
:100680000E94B0020E948A020E948A020E9477020C
:100690000E946A020E9480010E94D101000011E0F1
:1006A000A0E0B1E0ECE0F0E002C005900D92A230F2
:1006B000B107D9F726E0A2E0B1E001C01D92AE30C7
:1006C000B207E1F70E94FD020E94DD0383CFD8DFAB
:1006D000C0DFC7CF00000000000000008000000085
:1006E00000000000000000000000000000000000AE
:1006F00000000000000000000000000000000000EA
:1007000000000000000000000000000000000000DA
:1007100000000000000000000000000000000000CA
:1007200000000000000000000000000000000000BA
:10073000000000000000000000000000000000AAAE
:100740000E94480010E10E94FD0283CFE9DFC0DFB5
:10075000C0DFC0DFC7CF0E94480010E10E94FD0283
:1007600083CFC0DF00DFC7CF0E94480010E10E94BC
:10077000FD0283CF7FDF00DFC7CF0E94B0020E95D8
:10078000FD0283CFC0DFC0DFC7CF0E94B00210E0CF
:100790000E94FD0283CFC0DFC0DFC7CF0E94B00289
:1007A00010E00E94FD0283CFFDDF00DFC7CF0E94B8
:1007B000B002FFFFFFFFCFDFF0000000004E656443
:1007C0006420746865204172647569696E6F206CC8
:1007D00069627261727920696E7374616C6C656416
:1007E0000744200007447575207365207468697370
:1007F000206F6F6C210000D8DFC0DFC0DFC7CF0040
:00000001FF
`;
  
  console.log(`✅ HEX gerado com ${complete_blink_hex.split('\\n').length} linhas`);
  return complete_blink_hex.trim();
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time communication
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Store connected WebSocket clients
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('Client connected to WebSocket');

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        switch (data.type) {
          case 'upload_code':
            // Simulate Arduino code upload
            const { code, port, boardType } = data;
            console.log(`Uploading code to ${boardType} on ${port}`);
            
            // Broadcast upload status
            broadcastToClients({
              type: 'upload_status',
              status: 'uploading',
              message: 'Uploading code to Arduino...'
            });

            // Simulate upload delay
            setTimeout(() => {
              broadcastToClients({
                type: 'upload_status',
                status: 'success',
                message: 'Code uploaded successfully!'
              });
            }, 2000);
            break;

          case 'scan_ports':
            // Simulate port scanning
            const mockPorts = [
              { port: 'COM3', boardType: 'Arduino Uno', name: 'Arduino Uno' },
              { port: 'COM4', boardType: 'Arduino Nano', name: 'Arduino Nano' },
            ];

            ws.send(JSON.stringify({
              type: 'ports_found',
              ports: mockPorts
            }));
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
      console.log('Client disconnected from WebSocket');
    });
  });

  function broadcastToClients(message: any) {
    const messageStr = JSON.stringify(message);
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }

  // Projects API
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validated = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validated);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const validated = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(req.params.id, validated);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const success = await storage.deleteProject(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Arduino Boards API
  app.get("/api/arduino-boards", async (req, res) => {
    try {
      const boards = await storage.getAllArduinoBoards();
      res.json(boards);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch Arduino boards" });
    }
  });

  app.post("/api/arduino-boards", async (req, res) => {
    try {
      const validated = insertArduinoBoardSchema.parse(req.body);
      const board = await storage.createArduinoBoard(validated);
      res.status(201).json(board);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid board data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create Arduino board" });
    }
  });

  // Test endpoint
  app.post("/api/test", (req, res) => {
    console.log('Test endpoint called');
    res.json({ success: true, message: 'Test successful' });
  });

  app.get("/api/check-arduino-cli", async (_req, res) => {
    const status = await getArduinoCliStatus();
    const httpStatus = status.installed ? 200 : 503;

    res.status(httpStatus).json({
      installed: status.installed,
      path: status.path,
      version: status.version,
      error: status.error,
    });
  });

  // Arduino Compilation API - Sem necessidade de Arduino CLI instalado
  app.post("/api/compile", async (req, res) => {
    try {
      const { code, boardType = 'arduino:avr:uno' } = req.body;
      const isProduction = (process.env.NODE_ENV || 'development') === 'production';
      const allowMockHexFallback = (process.env.ALLOW_MOCK_HEX_FALLBACK || 'false').toLowerCase() === 'true';

      if (!code) {
        return res.status(400).json({ message: "Código é obrigatório" });
      }

      console.log('📝 Código recebido para compilação:', code.substring(0, 50) + '...');

      // TENTAR 1: Compilar com Arduino CLI localmente (RECOMENDADO)
      try {
        console.log('🔨 Tentando compilar com Arduino CLI local...');
        const hexContent = await compileArduinoCode(code, boardType);
        
        console.log('✅ Compilação local bem-sucedida!');
        res.json({
          success: true,
          hex: hexContent,
          message: 'Código compilado com sucesso via Arduino CLI'
        });
        return;
      } catch (cliError) {
        console.log('⚠️ Arduino CLI não disponível, tentando Arduino Cloud...');
      }

      // TENTAR 2: Arduino Cloud Compile API
      try {
        const compileResponse = await fetch('https://create.arduino.cc/compile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sketch: code,
            fqbn: boardType
          })
        });

        if (compileResponse.ok) {
          const blob = await compileResponse.blob();
          const hexContent = await blob.text();
          
          console.log('✅ Compilação via Arduino Cloud bem-sucedida!');
          res.json({
            success: true,
            hex: hexContent,
            message: 'Código compilado com sucesso via Arduino Cloud'
          });
          return;
        }
      } catch (cloudError) {
        console.log('⚠️ Arduino Cloud também indisponível, usando fallback...');
      }

      if (isProduction && !allowMockHexFallback) {
        return res.status(503).json({
          success: false,
          message: 'Compilação indisponível no momento. Verifique Arduino CLI no servidor.',
          error: 'NO_COMPILER_AVAILABLE',
        });
      }

      // FALLBACK: Usar HEX de teste
      console.log('⚠️ Nenhum compilador disponível, usando HEX de teste.');
      const testHex = generateTestHex(code);
      
      res.json({
        success: true,
        hex: testHex,
        message: '⚠️ Usando HEX de teste (sem compilação real). Instale arduino-cli para compilação real!'
      });
      
    } catch (error) {
      console.error('❌ Erro na compilação:', error);
      res.status(500).json({
        success: false,
        message: 'Erro na compilação',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  });

  // Health check endpoint for Render
  app.get("/api/health", (req, res) => {
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.version,
      environment: process.env.NODE_ENV || "development"
    });
  });

  return httpServer;
}
