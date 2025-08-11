import { useState } from "react";

interface Block {
  id: string;
  type: string;
  category: string;
  label: string;
  icon: string;
  color: string;
  inputs?: { name: string; type: string; default?: any }[];
}

const blockDefinitions: Block[] = [
  // Basic Blocks
  { id: 'setup', type: 'setup', category: 'basic', label: 'Iniciar programa', icon: '▶️', color: 'kid-blue' },
  { id: 'loop', type: 'loop', category: 'basic', label: 'Repetir sempre', icon: '🔄', color: 'kid-blue' },
  { id: 'delay', type: 'delay', category: 'basic', label: 'Esperar', icon: '⏰', color: 'kid-blue', inputs: [{ name: 'time', type: 'number', default: 1 }] },

  // LED Blocks
  { id: 'led_on', type: 'digital_write', category: 'led', label: 'Acender LED', icon: '💡', color: 'kid-orange', inputs: [{ name: 'pin', type: 'select', default: 13 }] },
  { id: 'led_off', type: 'digital_write', category: 'led', label: 'Apagar LED', icon: '🌑', color: 'kid-orange', inputs: [{ name: 'pin', type: 'select', default: 13 }] },

  // Motor Blocks
  { id: 'motor_on', type: 'motor_on', category: 'motor', label: 'Ligar motor', icon: '⚙️', color: 'kid-red', inputs: [{ name: 'pin', type: 'select', default: 9 }] },
  { id: 'motor_off', type: 'motor_off', category: 'motor', label: 'Desligar motor', icon: '⚙️', color: 'kid-red', inputs: [{ name: 'pin', type: 'select', default: 9 }] },

  // Sensor Blocks
  { id: 'button_pressed', type: 'digital_read', category: 'sensors', label: 'Se botão pressionado', icon: '👆', color: 'kid-green', inputs: [{ name: 'pin', type: 'select', default: 2 }] },
  { id: 'read_temperature', type: 'analog_read', category: 'sensors', label: 'Ler temperatura', icon: '🌡️', color: 'kid-green', inputs: [{ name: 'pin', type: 'select', default: 'A0' }] },

  // Control Blocks
  { id: 'if_then', type: 'if', category: 'control', label: 'Se... então...', icon: '❓', color: 'kid-purple' },
  { id: 'repeat_times', type: 'for', category: 'control', label: 'Repetir', icon: '🔁', color: 'kid-purple', inputs: [{ name: 'times', type: 'number', default: 10 }] },

  // Sound Blocks
  { id: 'play_tone', type: 'tone', category: 'sound', label: 'Tocar som', icon: '🔊', color: 'kid-pink', inputs: [{ name: 'note', type: 'select', default: 'C4' }] },
];

const categories = [
  { id: 'basic', name: 'BÁSICO', color: 'kid-blue' },
  { id: 'led', name: 'LEDS', color: 'kid-orange' },
  { id: 'motor', name: 'MOTORES', color: 'kid-red' },
  { id: 'sensors', name: 'SENSORES', color: 'kid-green' },
  { id: 'control', name: 'CONTROLE', color: 'kid-purple' },
  { id: 'sound', name: 'SOM', color: 'kid-pink' },
];

export default function BlockPalette() {
  const [draggedBlock, setDraggedBlock] = useState<Block | null>(null);

  const handleDragStart = (block: Block, e: React.DragEvent) => {
    setDraggedBlock(block);
    e.dataTransfer.effectAllowed = 'copy';
    
    // Captura valores dos inputs/selects no momento do drag
    const blockElement = e.currentTarget as HTMLElement;
    const updatedBlock = { ...block };
    
    if (block.inputs) {
      updatedBlock.inputs = block.inputs.map(input => {
        const inputElement = blockElement.querySelector(`select, input[type="number"]`) as HTMLInputElement | HTMLSelectElement;
        if (inputElement) {
          return { ...input, value: inputElement.value };
        }
        return input;
      });
    }
    
    e.dataTransfer.setData('application/json', JSON.stringify(updatedBlock));
    
    // Visual feedback
    const target = e.target as HTMLElement;
    target.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    target.style.opacity = '1';
    setDraggedBlock(null);
  };

  const renderInput = (input: any, blockId: string) => {
    if (input.type === 'number') {
      return (
        <input
          type="number"
          defaultValue={input.default}
          className="ml-2 w-12 px-1 py-1 rounded text-black text-xs"
          min="1"
          onClick={(e) => e.stopPropagation()}
        />
      );
    }
    
    if (input.type === 'select' && input.name === 'pin') {
      return (
        <select 
          className="ml-2 px-1 py-1 rounded text-black text-xs" 
          defaultValue={input.default}
          onClick={(e) => e.stopPropagation()}
        >
          {input.name === 'pin' && typeof input.default === 'number' ? (
            <>
              <option value="13">Pino 13</option>
              <option value="12">Pino 12</option>
              <option value="11">Pino 11</option>
              <option value="2">Pino 2</option>
              <option value="3">Pino 3</option>
              <option value="4">Pino 4</option>
            </>
          ) : (
            <>
              <option value="A0">A0</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
            </>
          )}
        </select>
      );
    }
    
    if (input.type === 'select' && input.name === 'note') {
      return (
        <select className="ml-2 px-1 py-1 rounded text-black text-xs" onClick={(e) => e.stopPropagation()}>
          <option value="C4">Dó (C4)</option>
          <option value="D4">Ré (D4)</option>
          <option value="E4">Mi (E4)</option>
          <option value="F4">Fá (F4)</option>
          <option value="G4">Sol (G4)</option>
          <option value="A4">Lá (A4)</option>
          <option value="B4">Si (B4)</option>
          <option value="C5">Dó agudo (C5)</option>
        </select>
      );
    }
    
    return null;
  };

  return (
    <div className="w-80 bg-white shadow-lg border-r-2 border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <svg className="w-5 h-5 text-kid-purple mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
          </svg>
          Blocos Mágicos
        </h2>
        
        <div className="space-y-4">
          {categories.map((category) => {
            const categoryBlocks = blockDefinitions.filter(block => block.category === category.id);
            
            return (
              <div key={category.id} className="block-category">
                <h3 className="font-bold text-sm text-gray-700 mb-2 flex items-center">
                  <div className={`w-4 h-4 rounded mr-2 bg-${category.color}`}></div>
                  {category.name}
                </h3>
                <div className="space-y-2">
                  {categoryBlocks.map((block) => (
                    <div
                      key={block.id}
                      draggable
                      onDragStart={(e) => handleDragStart(block, e)}
                      onDragEnd={handleDragEnd}
                      className={`drag-block bg-${block.color} text-white p-3 rounded-lg shadow-block cursor-grab hover:shadow-lg transition-all duration-200 flex items-center select-none`}
                    >
                      <span className="mr-2">{block.icon}</span>
                      <span className="font-semibold text-sm">{block.label}</span>
                      {block.inputs?.map((input, index) => (
                        <span key={index}>
                          {renderInput(input, block.id)}
                          {input.name === 'time' && <span className="ml-1 text-xs">seg</span>}
                          {input.name === 'times' && <span className="ml-1 text-xs">vezes</span>}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
