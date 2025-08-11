// Sistema de armazenamento local usando localStorage
export interface Project {
  id: string;
  name: string;
  description?: string;
  blocks: any;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}

export class LocalStorage {
  private static PROJECTS_KEY = 'blockskids_projects';
  private static CURRENT_PROJECT_KEY = 'blockskids_current_project';

  // Projetos
  static getAllProjects(): Project[] {
    try {
      const data = localStorage.getItem(this.PROJECTS_KEY);
      if (!data) return [];
      
      const projects = JSON.parse(data);
      return projects.map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt)
      }));
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      return [];
    }
  }

  static getProject(id: string): Project | null {
    const projects = this.getAllProjects();
    return projects.find(p => p.id === id) || null;
  }

  static saveProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
    const projects = this.getAllProjects();
    const now = new Date();
    
    const newProject: Project = {
      ...project,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now
    };

    projects.push(newProject);
    localStorage.setItem(this.PROJECTS_KEY, JSON.stringify(projects));
    return newProject;
  }

  static updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>): Project | null {
    const projects = this.getAllProjects();
    const index = projects.findIndex(p => p.id === id);
    
    if (index === -1) return null;

    projects[index] = {
      ...projects[index],
      ...updates,
      updatedAt: new Date()
    };

    localStorage.setItem(this.PROJECTS_KEY, JSON.stringify(projects));
    return projects[index];
  }

  static deleteProject(id: string): boolean {
    const projects = this.getAllProjects();
    const filteredProjects = projects.filter(p => p.id !== id);
    
    if (filteredProjects.length === projects.length) return false;

    localStorage.setItem(this.PROJECTS_KEY, JSON.stringify(filteredProjects));
    return true;
  }

  // Projeto atual
  static getCurrentProject(): Project | null {
    try {
      const data = localStorage.getItem(this.CURRENT_PROJECT_KEY);
      if (!data) return null;
      
      const project = JSON.parse(data);
      return {
        ...project,
        createdAt: new Date(project.createdAt),
        updatedAt: new Date(project.updatedAt)
      };
    } catch (error) {
      console.error('Erro ao carregar projeto atual:', error);
      return null;
    }
  }

  static setCurrentProject(project: Project): void {
    localStorage.setItem(this.CURRENT_PROJECT_KEY, JSON.stringify(project));
  }

  static clearCurrentProject(): void {
    localStorage.removeItem(this.CURRENT_PROJECT_KEY);
  }

  // Utilitários
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static exportProjects(): string {
    const projects = this.getAllProjects();
    return JSON.stringify(projects, null, 2);
  }

  static importProjects(jsonData: string): boolean {
    try {
      const projects = JSON.parse(jsonData);
      localStorage.setItem(this.PROJECTS_KEY, JSON.stringify(projects));
      return true;
    } catch (error) {
      console.error('Erro ao importar projetos:', error);
      return false;
    }
  }

  static clearAllData(): void {
    localStorage.removeItem(this.PROJECTS_KEY);
    localStorage.removeItem(this.CURRENT_PROJECT_KEY);
  }
}
