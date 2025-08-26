import { getFirestore, collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";

import { Firestore } from "firebase/firestore";

export async function getProfessoresByClienteId(db: Firestore, clienteId: string) {
  const professoresQuery = query(
    collection(db, "professores"),
    where("clienteId", "==", clienteId)
  );
  const snap = await getDocs(professoresQuery);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function updateProfessorSenha(db: Firestore, professorId: string, novaSenha: string) {
  await updateDoc(doc(db, "professores", professorId), { senha: novaSenha });
}
