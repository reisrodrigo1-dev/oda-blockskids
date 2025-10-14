// Blockly configuration and custom blocks
// This would integrate with the actual Blockly library

export interface BlockDefinition {
  type: string;
  message0: string;
  args0?: any[];
  colour: number;
  tooltip: string;
  helpUrl: string;
  previousStatement?: boolean;
  nextStatement?: boolean;
  output?: string;
}

export const customBlocks: Record<string, BlockDefinition> = {
  'arduino_setup': {
    type: 'arduino_setup',
    message0: '🚀 Iniciar programa %1 %2',
    args0: [
      { type: 'input_dummy' },
      { type: 'input_statement', name: 'SETUP' }
    ],
    colour: 210,
    tooltip: 'Bloco de inicialização do Arduino',
    helpUrl: '',
  },

  'arduino_loop': {
    type: 'arduino_loop',
    message0: '🔄 Repetir sempre %1 %2',
    args0: [
      { type: 'input_dummy' },
      { type: 'input_statement', name: 'LOOP' }
    ],
    colour: 210,
    tooltip: 'Bloco que repete para sempre',
    helpUrl: '',
    previousStatement: true,
    nextStatement: true,
  },

  'arduino_delay': {
    type: 'arduino_delay',
    message0: '⏰ Esperar %1 segundos',
    args0: [
      { type: 'field_number', name: 'TIME', value: 1, min: 0.1, precision: 0.1 }
    ],
    colour: 210,
    tooltip: 'Esperar um tempo específico',
    helpUrl: '',
    previousStatement: true,
    nextStatement: true,
  },

  'arduino_digital_write': {
    type: 'arduino_digital_write',
    message0: '💡 %1 LED no pino %2',
    args0: [
      { type: 'field_dropdown', name: 'STATE', options: [['Acender', 'HIGH'], ['Apagar', 'LOW']] },
      { type: 'field_dropdown', name: 'PIN', options: [['13', '13'], ['12', '12'], ['11', '11'], ['10', '10']] }
    ],
    colour: 35,
    tooltip: 'Controlar LED digital',
    helpUrl: '',
    previousStatement: true,
    nextStatement: true,
  },

  'arduino_digital_read': {
    type: 'arduino_digital_read',
    message0: '👆 Botão no pino %1 pressionado?',
    args0: [
      { type: 'field_dropdown', name: 'PIN', options: [['2', '2'], ['3', '3'], ['4', '4']] }
    ],
    colour: 120,
    tooltip: 'Ler estado de um botão',
    helpUrl: '',
    output: 'Boolean',
  },

  'arduino_if': {
    type: 'arduino_if',
    message0: '❓ Se %1 então %2 %3',
    args0: [
      { type: 'input_value', name: 'CONDITION', check: 'Boolean' },
      { type: 'input_dummy' },
      { type: 'input_statement', name: 'DO' }
    ],
    colour: 230,
    tooltip: 'Executar ações condicionalmente',
    helpUrl: '',
    previousStatement: true,
    nextStatement: true,
  },

  'arduino_for': {
    type: 'arduino_for',
    message0: '🔁 Repetir %1 vezes %2 %3',
    args0: [
      { type: 'field_number', name: 'TIMES', value: 10, min: 1 },
      { type: 'input_dummy' },
      { type: 'input_statement', name: 'DO' }
    ],
    colour: 230,
    tooltip: 'Repetir ações um número específico de vezes',
    helpUrl: '',
    previousStatement: true,
    nextStatement: true,
  },

  'arduino_tone': {
    type: 'arduino_tone',
    message0: '🔊 Tocar nota %1 no pino %2',
    args0: [
      { type: 'field_dropdown', name: 'NOTE', options: [['Dó', '262'], ['Ré', '294'], ['Mi', '330'], ['Fá', '349']] },
      { type: 'field_dropdown', name: 'PIN', options: [['8', '8'], ['9', '9']] }
    ],
    colour: 340,
    tooltip: 'Tocar uma nota musical',
    helpUrl: '',
    previousStatement: true,
    nextStatement: true,
  },
};

export const toolboxConfig = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Básico',
      colour: '210',
      contents: [
        { kind: 'block', type: 'arduino_setup' },
        { kind: 'block', type: 'arduino_loop' },
        { kind: 'block', type: 'arduino_delay' },
      ],
    },
    {
      kind: 'category',
      name: 'LEDs',
      colour: '35',
      contents: [
        { kind: 'block', type: 'arduino_digital_write' },
      ],
    },
    {
      kind: 'category',
      name: 'Sensores',
      colour: '120',
      contents: [
        { kind: 'block', type: 'arduino_digital_read' },
      ],
    },
    {
      kind: 'category',
      name: 'Controle',
      colour: '230',
      contents: [
        { kind: 'block', type: 'arduino_if' },
        { kind: 'block', type: 'arduino_for' },
      ],
    },
    {
      kind: 'category',
      name: 'Som',
      colour: '340',
      contents: [
        { kind: 'block', type: 'arduino_tone' },
      ],
    },
  ],
};
