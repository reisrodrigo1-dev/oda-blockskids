import { useEffect, useState } from "react";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "./DashboardLayout";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

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

interface Projeto {
  id: string;
  titulo: string;
}

interface ProjetoSelecionado extends Projeto {
  ordem: number;
}

export default function CriarRotaEstudos() {
  const [nome, setNome] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [selecionados, setSelecionados] = useState<ProjetoSelecionado[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function fetchProjetos() {
      const snap = await getDocs(collection(db, "projetos-pedagogicos-avancados"));
      const lista: Projeto[] = [];
      snap.forEach(doc => {
        const data = doc.data();
        lista.push({ id: doc.id, titulo: data.titulo || "(Sem título)" });
      });
      setProjetos(lista);
    }
    fetchProjetos();
  }, []);

  function toggleProjeto(projeto: Projeto) {
    const existe = selecionados.find(p => p.id === projeto.id);
    if (existe) {
      setSelecionados(selecionados.filter(p => p.id !== projeto.id));
    } else {
      setSelecionados([...selecionados, { ...projeto, ordem: selecionados.length + 1 }]);
    }
  }

  function alterarOrdem(id: string, novaOrdem: number) {
    if (novaOrdem < 1) return;
    let novaLista = [...selecionados];
    const idx = novaLista.findIndex(p => p.id === id);
    if (idx === -1) return;
    novaLista[idx].ordem = novaOrdem;
    novaLista = novaLista
      .sort((a, b) => a.ordem - b.ordem)
      .map((p, i) => ({ ...p, ordem: i + 1 }));
    setSelecionados(novaLista);
  }

  async function salvarRota() {
    if (!nome.trim() || selecionados.length === 0) {
      setMsg("Preencha o nome e selecione ao menos um projeto.");
      return;
    }
    setSalvando(true);
    setMsg("");
    try {
      await addDoc(collection(db, "rotas-estudos"), {
        nome,
        ativo,
        projetos: selecionados.map(p => ({ id: p.id, titulo: p.titulo, ordem: p.ordem })),
        criadoEm: new Date().toISOString(),
      });
      setMsg("✅ Rota criada com sucesso!");
      setNome("");
      setAtivo(true);
      setSelecionados([]);
    } catch (e) {
      setMsg("❌ Erro ao salvar rota.");
    }
    setSalvando(false);
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-2xl mx-auto py-12 px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Criar Rota de Estudos</h2>
          {msg && (
            <div className={`mb-6 p-3 rounded-lg text-center font-semibold ${
              msg.includes("sucesso") || msg.includes("✅")
                ? "bg-green-600/20 text-green-400 border border-green-600"
                : "bg-red-600/20 text-red-400 border border-red-600"
            }`}>
              {msg}
            </div>
          )}
          <Card className="mb-8 bg-gray-800/50 border-gray-700 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="text-2xl">🛤️</span>
                Nova Rota
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Nome da Rota</label>
                <Input value={nome} onChange={e => setNome(e.target.value)} required className="bg-gray-900 text-white border-gray-700" />
              </div>
              <div className="flex items-center gap-4">
                <label className="block text-gray-300 font-semibold">Ativo?</label>
                <input type="checkbox" checked={ativo} onChange={e => setAtivo(e.target.checked)} className="w-5 h-5" />
                <span className="text-gray-400 text-sm">(Se desmarcado, a rota ficará invisível para os alunos)</span>
              </div>
            </CardContent>
          </Card>
          <Card className="mb-8 bg-gray-800/50 border-gray-700 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="text-2xl">📚</span>
                Selecionar Projetos da Rota
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {projetos.length === 0 && <div className="text-gray-400">Nenhum projeto encontrado.</div>}
                {projetos.map(proj => {
                  const sel = selecionados.find(p => p.id === proj.id);
                  return (
                    <div key={proj.id} className={`flex items-center gap-4 p-2 rounded-lg border ${sel ? "border-blue-500 bg-blue-900/30" : "border-gray-700 bg-gray-900/30"}`}>
                      <input
                        type="checkbox"
                        checked={!!sel}
                        onChange={() => toggleProjeto(proj)}
                        className="w-5 h-5"
                      />
                      <span className="flex-1 text-white">{proj.titulo}</span>
                      {sel && (
                        <div className="flex items-center gap-2">
                          <label className="text-gray-300 text-xs">Ordem:</label>
                          <Input
                            type="number"
                            min={1}
                            value={sel.ordem}
                            onChange={e => alterarOrdem(proj.id, Number(e.target.value))}
                            className="w-16 bg-gray-800 text-white border-gray-600 text-center"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          <div className="text-center mt-8">
            <Button onClick={salvarRota} className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-12 py-3 text-lg font-bold rounded-xl transition-all duration-300" disabled={salvando}>
              {salvando ? "Salvando..." : "Criar Rota de Estudos"}
            </Button>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
