import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertProjectSchema, insertArduinoBoardSchema } from "@shared/schema";
import { z } from "zod";

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

  return httpServer;
}
