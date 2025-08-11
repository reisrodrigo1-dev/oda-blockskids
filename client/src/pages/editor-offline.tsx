import { useState, useEffect } from "react";
import HeaderOffline from "@/components/HeaderOffline";
import BlockPalette from "@/components/BlockPalette";
import WorkspaceArea from "@/components/WorkspaceArea";
import CodePanel from "@/components/CodePanel";
import TutorialModal from "@/components/TutorialModal";
import { LocalStorage, Project } from "@/lib/local-storage";

export default function EditorOffline() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [savedProjects, setSavedProjects] = useState<Project[]>([]);
  const [generatedCode, setGeneratedCode] = useState(`// Código Arduino gerado pelos blocos\n// 🎨 Criado com Arduino Blocks Kids\n\nvoid setup() {\n  // Inicializar comunicação serial\n  Serial.begin(9600);\n  Serial.println(\"🚀 Arduino iniciado!\");\n  \n  // Configurar pinos\n  pinMode(13, OUTPUT);  // LED no pino 13\n}\n\nvoid loop() {\n  // Seu código aparecerá aqui quando você\n  // arrastar os blocos para o workspace!\n  \n  // Exemplo: Piscar LED\n  digitalWrite(13, HIGH);   // Acender LED\n  delay(1000);              // Esperar 1 segundo\n  digitalWrite(13, LOW);    // Apagar LED\n  delay(1000);              // Esperar 1 segundo\n}`);

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
        </div>
        <div className="flex items-center space-x-2">
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
          </button>
        </div>
      </div>

      <div className="flex h-screen pt-2">
        <BlockPalette />
        <WorkspaceArea onCodeChange={setGeneratedCode} />
        <CodePanel code={generatedCode} />
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

      {/* Floating Help Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button 
          onClick={() => setShowTutorial(true)}
          className="bg-gradient-to-r from-kid-orange to-yellow-400 text-white p-4 rounded-full shadow-playful hover:shadow-lg transform hover:scale-110 transition-all duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
