// Sketch Receptor para Arduino Blocks Kids
// Carregue este sketch no Arduino primeiro, depois use "Enviar via Serial" no navegador

String receivedCode = "";
bool receivingCode = false;

void setup() {
  Serial.begin(9600);
  Serial.println("🚀 Arduino Blocks Kids - Receptor Pronto!");
  Serial.println("Aguardando código via serial...");
  pinMode(13, OUTPUT); // LED para indicar status
}

void loop() {
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    command.trim();

    if (command == "UPLOAD_START") {
      receivingCode = true;
      receivedCode = "";
      Serial.println("📥 Iniciando recebimento de código...");
      digitalWrite(13, HIGH); // LED aceso durante recebimento
    }
    else if (command == "UPLOAD_END") {
      receivingCode = false;
      Serial.println("✅ Código recebido!");
      Serial.println("📄 Código recebido:");
      Serial.println(receivedCode);
      Serial.println("💡 Para executar: copie o código acima para um novo sketch no Arduino IDE");
      digitalWrite(13, LOW); // LED apagado
    }
    else if (receivingCode) {
      receivedCode += command + "\n";
      Serial.print("📝 Recebido: ");
      Serial.println(command);
    }
    else {
      // Comandos simples para teste
      if (command == "LED_ON") {
        digitalWrite(13, HIGH);
        Serial.println("✅ LED ligado!");
      }
      else if (command == "LED_OFF") {
        digitalWrite(13, LOW);
        Serial.println("✅ LED desligado!");
      }
      else if (command == "BLINK") {
        for (int i = 0; i < 5; i++) {
          digitalWrite(13, HIGH);
          delay(200);
          digitalWrite(13, LOW);
          delay(200);
        }
        Serial.println("✅ LED piscou 5 vezes!");
      }
      else {
        Serial.print("❓ Comando desconhecido: ");
        Serial.println(command);
        Serial.println("💡 Comandos disponíveis: LED_ON, LED_OFF, BLINK");
      }
    }
  }
}