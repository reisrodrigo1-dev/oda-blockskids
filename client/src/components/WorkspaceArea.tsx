import { useState, useRef, useEffect } from "react";
import { generateArduinoCode } from "@/lib/arduino-generator";

interface WorkspaceBlock {
  id: string;
  type: string;
  label: string;
  color: string;
  icon: string;
  x: number;
  y: number;
  inputs?: any[];
  connections?: { parent?: string; children?: string[] };
}

interface WorkspaceAreaProps {
  onCodeChange: (code: string) => void;
}

export default function WorkspaceArea({ onCodeChange }: WorkspaceAreaProps) {
  const [blocks, setBlocks] = useState<WorkspaceBlock[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const workspaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate Arduino code when blocks change
    const code = generateArduinoCode(blocks);
    onCodeChange(code);
  }, [blocks, onCodeChange]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!workspaceRef.current?.contains(e.relatedTarget as Node)) {
      setDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    setShowWelcome(false);

    try {
      const blockData = JSON.parse(e.dataTransfer.getData('application/json'));
      const rect = workspaceRef.current?.getBoundingClientRect();
      
      if (rect) {
        const x = e.clientX - rect.left - 100; // Offset to center the block
        const y = e.clientY - rect.top - 25;
        
        const newBlock: WorkspaceBlock = {
          ...blockData,
          id: `${blockData.id}_${Date.now()}`,
          x: Math.max(0, x),
          y: Math.max(0, y),
        };
        
        setBlocks(prev => [...prev, newBlock]);
      }
    } catch (error) {
      console.error('Error parsing dropped block:', error);
    }
  };

  const handleBlockDrag = (blockId: string, e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const block = blocks.find(b => b.id === blockId);
    
    if (!block) return;
    
    const startBlockX = block.x;
    const startBlockY = block.y;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      setBlocks(prev => prev.map(b => 
        b.id === blockId 
          ? { ...b, x: startBlockX + deltaX, y: startBlockY + deltaY }
          : b
      ));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleDeleteBlock = (blockId: string) => {
    setBlocks(prev => prev.filter(b => b.id !== blockId));
    if (blocks.length === 1) {
      setShowWelcome(true);
    }
  };

  const clearWorkspace = () => {
    setBlocks([]);
    setShowWelcome(true);
  };

  const executeCode = () => {
    // This would trigger code execution/simulation
    console.log('Executing code with blocks:', blocks);
    // In a real implementation, this would send the code to the Arduino
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Workspace Header */}
      <div className="bg-white border-b-2 border-gray-200 p-4 flex justify-between items-center">
        <h2 className="font-bold text-lg text-gray-800 flex items-center">
          <svg className="w-5 h-5 text-kid-purple mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          Área de Trabalho Mágica
        </h2>
        <div className="flex space-x-2">
          <button 
            onClick={executeCode}
            className="bg-kid-green hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-block transition-all duration-200 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Executar
          </button>
          <button 
            onClick={clearWorkspace}
            className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg shadow-block transition-all duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Limpar
          </button>
        </div>
      </div>

      {/* Drop Zone */}
      <div 
        ref={workspaceRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`h-full p-6 relative transition-colors duration-200 ${
          dragOver ? 'bg-blue-100' : ''
        }`}
      >
        {/* Grid Background Pattern */}
        <div 
          className="absolute inset-0 opacity-5" 
          style={{
            backgroundImage: 'radial-gradient(circle, hsl(212 80% 60%) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />
        
        {/* Welcome Message */}
        {showWelcome && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-white rounded-3xl p-8 shadow-playful max-w-md">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Comece sua aventura!</h3>
              <p className="text-gray-600 font-semibold mb-4">
                Arraste os blocos coloridos da esquerda para cá e crie programas incríveis!
              </p>
              <div className="flex justify-center space-x-2">
                <div className="w-4 h-4 bg-kid-blue rounded-full"></div>
                <div className="w-4 h-4 bg-kid-green rounded-full"></div>
                <div className="w-4 h-4 bg-kid-orange rounded-full"></div>
                <div className="w-4 h-4 bg-kid-purple rounded-full"></div>
              </div>
            </div>
          </div>
        )}

        {/* Rendered Blocks */}
        {blocks.map((block) => (
          <div
            key={block.id}
            className={`absolute bg-${block.color} text-white p-3 rounded-lg shadow-block cursor-move hover:shadow-lg transition-all duration-200 flex items-center group select-none`}
            style={{ left: block.x, top: block.y }}
            onMouseDown={(e) => handleBlockDrag(block.id, e)}
          >
            <span className="mr-2">{block.icon}</span>
            <span className="font-semibold text-sm">{block.label}</span>
            
            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteBlock(block.id);
              }}
              className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white hover:text-red-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}

        {/* Drop Zone Indicator */}
        {dragOver && (
          <div className="absolute inset-0 border-4 border-dashed border-kid-blue rounded-lg bg-blue-50 bg-opacity-50 flex items-center justify-center">
            <div className="text-2xl font-bold text-kid-blue">Solte o bloco aqui! 🎯</div>
          </div>
        )}
      </div>
    </div>
  );
}
