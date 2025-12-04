const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, updateDoc, doc } = require('firebase/firestore');

// Configuração do Firebase (copiada do arquivo firebase.ts)
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

async function migrateTurmasToAddCodigo() {
  try {
    console.log('Iniciando migração de turmas para adicionar campo codigo...');

    const turmasSnapshot = await getDocs(collection(db, 'turmas'));
    const turmasToUpdate = [];

    for (const docSnap of turmasSnapshot.docs) {
      const turma = docSnap.data();

      // Verificar se a turma não tem o campo codigo
      if (!turma.codigo) {
        // Gerar um código único baseado no nome da turma
        const baseNome = turma.nome.toLowerCase()
          .replace(/[^a-z0-9]/g, '') // Remove caracteres especiais
          .substring(0, 8); // Limita a 8 caracteres

        // Adicionar timestamp para garantir unicidade
        const timestamp = Date.now().toString().slice(-4);
        const codigo = `${baseNome}${timestamp}`.toUpperCase();

        turmasToUpdate.push({
          id: docSnap.id,
          codigo: codigo
        });
      }
    }

    console.log(`Encontradas ${turmasToUpdate.length} turmas para atualizar`);

    // Atualizar as turmas em lote
    for (const turma of turmasToUpdate) {
      await updateDoc(doc(db, 'turmas', turma.id), {
        codigo: turma.codigo
      });
      console.log(`Turma ${turma.id} atualizada com código: ${turma.codigo}`);
    }

    console.log('Migração concluída com sucesso!');
    return { success: true, updated: turmasToUpdate.length };

  } catch (error) {
    console.error('Erro durante a migração:', error);
    return { success: false, error: error.message };
  }
}

// Executar a migração
migrateTurmasToAddCodigo().then(result => {
  console.log('Resultado da migração:', result);
  process.exit(result.success ? 0 : 1);
});