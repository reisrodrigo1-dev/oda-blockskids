import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertProjectSchema, insertArduinoBoardSchema } from "@shared/schema";
import { z } from "zod";
import fs from 'fs';
import path from 'path';
import os from 'os';

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

  // Arduino Compilation API
  app.post("/api/compile", async (req, res) => {
    try {
      const { code, boardType = 'arduino:avr:uno' } = req.body;

      if (!code) {
        return res.status(400).json({ message: "Code is required" });
      }

      console.log('Recebido código para compilação:', code.substring(0, 100) + '...');

      // Compilar diretamente usando arduino-cli
      const { spawn } = await import('child_process');

      // Criar diretório temporário para o sketch
      const sketchName = `sketch_${Date.now()}`;
      const sketchTempDir = path.join(os.tmpdir(), sketchName);
      fs.mkdirSync(sketchTempDir, { recursive: true });

      // Escrever código no arquivo sketch.ino
      const sketchFile = path.join(sketchTempDir, `${sketchName}.ino`);
      fs.writeFileSync(sketchFile, code);

      console.log('Sketch criado em:', sketchFile);
      console.log('Conteúdo do sketch (primeiras 200 chars):', code.substring(0, 200));

      // Executar arduino-cli compile diretamente
      const arduinoCliPath = path.join(process.cwd(), 'arduino-cli.exe');
      console.log('Caminho do arduino-cli:', arduinoCliPath);
      console.log('Diretório de trabalho:', process.cwd());

      const compileProcess = spawn(arduinoCliPath, [
        'compile',
        '--fqbn', 'arduino:avr:uno',
        sketchTempDir,
        '--output-dir', path.join(sketchTempDir, 'build')
      ], {
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      compileProcess.stdout.on('data', (data) => {
        stdout += data.toString();
        console.log('STDOUT:', data.toString());
      });

      compileProcess.stderr.on('data', (data) => {
        stderr += data.toString();
        console.log('STDERR:', data.toString());
      });

      compileProcess.on('close', (code) => {
        console.log('Processo de compilação finalizado com código:', code);

        if (code === 0) {
          console.log('Compilação bem-sucedida, procurando arquivo hex...');

          // Leitura do arquivo hex gerado
          try {
            console.log('Conteúdo do diretório sketch:', fs.readdirSync(sketchTempDir));

            // Procurar por qualquer diretório que contenha arquivos hex
            const dirs = fs.readdirSync(sketchTempDir).filter(item => {
              const itemPath = path.join(sketchTempDir, item);
              return fs.statSync(itemPath).isDirectory();
            });

            console.log('Diretórios encontrados:', dirs);

            let hexFile = null;
            for (const dir of dirs) {
              const dirPath = path.join(sketchTempDir, dir);
              try {
                const files = fs.readdirSync(dirPath).filter((file: string) => file.endsWith('.hex'));
                if (files.length > 0) {
                  hexFile = path.join(dirPath, files[0]);
                  break;
                }
              } catch (error) {
                console.log(`Erro ao verificar diretório ${dir}:`, (error as Error).message);
              }
            }

            if (hexFile) {
              const hexContent = fs.readFileSync(hexFile, 'utf8');
              console.log(`Compilação bem-sucedida! Arquivo hex: ${path.basename(hexFile)}, tamanho: ${hexContent.split('\n').length} linhas`);

              res.json({
                success: true,
                hex: hexContent,
                message: 'Compilação bem-sucedida'
              });
            } else {
              console.log('Nenhum arquivo hex encontrado em nenhum diretório');
              res.status(500).json({
                success: false,
                message: 'Arquivo hex não encontrado após compilação'
              });
            }
          } catch (error) {
            console.error('Erro ao ler arquivo hex:', error);
            res.status(500).json({
              success: false,
              message: 'Erro ao ler arquivo hex',
              error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
          }
        } else {
          console.log('Compilação falhou com stderr:', stderr);
          res.status(500).json({
            success: false,
            message: 'Erro na compilação',
            error: stderr || 'Erro desconhecido na compilação'
          });
        }

        // Limpar arquivos temporários após resposta
        setTimeout(() => {
          try {
            if (fs.existsSync(sketchTempDir)) {
              fs.rmSync(sketchTempDir, { recursive: true, force: true });
            }
          } catch (error) {
            console.error('Erro ao limpar arquivos temporários:', error);
          }
        }, 2000);
      });

      compileProcess.on('error', (error) => {
        console.error('Erro ao iniciar processo de compilação:', error);
        res.status(500).json({
          success: false,
          message: 'Erro ao iniciar compilação',
          error: error.message
        });
      });

    } catch (error) {
      console.error('Erro na compilação:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
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
