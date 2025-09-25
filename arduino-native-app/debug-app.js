// debug-app.js - Script para debugar o app nativo diretamente
const { ArduinoUploader } = require('./app.js');

// Código de teste
const testCode = `
void setup() {
  Serial.begin(9600);
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
  Serial.println("LED blinked!");
}
`;

console.log('🧪 Iniciando teste direto do app nativo...');

// Simular mensagem da extensão
const testMessage = {
  action: 'upload',
  code: testCode,
  board: 'arduino:avr:uno',
  port: 'COM3'  // Ou a porta onde seu Arduino está conectado
};

console.log('📨 Mensagem de teste:', JSON.stringify(testMessage, null, 2));

// Criar instância do uploader e testar
const uploader = new (require('./app.js'))();
uploader.handleMessage(testMessage);
