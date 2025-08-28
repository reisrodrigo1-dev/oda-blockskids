// Arduino code generation from blocks

interface Block {
  id: string;
  type: string;
  label: string;
  inputs?: any[];
}

export function generateArduinoCode(blocks: Block[]): string {
  if (blocks.length === 0) {
    return `// Código Arduino gerado pelos blocos
// 🎨 Criado com Arduino Blocks Kids

void setup() {
  // Inicializar comunicação serial
  Serial.begin(9600);
  Serial.println("🚀 Arduino iniciado!");
  
  // Configurar pinos
  pinMode(13, OUTPUT);  // LED no pino 13
}

void loop() {
  // Seu código aparecerá aqui quando você
  // arrastar os blocos para o workspace!
  
  // Exemplo: Piscar LED
  digitalWrite(13, HIGH);   // Acender LED
  delay(1000);              // Esperar 1 segundo
  digitalWrite(13, LOW);    // Apagar LED
  delay(1000);              // Esperar 1 segundo
}`;
  }

  let setupCode = '';
  let loopCode = '';
  let hasSerialInit = false;
  let usedPins = new Set<string>();
  let usesServo = false;

  // Process blocks and generate code
  blocks.forEach(block => {
    switch (block.type) {
      case 'setup':
        hasSerialInit = true;
        break;

      case 'digital_write':
        // Tenta pegar o pino do bloco (inputs)
        let pin = '13'; // Default pin
        if (block.inputs && block.inputs.length > 0) {
          const pinInput = block.inputs.find((input: any) => input.name === 'pin');
          if (pinInput) {
            if (pinInput.value !== undefined && pinInput.value !== null && pinInput.value !== '') {
              pin = String(pinInput.value);
            } else if (pinInput.default !== undefined) {
              pin = String(pinInput.default);
            }
          }
        }
        const state = block.label.includes('Acender') ? 'HIGH' : 'LOW';
        usedPins.add(pin);
        loopCode += `  digitalWrite(${pin}, ${state});   // ${block.label}\n`;
        break;

      case 'blink_led':
        // Piscar LED: HIGH -> delay -> LOW -> delay
        let blinkPin = '13'; // Default pin
        let blinkTime = '1000'; // Default 1 second in milliseconds
        
        if (block.inputs && block.inputs.length > 0) {
          const pinInput = block.inputs.find((input: any) => input.name === 'pin');
          if (pinInput) {
            if (pinInput.value !== undefined && pinInput.value !== null && pinInput.value !== '') {
              blinkPin = String(pinInput.value);
            } else if (pinInput.default !== undefined) {
              blinkPin = String(pinInput.default);
            }
          }
          
          const timeInput = block.inputs.find((input: any) => input.name === 'time');
          if (timeInput) {
            if (timeInput.value !== undefined && timeInput.value !== null && timeInput.value !== '') {
              // Se o usuário colocou em segundos, converte para ms
              blinkTime = String(Number(timeInput.value) * 1000);
            } else if (timeInput.default !== undefined) {
              blinkTime = String(Number(timeInput.default) * 1000);
            }
          }
        }
        
        usedPins.add(blinkPin);
        loopCode += `  digitalWrite(${blinkPin}, HIGH);   // Acender LED\n`;
        loopCode += `  delay(${blinkTime});              // Esperar\n`;
        loopCode += `  digitalWrite(${blinkPin}, LOW);    // Apagar LED\n`;
        loopCode += `  delay(${blinkTime});              // Esperar\n`;
        break;

      case 'delay':
        let time = '1000'; // Default 1 second in milliseconds
        if (block.inputs && block.inputs.length > 0) {
          const timeInput = block.inputs.find((input: any) => input.name === 'time');
          if (timeInput) {
            if (timeInput.value !== undefined && timeInput.value !== null && timeInput.value !== '') {
              // Se o usuário colocou em segundos, converte para ms
              time = String(Number(timeInput.value) * 1000);
            } else if (timeInput.default !== undefined) {
              time = String(Number(timeInput.default) * 1000);
            }
          }
        }
        loopCode += `  delay(${time});              // Esperar\n`;
        break;

      case 'motor_on':
        // Ligar motor no pino selecionado
        let motorPin = '9'; // Default pin
        if (block.inputs && block.inputs.length > 0) {
          const pinInput = block.inputs.find((input: any) => input.name === 'pin');
          if (pinInput) {
            if (pinInput.value !== undefined && pinInput.value !== null && pinInput.value !== '') {
              motorPin = String(pinInput.value);
            } else if (pinInput.default !== undefined) {
              motorPin = String(pinInput.default);
            }
          }
        }
        usedPins.add(motorPin);
        loopCode += `  digitalWrite(${motorPin}, HIGH);   // Ligar motor\n`;
        break;

      case 'motor_off':
        // Desligar motor no pino selecionado
        let motorPinOff = '9'; // Default pin
        if (block.inputs && block.inputs.length > 0) {
          const pinInput = block.inputs.find((input: any) => input.name === 'pin');
          if (pinInput) {
            if (pinInput.value !== undefined && pinInput.value !== null && pinInput.value !== '') {
              motorPinOff = String(pinInput.value);
            } else if (pinInput.default !== undefined) {
              motorPinOff = String(pinInput.default);
            }
          }
        }
        usedPins.add(motorPinOff);
        loopCode += `  digitalWrite(${motorPinOff}, LOW);   // Desligar motor\n`;
        break;

      case 'servo_write':
        // Mover servo para o ângulo especificado
        let servoPin = '9'; // Default pin
        let angle = '90'; // Default angle
        
        console.log('Processando servo_write, inputs:', block.inputs);
        
        if (block.inputs && block.inputs.length > 0) {
          const pinInput = block.inputs.find((input: any) => input.name === 'pin');
          if (pinInput) {
            if (pinInput.value !== undefined && pinInput.value !== null && pinInput.value !== '') {
              servoPin = String(pinInput.value);
            } else if (pinInput.default !== undefined) {
              servoPin = String(pinInput.default);
            }
          }
          
          const angleInput = block.inputs.find((input: any) => input.name === 'angle');
          if (angleInput) {
            console.log('angleInput encontrado:', angleInput);
            if (angleInput.value !== undefined && angleInput.value !== null && angleInput.value !== '') {
              angle = String(angleInput.value);
              console.log('Usando valor do input:', angle);
            } else if (angleInput.default !== undefined) {
              angle = String(angleInput.default);
              console.log('Usando valor padrão:', angle);
            }
          }
        }
        
        console.log('Servo final - Pin:', servoPin, 'Angle:', angle);
        
        usedPins.add(servoPin);
        usesServo = true;
        loopCode += `  servo${servoPin}.write(${angle});   // Mover servo para ${angle}°\n`;
        break;

      case 'digital_read':
        const inputPin = '2'; // Default pin
        usedPins.add(inputPin);
        loopCode += `  if (digitalRead(${inputPin}) == HIGH) {\n`;
        loopCode += `    // Botão pressionado\n`;
        loopCode += `  }\n`;
        break;

      case 'button_servo':
        // Controle de servo por botão
        let buttonPin = '2'; // Default button pin
        let servoControlPin = '9'; // Default servo pin
        let servoAngle = '90'; // Default angle
        
        console.log('Processando button_servo, inputs:', block.inputs);
        
        if (block.inputs && block.inputs.length > 0) {
          const buttonPinInput = block.inputs.find((input: any) => input.name === 'button_pin');
          if (buttonPinInput) {
            if (buttonPinInput.value !== undefined && buttonPinInput.value !== null && buttonPinInput.value !== '') {
              buttonPin = String(buttonPinInput.value);
            } else if (buttonPinInput.default !== undefined) {
              buttonPin = String(buttonPinInput.default);
            }
          }
          
          const servoPinInput = block.inputs.find((input: any) => input.name === 'servo_pin');
          if (servoPinInput) {
            if (servoPinInput.value !== undefined && servoPinInput.value !== null && servoPinInput.value !== '') {
              servoControlPin = String(servoPinInput.value);
            } else if (servoPinInput.default !== undefined) {
              servoControlPin = String(servoPinInput.default);
            }
          }
          
          const angleInput = block.inputs.find((input: any) => input.name === 'angle');
          if (angleInput) {
            console.log('angleInput encontrado:', angleInput);
            if (angleInput.value !== undefined && angleInput.value !== null && angleInput.value !== '') {
              servoAngle = String(angleInput.value);
              console.log('Usando valor do input:', servoAngle);
            } else if (angleInput.default !== undefined) {
              servoAngle = String(angleInput.default);
              console.log('Usando valor padrão:', servoAngle);
            }
          }
        }
        
        console.log('Button-Servo final - ButtonPin:', buttonPin, 'ServoPin:', servoControlPin, 'Angle:', servoAngle);
        
        usedPins.add(buttonPin);
        usedPins.add(servoControlPin);
        usesServo = true;
        loopCode += `  if (digitalRead(${buttonPin}) == HIGH) {\n`;
        loopCode += `    servo${servoControlPin}.write(${servoAngle});   // Mover servo para ${servoAngle}° quando botão pressionado\n`;
        loopCode += `    delay(500);   // Debounce do botão\n`;
        loopCode += `  }\n`;
        break;

      case 'if':
        loopCode += `  if (true) {  // Condição\n`;
        loopCode += `    // Ações condicionais\n`;
        loopCode += `  }\n`;
        break;

      case 'for':
        loopCode += `  for (int i = 0; i < 10; i++) {  // Repetir\n`;
        loopCode += `    // Ações repetidas\n`;
        loopCode += `  }\n`;
        break;

      case 'tone':
        // Tenta pegar o pino e a nota do bloco (inputs)
        let tonePin = '8'; // Default pin
        let frequency = '262'; // Default C4 note
        
        if (block.inputs && block.inputs.length > 0) {
          const pinInput = block.inputs.find((input: any) => input.name === 'pin');
          if (pinInput) {
            if (pinInput.value !== undefined && pinInput.value !== null && pinInput.value !== '') {
              tonePin = String(pinInput.value);
            } else if (pinInput.default !== undefined) {
              tonePin = String(pinInput.default);
            }
          }
          
          const noteInput = block.inputs.find((input: any) => input.name === 'note');
          if (noteInput) {
            let selectedNote = noteInput.default;
            if (noteInput.value !== undefined && noteInput.value !== null && noteInput.value !== '') {
              selectedNote = noteInput.value;
            }
            
            // Mapear notas para frequências
            const noteFrequencies: Record<string, string> = {
              'C4': '262',  // Dó
              'D4': '294',  // Ré
              'E4': '330',  // Mi
              'F4': '349',  // Fá
              'G4': '392',  // Sol
              'A4': '440',  // Lá
              'B4': '494',  // Si
              'C5': '523'   // Dó agudo
            };
            
            frequency = noteFrequencies[selectedNote] || '262';
          }
        }
        
        usedPins.add(tonePin);
        loopCode += `  tone(${tonePin}, ${frequency}, 500);  // Tocar ${block.inputs?.find((i: any) => i.name === 'note')?.value || 'C4'}\n`;
        loopCode += `  delay(500);\n`;
        break;

      default:
        loopCode += `  // ${block.label}\n`;
    }
  });

  // Generate setup section
  let includes = ``;
  let globalDeclarations = ``;
  
  if (usesServo) {
    includes += `#include <Servo.h>\n`;
    // Criar objetos servo para cada pino usado
    usedPins.forEach(pin => {
      if (blocks.some(b => b.type === 'servo_write' && 
          b.inputs?.find(i => i.name === 'pin')?.value == pin || 
          b.inputs?.find(i => i.name === 'pin')?.default == pin)) {
        globalDeclarations += `Servo servo${pin};\n`;
      }
    });
    includes += `\n`;
  }

  let setup = `void setup() {\n`;
  
  if (hasSerialInit || blocks.length > 0) {
    setup += `  // Inicializar comunicação serial\n`;
    setup += `  Serial.begin(9600);\n`;
    setup += `  Serial.println("🚀 Arduino iniciado!");\n`;
    setup += `  \n`;
  }

  if (usedPins.size > 0) {
    setup += `  // Configurar pinos\n`;
    usedPins.forEach(pin => {
      // Verificar se este pino é usado para servo
      const isServoPin = blocks.some(b => b.type === 'servo_write' && 
        (b.inputs?.find(i => i.name === 'pin')?.value == pin || 
         b.inputs?.find(i => i.name === 'pin')?.default == pin));
      
      if (isServoPin) {
        setup += `  servo${pin}.attach(${pin});  // Servo no pino ${pin}\n`;
      } else if (['13', '12', '11', '10', '9', '8'].includes(pin)) {
        setup += `  pinMode(${pin}, OUTPUT);  // Pino ${pin}\n`;
      } else {
        setup += `  pinMode(${pin}, INPUT_PULLUP);  // Pino ${pin}\n`;
      }
    });
  }

  setup += `}`;

  // Generate loop section
  let loop = `\nvoid loop() {\n`;
  if (loopCode) {
    loop += `  // Código dos seus blocos\n`;
    loop += loopCode;
  } else {
    loop += `  // Adicione blocos para gerar código aqui!\n`;
  }
  loop += `}`;

  return `// Código Arduino gerado pelos blocos
// 🎨 Criado com Arduino Blocks Kids
// Blocos usados: ${blocks.length}

${includes}${globalDeclarations}${setup}${loop}`;
}

export function validateBlockConnection(sourceBlock: Block, targetBlock: Block): boolean {
  // Basic validation rules for block connections
  const validConnections: Record<string, string[]> = {
    'setup': ['digital_write', 'delay', 'if', 'for'],
    'loop': ['digital_write', 'delay', 'if', 'for', 'tone'],
    'if': ['digital_write', 'delay', 'tone'],
    'for': ['digital_write', 'delay', 'tone'],
  };

  return validConnections[sourceBlock.type]?.includes(targetBlock.type) || false;
}

export function getBlockCategory(blockType: string): string {
  const categories: Record<string, string> = {
    'setup': 'basic',
    'loop': 'basic',
    'delay': 'basic',
    'digital_write': 'led',
    'blink_led': 'led',
    'digital_read': 'sensors',
    'button_servo': 'sensors',
    'if': 'control',
    'for': 'control',
    'tone': 'sound',
    'motor_on': 'motor',
    'motor_off': 'motor',
    'servo_write': 'motor',
  };

  return categories[blockType] || 'unknown';
}
