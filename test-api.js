console.log('Testando rota existente...');

fetch('http://localhost:5000/api/projects')
.then(response => {
  console.log('Status da resposta (/api/projects):', response.status);
  return response.json();
})
.then(data => {
  console.log('Resposta de /api/projects:', data);
})
.catch(error => {
  console.error('Erro em /api/projects:', error);
})
.then(() => {
  console.log('Agora testando API de compilação...');
  const testCode = {
    code: `void setup() {
  Serial.begin(9600);
}
void loop() {
  Serial.println("Hello");
  delay(1000);
}`,
    boardType: 'arduino:avr:uno'
  };

  return fetch('http://localhost:5000/api/compile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(testCode)
  });
})
.then(response => {
  console.log('Status da resposta (API):', response.status);
  return response.json();
})
.then(data => {
  console.log('Resposta da API:', data);
})
.catch(error => {
  console.error('Erro na API:', error);
});