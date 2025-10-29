const code = `void setup() {
  // Inicializar comunicação serial
  Serial.begin(9600);
  Serial.println("🚀 Arduino iniciado!");

  // Configurar pinos
  pinMode(13, OUTPUT);  // Pino 13
}
void loop() {
  // Código dos seus blocos
  digitalWrite(13, HIGH);   // Acender LED
  delay(4000);              // Esperar
  digitalWrite(13, LOW);    // Apagar LED
  delay(4000);              // Esperar
}`;

fetch('http://localhost:5000/api/compile', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({code, boardType: 'arduino:avr:uno'})
})
.then(r => r.json())
.then(d => {
  console.log('Status:', d.success ? '✅ Sucesso' : '❌ Erro');
  if (d.success) {
    const lines = d.hex.split('\n').length;
    console.log('Linhas hex:', lines);
    console.log('Tamanho aproximado:', d.hex.length, 'caracteres');
    console.log('Primeiras 3 linhas:');
    console.log(d.hex.split('\n').slice(0, 3).join('\n'));
  } else {
    console.log('Erro:', d.message);
  }
})
.catch(e => console.error('Erro:', e.message));