import { type Project, type InsertProject, type ArduinoBoard, type InsertArduinoBoard } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Projects
  getProject(id: string): Promise<Project | undefined>;
  getAllProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  
  // Arduino Boards
  getArduinoBoard(id: string): Promise<ArduinoBoard | undefined>;
  getAllArduinoBoards(): Promise<ArduinoBoard[]>;
  createArduinoBoard(board: InsertArduinoBoard): Promise<ArduinoBoard>;
  updateArduinoBoard(id: string, board: Partial<InsertArduinoBoard>): Promise<ArduinoBoard | undefined>;
  deleteArduinoBoard(id: string): Promise<boolean>;
  getArduinoBoardByPort(port: string): Promise<ArduinoBoard | undefined>;
}

export class MemStorage implements IStorage {
  private projects: Map<string, Project>;
  private arduinoBoards: Map<string, ArduinoBoard>;

  constructor() {
    this.projects = new Map();
    this.arduinoBoards = new Map();
  }

  // Projects
  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const now = new Date();
    const project: Project = { 
      ...insertProject, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    const existing = this.projects.get(id);
    if (!existing) return undefined;
    
    const updated: Project = {
      ...existing,
      ...updateData,
      updatedAt: new Date()
    };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Arduino Boards
  async getArduinoBoard(id: string): Promise<ArduinoBoard | undefined> {
    return this.arduinoBoards.get(id);
  }

  async getAllArduinoBoards(): Promise<ArduinoBoard[]> {
    return Array.from(this.arduinoBoards.values());
  }

  async createArduinoBoard(insertBoard: InsertArduinoBoard): Promise<ArduinoBoard> {
    const id = randomUUID();
    const board: ArduinoBoard = { 
      ...insertBoard, 
      id,
      lastSeen: new Date()
    };
    this.arduinoBoards.set(id, board);
    return board;
  }

  async updateArduinoBoard(id: string, updateData: Partial<InsertArduinoBoard>): Promise<ArduinoBoard | undefined> {
    const existing = this.arduinoBoards.get(id);
    if (!existing) return undefined;
    
    const updated: ArduinoBoard = {
      ...existing,
      ...updateData,
      lastSeen: new Date()
    };
    this.arduinoBoards.set(id, updated);
    return updated;
  }

  async deleteArduinoBoard(id: string): Promise<boolean> {
    return this.arduinoBoards.delete(id);
  }

  async getArduinoBoardByPort(port: string): Promise<ArduinoBoard | undefined> {
    return Array.from(this.arduinoBoards.values()).find(
      (board) => board.port === port,
    );
  }
}

export const storage = new MemStorage();
