import { useState } from "react";
import Header from "@/components/Header";
import BlockPalette from "@/components/BlockPalette";
import WorkspaceArea from "@/components/WorkspaceArea";
import CodePanel from "@/components/CodePanel";
import TutorialModal from "@/components/TutorialModal";

export default function Editor() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(`// Código Arduino gerado pelos blocos\n// 🎨 Criado com Arduino Blocks Kids\n\nvoid setup() {\n  // Inicializar comunicação serial\n  Serial.begin(9600);\n  Serial.println(\"🚀 Arduino iniciado!\");\n  \n  // Configurar pinos\n  pinMode(13, OUTPUT);  // LED no pino 13\n}\n\nvoid loop() {\n  // Seu código aparecerá aqui quando você\n  // arrastar os blocos para o workspace!\n  \n  // Exemplo: Piscar LED\n  digitalWrite(13, HIGH);   // Acender LED\n  delay(1000);              // Esperar 1 segundo\n  digitalWrite(13, LOW);    // Apagar LED\n  delay(1000);              // Esperar 1 segundo\n}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 font-nunito">
      <Header onShowTutorial={() => setShowTutorial(true)} />
      <div className="flex h-screen pt-2">
        <BlockPalette />
        <WorkspaceArea onCodeChange={setGeneratedCode} />
        <CodePanel code={generatedCode} />
      </div>
      <TutorialModal 
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
      />
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
