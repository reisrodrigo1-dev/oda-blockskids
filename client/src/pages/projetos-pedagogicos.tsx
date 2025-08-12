import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

// Firebase config
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

export default function ProjetosPedagogicos() {
  const [projetos, setProjetos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function fetchProjetos() {
      setCarregando(true);
      const querySnapshot = await getDocs(collection(db, "projetos-pedagogicos"));
      const lista: any[] = [];
      querySnapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });
      setProjetos(lista);
      setCarregando(false);
    }
    fetchProjetos();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-8 text-center">Projetos Pedagógicos</h1>
      {carregando && <div className="text-center text-gray-500">Carregando projetos...</div>}
      {!carregando && projetos.length === 0 && <div className="text-center text-gray-400">Nenhum projeto encontrado.</div>}
      <div className="space-y-8">
        {projetos.map((projeto) => (
          <Card key={projeto.id}>
            <CardHeader>
              <CardTitle>{projeto.titulo}</CardTitle>
              <div className="text-xs text-gray-400">Criado em: {new Date(projeto.criadoEm).toLocaleString()}</div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {projeto.etapas.map((etapa: any, idx: number) => (
                  <div key={idx} className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-400">
                    <h3 className="text-xl font-bold text-blue-600 mb-2">{etapa.titulo}</h3>
                    <p className="text-gray-700 mb-2"><span className="font-semibold">Atividade:</span> {etapa.atividade}</p>
                    <p className="text-gray-600"><span className="font-semibold">Habilidade:</span> {etapa.habilidade}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
