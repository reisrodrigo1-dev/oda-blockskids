import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, getDoc, doc } from "firebase/firestore";

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

export default function DebugRotas() {
  const [rotas, setRotas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarRotas();
  }, []);

  const carregarRotas = async () => {
    try {
      console.log("🔍 Carregando todas as rotas de estudo...");
      const rotasSnapshot = await getDocs(collection(db, "rotasEstudo"));
      const rotasData = rotasSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log("📚 Rotas encontradas:", rotasData);
      setRotas(rotasData);
    } catch (error) {
      console.error("❌ Erro ao carregar rotas:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-white">Carregando rotas...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Debug - Rotas de Estudo</h1>
      
      <div className="space-y-6">
        {rotas.map((rota, index) => (
          <div key={rota.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-blue-400 mb-3">
              {index + 1}. {rota.titulo || rota.nome || 'Sem título'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>ID:</strong> {rota.id}
              </div>
              <div>
                <strong>Código:</strong> {rota.codigo}
              </div>
              <div>
                <strong>Cliente ID:</strong> {rota.clienteId}
              </div>
              <div>
                <strong>Total de Projetos:</strong> {rota.projetos?.length || 0}
              </div>
            </div>
            
            {rota.projetos && rota.projetos.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold text-green-400 mb-2">Projetos:</h3>
                <div className="bg-gray-700 p-3 rounded max-h-40 overflow-y-auto">
                  {rota.projetos.map((projeto: any, idx: number) => (
                    <div key={idx} className="mb-2 pb-2 border-b border-gray-600 last:border-b-0">
                      <div className="text-yellow-300 font-medium">{projeto.titulo}</div>
                      <div className="text-gray-300 text-xs">{projeto.descricao}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {(!rota.projetos || rota.projetos.length === 0) && (
              <div className="mt-4 text-red-400">
                ⚠️ Esta rota não tem projetos definidos
              </div>
            )}
          </div>
        ))}
      </div>
      
      {rotas.length === 0 && (
        <div className="text-center text-red-400 mt-8">
          ❌ Nenhuma rota de estudo encontrada no banco de dados
        </div>
      )}
    </div>
  );
}
