import { useEffect, useState } from "react";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "./DashboardLayout";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc, addDoc, updateDoc } from "firebase/firestore";

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

const initialRota = {
  nome: "",
  ativo: true,
  projetos: [] as any[],
};

export default function RotasEstudos() {
  const [rotas, setRotas] = useState<any[]>([]);
  const [projetos, setProjetos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState<any>(initialRota);
  const [editId, setEditId] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function fetchRotas() {
    setLoading(true);
    const snap = await getDocs(collection(db, "rotas-estudos"));
    const lista: any[] = [];
    snap.forEach(doc => lista.push({ id: doc.id, ...doc.data() }));
    setRotas(lista);
    setLoading(false);
  }
  async function fetchProjetos() {
    const snap = await getDocs(collection(db, "projetos-pedagogicos-avancados"));
    const lista: any[] = [];
    snap.forEach(doc => lista.push({ id: doc.id, titulo: doc.data().titulo || "(Sem título)" }));
    setProjetos(lista);
  }
  useEffect(() => { fetchRotas(); fetchProjetos(); }, []);

  async function excluirRota(id: string) {
    if (!window.confirm("Tem certeza que deseja excluir esta rota?")) return;
    try {
      await deleteDoc(doc(db, "rotas-estudos", id));
      setMsg("Rota excluída com sucesso!");
      fetchRotas();
    } catch {
      setMsg("Erro ao excluir rota.");
    }
  }

  function toggleProjeto(projeto: any) {
    const existe = form.projetos.find((p: any) => p.id === projeto.id);
    if (existe) {
      setForm({ ...form, projetos: form.projetos.filter((p: any) => p.id !== projeto.id) });
    } else {
      setForm({ ...form, projetos: [...form.projetos, { ...projeto, ordem: form.projetos.length + 1 }] });
    }
  }
  function alterarOrdem(id: string, novaOrdem: number) {
    if (novaOrdem < 1) return;
    let novaLista = [...form.projetos];
    const idx = novaLista.findIndex(p => p.id === id);
    if (idx === -1) return;
    novaLista[idx].ordem = novaOrdem;
    novaLista = novaLista
      .sort((a, b) => a.ordem - b.ordem)
      .map((p, i) => ({ ...p, ordem: i + 1 }));
    setForm({ ...form, projetos: novaLista });
  }

  async function salvarRota(e: any) {
    e.preventDefault();
    setSalvando(true);
    setMsg("");
    try {
      if (editId) {
        await updateDoc(doc(db, "rotas-estudos", editId), form);
        setMsg("Rota atualizada com sucesso!");
      } else {
        await addDoc(collection(db, "rotas-estudos"), { ...form, criadoEm: new Date().toISOString() });
        setMsg("Rota cadastrada com sucesso!");
      }
      setForm(initialRota);
      setEditId(null);
      fetchRotas();
    } catch {
      setMsg("Erro ao salvar rota.");
    }
    setSalvando(false);
  }

  function editarRota(rota: any) {
    setForm({ nome: rota.nome, ativo: rota.ativo, projetos: rota.projetos || [] });
    setEditId(rota.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function cancelarEdicao() {
    setForm(initialRota);
    setEditId(null);
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto py-12 px-4">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Rotas de Estudos</h2>
          {msg && (
            <div className={`mb-6 p-3 rounded-lg text-center font-semibold ${
              msg.includes("sucesso")
                ? "bg-green-600/20 text-green-400 border border-green-600"
                : "bg-red-600/20 text-red-400 border border-red-600"
            }`}>
              {msg}
            </div>
          )}
          {/* Formulário */}
          <Card className="mb-8 bg-gray-800/50 border-gray-700 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="text-2xl">{editId ? "✏️ Editar Rota" : "➕ Nova Rota"}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={salvarRota} className="space-y-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Nome da Rota</label>
                  <Input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required className="bg-gray-900 text-white border-gray-700" />
                </div>
                <div className="flex items-center gap-4">
                  <label className="block text-gray-300 font-semibold">Ativo?</label>
                  <input type="checkbox" checked={form.ativo} onChange={e => setForm({ ...form, ativo: e.target.checked })} className="w-5 h-5" />
                  <span className="text-gray-400 text-sm">(Se desmarcado, a rota ficará invisível para os alunos)</span>
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Projetos da Rota</label>
                  <div className="space-y-2">
                    {projetos.length === 0 && <div className="text-gray-400">Nenhum projeto encontrado.</div>}
                    {projetos.map(proj => {
                      const sel = form.projetos.find((p: any) => p.id === proj.id);
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
                </div>
                <div className="text-center mt-8 flex gap-4 justify-center">
                  <Button type="submit" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-12 py-3 text-lg font-bold rounded-xl transition-all duration-300" disabled={salvando}>
                    {salvando ? (editId ? "Salvando..." : "Cadastrando...") : (editId ? "Salvar Alterações" : "Cadastrar Rota")}
                  </Button>
                  {editId && (
                    <Button type="button" onClick={cancelarEdicao} className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-xl">Cancelar</Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
          {/* Lista */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="text-2xl">🛤️</span>
                Lista de Rotas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-gray-400">Carregando...</div>
              ) : rotas.length === 0 ? (
                <div className="text-gray-400">Nenhuma rota cadastrada.</div>
              ) : (
                <div className="space-y-4">
                  {rotas.map(rota => (
                    <div key={rota.id} className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2 p-4 rounded-lg border border-gray-700 bg-gray-900/30">
                      <div className="flex-1">
                        <div className="font-bold text-white text-lg">{rota.nome || "(Sem nome)"} {rota.ativo ? <span className="text-green-400 text-xs ml-2">Ativo</span> : <span className="text-red-400 text-xs ml-2">Inativo</span>}</div>
                        <div className="text-gray-300 text-sm">Projetos: {rota.projetos?.length || 0}</div>
                        <div className="text-gray-400 text-xs">{rota.projetos?.sort((a:any,b:any)=>a.ordem-b.ordem).map((p:any) => p.titulo).join(", ")}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button className="bg-yellow-600 hover:bg-yellow-700 text-white" onClick={() => editarRota(rota)}>Editar</Button>
                        <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => excluirRota(rota.id)}>Excluir</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
