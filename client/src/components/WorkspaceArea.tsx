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
  order: number; // Posição na sequência de execução
}

interface WorkspaceAreaProps {
  onCodeChange: (code: string) => void;
}

export default function WorkspaceArea({ onCodeChange }: WorkspaceAreaProps) {
  const [blocks, setBlocks] = useState<WorkspaceBlock[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  // Função para obter o próximo número de ordem
  const getNextOrder = () => {
    if (blocks.length === 0) return 1;
    return Math.max(...blocks.map(b => b.order)) + 1;
  };

  // Função para reorganizar ordens quando um bloco é removido
  const reorderBlocks = (removedOrder: number) => {
    setBlocks(prev => prev.map(block => ({
      ...block,
      order: block.order > removedOrder ? block.order - 1 : block.order
    })));
  };

  // Função para mover um bloco para cima na ordem
  const moveBlockUp = (blockId: string) => {
    setBlocks(prev => {
      const block = prev.find(b => b.id === blockId);
      if (!block || block.order === 1) return prev;
      
      const blockAbove = prev.find(b => b.order === block.order - 1);
      if (!blockAbove) return prev;

      return prev.map(b => {
        if (b.id === blockId) return { ...b, order: b.order - 1 };
        if (b.id === blockAbove.id) return { ...b, order: b.order + 1 };
        return b;
      });
    });
  };

  // Função para mover um bloco para baixo na ordem
  const moveBlockDown = (blockId: string) => {
    setBlocks(prev => {
      const block = prev.find(b => b.id === blockId);
      const maxOrder = Math.max(...prev.map(b => b.order));
      if (!block || block.order === maxOrder) return prev;
      
      const blockBelow = prev.find(b => b.order === block.order + 1);
      if (!blockBelow) return prev;

      return prev.map(b => {
        if (b.id === blockId) return { ...b, order: b.order + 1 };
        if (b.id === blockBelow.id) return { ...b, order: b.order - 1 };
        return b;
      });
    });
  };

  useEffect(() => {
    // Generate Arduino code when blocks change, sorted by order
    const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);
    const code = generateArduinoCode(sortedBlocks);
    onCodeChange(code);
  }, [blocks, onCodeChange]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
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
          order: getNextOrder()
        };

        setBlocks(prev => [...prev, newBlock]);
      }
    } catch (error) {
      console.error('Error parsing dropped block:', error);
    }
  };

  const handleBlockDrag = (blockId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedBlock(blockId);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const block = blocks.find(b => b.id === blockId);
    
    if (!block) return;
    
    const startBlockX = block.x;
    const startBlockY = block.y;
    const workspaceRect = workspaceRef.current?.getBoundingClientRect();
    
    if (!workspaceRect) return;

    let animationFrameId: number;
    let lastUpdateTime = 0;
    const throttleMs = 16; // ~60fps

    const handleMouseMove = (e: MouseEvent) => {
      const currentTime = performance.now();
      
      // Throttle para melhor performance
      if (currentTime - lastUpdateTime < throttleMs) {
        return;
      }
      
      lastUpdateTime = currentTime;

      // Cancelar animação anterior se existir
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      // Usar requestAnimationFrame para movimento mais suave
      animationFrameId = requestAnimationFrame(() => {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        // Calcular nova posição com limites mais generosos do workspace
        const margin = 20;
        const newX = Math.max(-margin, Math.min(workspaceRect.width - 160 + margin, startBlockX + deltaX));
        const newY = Math.max(-margin, Math.min(workspaceRect.height - 80 + margin, startBlockY + deltaY));
        
        setBlocks(prev => prev.map(b => 
          b.id === blockId 
            ? { ...b, x: newX, y: newY }
            : b
        ));
      });
    };

    const handleMouseUp = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      setDraggedBlock(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Feedback tátil leve ao soltar
      if (navigator.vibrate) {
        navigator.vibrate([30]);
      }
      
      // Cursor volta ao normal
      document.body.style.cursor = 'default';
    };

    // Cursor de drag global
    document.body.style.cursor = 'grabbing';
    
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleDeleteBlock = (blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (block) {
      setBlocks(prev => prev.filter(b => b.id !== blockId));
      reorderBlocks(block.order);
    }
  };

  return (
    <div className="flex-1 overflow-hidden">
      <div
        ref={workspaceRef}
        className={`workspace-area h-full relative bg-gradient-to-br from-kid-blue/10 to-kid-purple/10 transition-colors duration-300 ${
          dragOver ? 'bg-kid-blue/20' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Grid Background Pattern */}
        <div 
          className="absolute inset-0 opacity-5" 
          style={{
            backgroundImage: 'radial-gradient(circle, hsl(212 80% 60%) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        {/* Logo Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img 
            src="/src/assets/618819.jpg" 
            alt="Logo" 
            className="w-4/5 h-4/5 object-contain opacity-5 select-none"
          />
        </div>
        
        {/* Welcome Message */}
        {showWelcome && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-white rounded-3xl p-8 shadow-playful max-w-md">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Comece sua aventura!</h3>
              <p className="text-gray-600 font-semibold mb-4">
                Arraste os blocos coloridos da esquerda para cá! Os números mostram a ordem de execução.
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
            className={`workspace-block absolute ${block.color} text-white p-3 rounded-lg shadow-block flex items-center group select-none min-w-[160px] ${
              draggedBlock === block.id 
                ? 'dragging z-20 opacity-95 cursor-grabbing' 
                : 'z-10 opacity-100 cursor-grab hover:cursor-grab'
            }`}
            style={{ left: block.x, top: block.y }}
            onMouseDown={(e) => handleBlockDrag(block.id, e)}
          >
            {/* Número da ordem */}
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold text-sm shadow-lg border-2 border-gray-300">
              {block.order}
            </div>
            
            {/* Botões de reordenação */}
            <div className="absolute -top-2 -right-2 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveBlockUp(block.id);
                }}
                className="w-6 h-6 bg-green-500 text-white rounded-full mb-1 flex items-center justify-center hover:bg-green-600 text-xs"
                disabled={block.order === 1}
              >
                ↑
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveBlockDown(block.id);
                }}
                className="w-6 h-6 bg-blue-500 text-white rounded-full mb-1 flex items-center justify-center hover:bg-blue-600 text-xs"
                disabled={block.order === Math.max(...blocks.map(b => b.order))}
              >
                ↓
              </button>
            </div>

            <span className="mr-2">{block.icon}</span>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{block.label}</span>
              {/* Mostrar valores dos inputs */}
              {block.inputs && block.inputs.length > 0 && (
                <div className="text-xs opacity-90 mt-1">
                  {block.inputs.map((input: any, index: number) => {
                    const value = input.value !== undefined ? input.value : input.default;
                    if (input.name === 'pin') {
                      return <span key={index}>Pino: {value}</span>;
                    } else if (input.name === 'button_pin') {
                      return <span key={index}>Botão: {value}</span>;
                    } else if (input.name === 'servo_pin') {
                      return <span key={index}>Servo: {value}</span>;
                    } else if (input.name === 'time') {
                      return <span key={index}>Tempo: {value}s</span>;
                    } else if (input.name === 'angle') {
                      return <span key={index}>Ângulo: {value}°</span>;
                    } else if (input.name === 'note') {
                      const noteNames: Record<string, string> = {
                        'C4': 'Dó', 'D4': 'Ré', 'E4': 'Mi', 'F4': 'Fá',
                        'G4': 'Sol', 'A4': 'Lá', 'B4': 'Si', 'C5': 'Dó agudo'
                      };
                      return <span key={index}>Nota: {noteNames[value] || value}</span>;
                    } else if (input.name === 'times') {
                      return <span key={index}>Repetir: {value}x</span>;
                    }
                    return null;
                  })}
                </div>
              )}
            </div>
            
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

        {/* Legenda da ordem */}
        {blocks.length > 0 && (
          <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg">
            <div className="text-sm font-semibold text-gray-700 mb-2">📋 Ordem de Execução:</div>
            <div className="text-xs text-gray-600">
              {[...blocks]
                .sort((a, b) => a.order - b.order)
                .map((block, index) => (
                  <div key={block.id} className="flex items-center mb-1">
                    <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold mr-2">
                      {block.order}
                    </span>
                    <span>{block.label}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
