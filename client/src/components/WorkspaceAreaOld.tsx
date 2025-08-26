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

  const findNearbyBlocks = (blockId: string, x: number, y: number) => {
    const currentBlock = blocks.find(b => b.id === blockId);
    if (!currentBlock) return { above: null, below: null };

    console.log('Procurando blocos próximos para:', blockId, 'na posição:', { x, y });

    const SNAP_DISTANCE = 30;
    const nearbyBlocks = { above: null as WorkspaceBlock | null, below: null as WorkspaceBlock | null };

    blocks.forEach(block => {
      if (block.id === blockId) return;

      const dx = Math.abs(block.x - x);
      const dy = block.y - y;

      console.log('Verificando bloco:', block.id, 'distâncias:', { dx, dy });

      if (dx < SNAP_DISTANCE) {
        // Bloco acima
        if (dy < 0 && Math.abs(dy) < SNAP_DISTANCE + 40 && block.connectBottom && currentBlock.connectTop) {
          console.log('Bloco acima encontrado:', block.id);
          nearbyBlocks.above = block;
        }
        // Bloco abaixo
        if (dy > 40 && dy < SNAP_DISTANCE + 80 && currentBlock.connectBottom && block.connectTop) {
          console.log('Bloco abaixo encontrado:', block.id);
          nearbyBlocks.below = block;
        }
      }
    });

    return nearbyBlocks;
  };

  const connectBlocks = (parentId: string, childId: string) => {
    setBlocks(prev => prev.map(block => {
      if (block.id === parentId) {
        return {
          ...block,
          connections: {
            ...block.connections,
            children: [...(block.connections?.children || []), childId]
          }
        };
      }
      if (block.id === childId) {
        return {
          ...block,
          connections: {
            ...block.connections,
            parent: parentId
          }
        };
      }
      return block;
    }));
  };

  const disconnectBlock = (blockId: string) => {
    setBlocks(prev => prev.map(block => {
      if (block.connections?.children?.includes(blockId)) {
        return {
          ...block,
          connections: {
            ...block.connections,
            children: block.connections.children.filter(id => id !== blockId)
          }
        };
      }
      if (block.id === blockId) {
        return {
          ...block,
          connections: {
            ...block.connections,
            parent: undefined
          }
        };
      }
      return block;
    }));
  };

  const handleBlockDrag = (blockId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setDraggedBlock(blockId);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const block = blocks.find(b => b.id === blockId);
    
    if (!block) return;
    
    const startBlockX = block.x;
    const startBlockY = block.y;

    console.log('Iniciando drag do bloco:', blockId, 'posição:', { x: startBlockX, y: startBlockY });

    // Desconectar o bloco temporariamente
    disconnectBlock(blockId);

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const newX = startBlockX + deltaX;
      const newY = startBlockY + deltaY;
      
      setBlocks(prev => prev.map(b => 
        b.id === blockId 
          ? { ...b, x: newX, y: newY }
          : b
      ));

      // Verificar conexões próximas
      const nearby = findNearbyBlocks(blockId, newX, newY);
      
      if (nearby.above) {
        console.log('Bloco próximo acima encontrado:', nearby.above.id);
        setConnectionPreview({ from: nearby.above.id, to: blockId });
      } else if (nearby.below) {
        console.log('Bloco próximo abaixo encontrado:', nearby.below.id);
        setConnectionPreview({ from: blockId, to: nearby.below.id });
      } else {
        setConnectionPreview(null);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const newX = startBlockX + deltaX;
      const newY = startBlockY + deltaY;

      // Tentar conectar com blocos próximos
      const nearby = findNearbyBlocks(blockId, newX, newY);
      
      if (nearby.above) {
        console.log('Conectando com bloco acima:', nearby.above.id);
        // Conectar com bloco acima
        const snapY = nearby.above.y + 50; // Altura do bloco
        setBlocks(prev => prev.map(b => 
          b.id === blockId 
            ? { ...b, x: nearby.above!.x, y: snapY }
            : b
        ));
        connectBlocks(nearby.above.id, blockId);
      } else if (nearby.below) {
        console.log('Conectando com bloco abaixo:', nearby.below.id);
        // Conectar com bloco abaixo
        const snapY = newY;
        const belowSnapY = snapY + 50;
        setBlocks(prev => prev.map(b => {
          if (b.id === blockId) {
            return { ...b, x: nearby.below!.x, y: snapY };
          }
          if (b.id === nearby.below!.id) {
            return { ...b, x: nearby.below!.x, y: belowSnapY };
          }
          return b;
        }));
        connectBlocks(blockId, nearby.below.id);
      }

      setDraggedBlock(null);
      setConnectionPreview(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleDeleteBlock = (blockId: string) => {
    // Desconectar antes de deletar
    disconnectBlock(blockId);
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
          Área de Trabalho Mágica - Blocos Conectáveis
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
                Arraste os blocos coloridos da esquerda para cá e conecte eles para criar programas incríveis!
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

        {/* Connection Lines */}
        <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          {blocks.map(block => {
            if (block.connections?.children) {
              return block.connections.children.map(childId => {
                const childBlock = blocks.find(b => b.id === childId);
                if (!childBlock) return null;
                
                const startX = block.x + 80; // Centro do bloco pai
                const startY = block.y + 50; // Bottom do bloco pai
                const endX = childBlock.x + 80; // Centro do bloco filho
                const endY = childBlock.y; // Top do bloco filho
                
                return (
                  <line
                    key={`${block.id}-${childId}`}
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    stroke="#4F46E5"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                );
              });
            }
            return null;
          })}
          
          {/* Preview de conexão */}
          {connectionPreview && (() => {
            const fromBlock = blocks.find(b => b.id === connectionPreview.from);
            const toBlock = blocks.find(b => b.id === connectionPreview.to);
            if (!fromBlock || !toBlock) return null;
            
            return (
              <line
                x1={fromBlock.x + 80}
                y1={fromBlock.y + 50}
                x2={toBlock.x + 80}
                y2={toBlock.y}
                stroke="#10B981"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="5,5"
                className="animate-pulse"
              />
            );
          })()}
        </svg>

        {/* Rendered Blocks */}
        {blocks.map((block) => (
          <div
            key={block.id}
            className={`absolute bg-${block.color} text-white p-3 rounded-lg shadow-block cursor-move hover:shadow-lg transition-all duration-200 flex items-center group select-none min-w-[160px] ${
              draggedBlock === block.id ? 'z-20' : 'z-10'
            }`}
            style={{ left: block.x, top: block.y }}
            onMouseDown={(e) => handleBlockDrag(block.id, e)}
          >
            {/* Indicador de conexão superior */}
            {block.connectTop && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4">
                <div className="w-3 h-3 bg-white rounded-full border-2 border-gray-300 shadow-sm"></div>
              </div>
            )}
            
            {/* Indicador de conexão inferior */}
            {block.connectBottom && (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4">
                <div className="w-3 h-3 bg-white rounded-full border-2 border-gray-300 shadow-sm"></div>
              </div>
            )}

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
                    } else if (input.name === 'time') {
                      return <span key={index}>Tempo: {value}s</span>;
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
      </div>
    </div>
  );
}
