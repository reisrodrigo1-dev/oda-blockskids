import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWRarkiBugYjwdmrwocbLT5K301iSbwP8",
  authDomain: "oda-blockskids.firebaseapp.com",
  projectId: "oda-blockskids",
  storageBucket: "oda-blockskids.appspot.com",
  messagingSenderId: "567014936342",
  appId: "1:567014936342:web:88c733b99cb5b1d62e0a37",
  measurementId: "G-TCMP1KJK0H"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para criar dados de teste
export async function criarDadosTeste() {
  try {
    console.log("Criando cliente de teste...");
    
    // 1. Criar cliente de teste
    const clienteRef = await addDoc(collection(db, "clientes"), {
      razaoSocial: "Escola Estadual Dom Pedro II",
      nomeFantasia: "Colégio Dom Pedro",
      email: "contato@dompedro.edu.br",
      telefone: "(11) 3333-4444",
      cnpj: "12.345.678/0001-90",
      ativo: true,
      criadoEm: new Date()
    });
    
    console.log("Cliente criado:", clienteRef.id);

    // 2. Criar rota de estudo com projetos
    const rotaRef = await addDoc(collection(db, "rotasEstudo"), {
      clienteId: clienteRef.id,
      titulo: "Programação Arduino - 6º Ano",
      descricao: "Curso introdutório de programação com Arduino para alunos do 6º ano",
      codigo: "DOM001",
      ativo: true,
      criadoEm: new Date(),
      projetos: [
        {
          titulo: "LED Piscante",
          descricao: "Aprenda a fazer um LED piscar usando programação por blocos",
          dificuldade: "facil",
          tipo: "basico",
          blocos: [
            {
              id: "1",
              type: "setup",
              data: {}
            },
            {
              id: "2", 
              type: "digital_write",
              data: { pin: 13, value: "HIGH" }
            },
            {
              id: "3",
              type: "delay",
              data: { time: 1000 }
            },
            {
              id: "4",
              type: "digital_write", 
              data: { pin: 13, value: "LOW" }
            },
            {
              id: "5",
              type: "delay",
              data: { time: 1000 }
            }
          ],
          codigo: `void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW); 
  delay(1000);
}`
        },
        {
          titulo: "Semáforo Simples",
          descricao: "Crie um semáforo com LEDs vermelho, amarelo e verde",
          dificuldade: "medio",
          tipo: "intermediario",
          blocos: [
            {
              id: "1",
              type: "setup",
              data: {}
            },
            {
              id: "2",
              type: "digital_write",
              data: { pin: 13, value: "HIGH" } // Vermelho
            },
            {
              id: "3", 
              type: "delay",
              data: { time: 3000 }
            },
            {
              id: "4",
              type: "digital_write",
              data: { pin: 13, value: "LOW" }
            },
            {
              id: "5",
              type: "digital_write", 
              data: { pin: 12, value: "HIGH" } // Amarelo
            },
            {
              id: "6",
              type: "delay",
              data: { time: 1000 }
            },
            {
              id: "7",
              type: "digital_write",
              data: { pin: 12, value: "LOW" }
            },
            {
              id: "8",
              type: "digital_write",
              data: { pin: 11, value: "HIGH" } // Verde
            },
            {
              id: "9",
              type: "delay", 
              data: { time: 3000 }
            },
            {
              id: "10",
              type: "digital_write",
              data: { pin: 11, value: "LOW" }
            }
          ],
          codigo: `void setup() {
  pinMode(13, OUTPUT); // Vermelho
  pinMode(12, OUTPUT); // Amarelo
  pinMode(11, OUTPUT); // Verde
}

void loop() {
  // Vermelho
  digitalWrite(13, HIGH);
  delay(3000);
  digitalWrite(13, LOW);
  
  // Amarelo
  digitalWrite(12, HIGH);
  delay(1000);
  digitalWrite(12, LOW);
  
  // Verde
  digitalWrite(11, HIGH);
  delay(3000);
  digitalWrite(11, LOW);
}`
        },
        {
          titulo: "Servo Motor Controlado",
          descricao: "Controle um servo motor para mover em diferentes ângulos",
          dificuldade: "dificil",
          tipo: "avancado",
          blocos: [
            {
              id: "1",
              type: "setup",
              data: {}
            },
            {
              id: "2",
              type: "servo_attach",
              data: { pin: 9 }
            },
            {
              id: "3",
              type: "servo_write",
              data: { pin: 9, angle: 0 }
            },
            {
              id: "4",
              type: "delay",
              data: { time: 1000 }
            },
            {
              id: "5",
              type: "servo_write",
              data: { pin: 9, angle: 90 }
            },
            {
              id: "6",
              type: "delay",
              data: { time: 1000 }
            },
            {
              id: "7",
              type: "servo_write",
              data: { pin: 9, angle: 180 }
            },
            {
              id: "8",
              type: "delay",
              data: { time: 1000 }
            }
          ],
          codigo: `#include <Servo.h>

Servo servo9;

void setup() {
  servo9.attach(9);
}

void loop() {
  servo9.write(0);
  delay(1000);
  servo9.write(90);
  delay(1000);
  servo9.write(180);
  delay(1000);
}`
        }
      ]
    });
    
    console.log("Rota de estudo criada:", rotaRef.id);
    console.log("Dados de teste criados com sucesso!");
    
    return {
      clienteId: clienteRef.id,
      rotaId: rotaRef.id,
      codigoTurma: "DOM001"
    };
    
  } catch (error) {
    console.error("Erro ao criar dados de teste:", error);
    throw error;
  }
}

// Para usar no console do navegador:
// window.criarDadosTeste = criarDadosTeste;
