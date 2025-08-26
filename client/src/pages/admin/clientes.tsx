import { useEffect, useState } from "react";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "./DashboardLayout";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/dialog";
import { getProfessoresByClienteId, updateProfessorSenha } from "../../lib/professores";
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

const initialCliente = {
  logo: "",
  razaoSocial: "",
  nomeFantasia: "",
  cnpj: "",
  inscricaoEstadual: "",
  inscricaoMunicipal: "",
  endereco: {
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
  },
  contato: {
    telefone: "",
    email: "",
    website: "",
    redesSociais: "",
  },
  representante: {
    nome: "",
    cargo: "",
    telefone: "",
    email: "",
  },
};

export default function Clientes() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState<any>(initialCliente);
  const [editId, setEditId] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  // Professores modal state
  const [openProfModal, setOpenProfModal] = useState(false);
  const [professores, setProfessores] = useState<any[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);
  const [senhaEditando, setSenhaEditando] = useState<{[profId:string]: string}>({});
  const [senhaLoading, setSenhaLoading] = useState<{[profId:string]: boolean}>({});
  const [senhaMsg, setSenhaMsg] = useState<{[profId:string]: string}>({});

  async function abrirProfessores(cliente: any) {
    setClienteSelecionado(cliente);
    setOpenProfModal(true);
    setSenhaMsg({});
    setSenhaEditando({});
    setSenhaLoading({});
    const lista = await getProfessoresByClienteId(db, cliente.id);
    setProfessores(lista);
  }

  async function handleTrocarSenha(profId: string) {
    if (!senhaEditando[profId] || senhaEditando[profId].length < 4) {
      setSenhaMsg(m => ({...m, [profId]: "Senha deve ter pelo menos 4 caracteres."}));
      return;
    }
    setSenhaLoading(l => ({...l, [profId]: true}));
    setSenhaMsg(m => ({...m, [profId]: ""}));
    try {
      await updateProfessorSenha(db, profId, senhaEditando[profId]);
      setSenhaMsg(m => ({...m, [profId]: "Senha alterada com sucesso!"}));
      setSenhaEditando(e => ({...e, [profId]: ""}));
    } catch {
      setSenhaMsg(m => ({...m, [profId]: "Erro ao alterar senha."}));
    }
    setSenhaLoading(l => ({...l, [profId]: false}));
  }

  async function fetchClientes() {
    setLoading(true);
    const snap = await getDocs(collection(db, "clientes"));
    const lista: any[] = [];
    snap.forEach(doc => lista.push({ id: doc.id, ...doc.data() }));
    setClientes(lista);
    setLoading(false);
  }

  useEffect(() => { fetchClientes(); }, []);

  async function excluirCliente(id: string) {
    if (!window.confirm("Tem certeza que deseja excluir este cliente?")) return;
    try {
      await deleteDoc(doc(db, "clientes", id));
      setMsg("Cliente excluído com sucesso!");
      fetchClientes();
    } catch {
      setMsg("Erro ao excluir cliente.");
    }
  }

  function handleInput(path: string, value: any) {
    const keys = path.split(".");
    setForm((prev: any) => {
      let obj = { ...prev };
      let ref = obj;
      for (let i = 0; i < keys.length - 1; i++) {
        ref[keys[i]] = { ...ref[keys[i]] };
        ref = ref[keys[i]];
      }
      ref[keys[keys.length - 1]] = value;
      return obj;
    });
  }

  async function salvarCliente(e: any) {
    e.preventDefault();
    setSalvando(true);
    setMsg("");
    try {
      if (editId) {
        await updateDoc(doc(db, "clientes", editId), form);
        setMsg("Cliente atualizado com sucesso!");
      } else {
        await addDoc(collection(db, "clientes"), { ...form, criadoEm: new Date().toISOString() });
        setMsg("Cliente cadastrado com sucesso!");
      }
      setForm(initialCliente);
      setEditId(null);
      fetchClientes();
    } catch {
      setMsg("Erro ao salvar cliente.");
    }
    setSalvando(false);
  }

  function editarCliente(cliente: any) {
    setForm({ ...initialCliente, ...cliente });
    setEditId(cliente.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelarEdicao() {
    setForm(initialCliente);
    setEditId(null);
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto py-12 px-4">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Clientes</h2>
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
                <span className="text-2xl">{editId ? "✏️ Editar Cliente" : "➕ Novo Cliente"}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={salvarCliente} className="space-y-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Logo (URL)</label>
                  <Input value={form.logo} onChange={e => handleInput("logo", e.target.value)} placeholder="URL da logo" className="bg-gray-900 text-white border-gray-700" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Razão Social</label>
                    <Input value={form.razaoSocial} onChange={e => handleInput("razaoSocial", e.target.value)} required className="bg-gray-900 text-white border-gray-700" />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Nome Fantasia</label>
                    <Input value={form.nomeFantasia} onChange={e => handleInput("nomeFantasia", e.target.value)} className="bg-gray-900 text-white border-gray-700" />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">CNPJ</label>
                    <Input value={form.cnpj} onChange={e => handleInput("cnpj", e.target.value)} required className="bg-gray-900 text-white border-gray-700" />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Inscrição Estadual</label>
                    <Input value={form.inscricaoEstadual} onChange={e => handleInput("inscricaoEstadual", e.target.value)} className="bg-gray-900 text-white border-gray-700" />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Inscrição Municipal</label>
                    <Input value={form.inscricaoMunicipal} onChange={e => handleInput("inscricaoMunicipal", e.target.value)} className="bg-gray-900 text-white border-gray-700" />
                  </div>
                </div>
                {/* Endereço */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Logradouro</label>
                    <Input value={form.endereco.logradouro} onChange={e => handleInput("endereco.logradouro", e.target.value)} required className="bg-gray-900 text-white border-gray-700" />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Número</label>
                    <Input value={form.endereco.numero} onChange={e => handleInput("endereco.numero", e.target.value)} required className="bg-gray-900 text-white border-gray-700" />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Complemento</label>
                    <Input value={form.endereco.complemento} onChange={e => handleInput("endereco.complemento", e.target.value)} className="bg-gray-900 text-white border-gray-700" />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Bairro</label>
                    <Input value={form.endereco.bairro} onChange={e => handleInput("endereco.bairro", e.target.value)} required className="bg-gray-900 text-white border-gray-700" />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Cidade</label>
                    <Input value={form.endereco.cidade} onChange={e => handleInput("endereco.cidade", e.target.value)} required className="bg-gray-900 text-white border-gray-700" />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Estado</label>
                    <Input value={form.endereco.estado} onChange={e => handleInput("endereco.estado", e.target.value)} required className="bg-gray-900 text-white border-gray-700" />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">CEP</label>
                    <Input value={form.endereco.cep} onChange={e => handleInput("endereco.cep", e.target.value)} required className="bg-gray-900 text-white border-gray-700" />
                  </div>
                </div>
                {/* Contato */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Telefone Principal</label>
                    <Input value={form.contato.telefone} onChange={e => handleInput("contato.telefone", e.target.value)} required className="bg-gray-900 text-white border-gray-700" />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">E-mail Principal</label>
                    <Input value={form.contato.email} onChange={e => handleInput("contato.email", e.target.value)} required className="bg-gray-900 text-white border-gray-700" />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Website</label>
                    <Input value={form.contato.website} onChange={e => handleInput("contato.website", e.target.value)} className="bg-gray-900 text-white border-gray-700" />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Redes Sociais</label>
                    <Input value={form.contato.redesSociais} onChange={e => handleInput("contato.redesSociais", e.target.value)} className="bg-gray-900 text-white border-gray-700" />
                  </div>
                </div>
                {/* Representante */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Nome do Representante</label>
                    <Input value={form.representante.nome} onChange={e => handleInput("representante.nome", e.target.value)} required className="bg-gray-900 text-white border-gray-700" />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Cargo</label>
                    <Input value={form.representante.cargo} onChange={e => handleInput("representante.cargo", e.target.value)} required className="bg-gray-900 text-white border-gray-700" />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Telefone do Representante</label>
                    <Input value={form.representante.telefone} onChange={e => handleInput("representante.telefone", e.target.value)} required className="bg-gray-900 text-white border-gray-700" />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">E-mail do Representante</label>
                    <Input value={form.representante.email} onChange={e => handleInput("representante.email", e.target.value)} required className="bg-gray-900 text-white border-gray-700" />
                  </div>
                </div>
                <div className="text-center mt-8 flex gap-4 justify-center">
                  <Button type="submit" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-12 py-3 text-lg font-bold rounded-xl transition-all duration-300" disabled={salvando}>
                    {salvando ? (editId ? "Salvando..." : "Cadastrando...") : (editId ? "Salvar Alterações" : "Cadastrar Cliente")}
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
                <span className="text-2xl">🏢</span>
                Lista de Clientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-gray-400">Carregando...</div>
              ) : clientes.length === 0 ? (
                <div className="text-gray-400">Nenhum cliente cadastrado.</div>
              ) : (
                <div className="space-y-4">
                  {clientes.map(cliente => (
                    <div key={cliente.id} className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2 p-4 rounded-lg border border-gray-700 bg-gray-900/30">
                      <div className="flex-1">
                        <div className="font-bold text-white text-lg">{cliente.razaoSocial || "(Sem razão social)"}</div>
                        <div className="text-gray-300 text-sm">CNPJ: {cliente.cnpj}</div>
                        <div className="text-gray-400 text-xs">{cliente.endereco?.cidade} - {cliente.endereco?.estado}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button className="bg-blue-700 hover:bg-blue-800 text-white" onClick={() => abrirProfessores(cliente)}>Professores</Button>
                        <Button className="bg-yellow-600 hover:bg-yellow-700 text-white" onClick={() => editarCliente(cliente)}>Editar</Button>
                        <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => excluirCliente(cliente.id)}>Excluir</Button>
                      </div>
                    </div>
                  ))}
                  {/* Modal de Professores */}
                  <Dialog open={openProfModal} onOpenChange={setOpenProfModal}>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Professores do Cliente</DialogTitle>
                        <DialogDescription>
                          {clienteSelecionado?.razaoSocial || clienteSelecionado?.nomeFantasia}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="overflow-x-auto">
                        {professores.length === 0 ? (
                          <div className="text-gray-400">Nenhum professor associado.</div>
                        ) : (
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr className="text-left text-gray-300">
                                <th className="p-2">Nome</th>
                                <th className="p-2">E-mail</th>
                                <th className="p-2">Turmas</th>
                                <th className="p-2">Senha</th>
                                <th className="p-2"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {professores.map((prof: any) => (
                                <tr key={prof.id} className="border-b border-gray-700">
                                  <td className="p-2 text-white">{prof.nome}</td>
                                  <td className="p-2 text-gray-200">{prof.email}</td>
                                  <td className="p-2 text-gray-300">{Array.isArray(prof.codigosTurmas) ? prof.codigosTurmas.join(", ") : ""}</td>
                                  <td className="p-2">
                                    <input
                                      type="text"
                                      className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white w-28"
                                      placeholder="Nova senha"
                                      value={senhaEditando[prof.id] || ""}
                                      onChange={e => setSenhaEditando(s => ({...s, [prof.id]: e.target.value}))}
                                      disabled={senhaLoading[prof.id]}
                                    />
                                  </td>
                                  <td className="p-2">
                                    <Button size="sm" className="bg-green-700 hover:bg-green-800 text-white" onClick={() => handleTrocarSenha(prof.id)} disabled={senhaLoading[prof.id]}>
                                      {senhaLoading[prof.id] ? "Salvando..." : "Alterar Senha"}
                                    </Button>
                                    {senhaMsg[prof.id] && (
                                      <div className={`text-xs mt-1 ${senhaMsg[prof.id].includes("sucesso") ? "text-green-400" : "text-red-400"}`}>{senhaMsg[prof.id]}</div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenProfModal(false)}>Fechar</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
