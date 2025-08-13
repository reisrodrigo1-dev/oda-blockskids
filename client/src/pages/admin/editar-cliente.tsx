import { useEffect, useState } from "react";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "./DashboardLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { useLocation } from "wouter";

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

export default function EditarCliente() {
  const [location, setLocation] = useLocation();
  const id = location.split("/").pop();
  const [cliente, setCliente] = useState<any>(null);
  const [msg, setMsg] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function fetchCliente() {
      if (!id) return;
      const ref = doc(db, "clientes", id);
      const snap = await getDoc(ref);
      if (snap.exists()) setCliente(snap.data());
    }
    fetchCliente();
  }, [id]);

  async function salvar(e: any) {
    e.preventDefault();
    if (!id) return;
    setSalvando(true);
    setMsg("");
    try {
      await updateDoc(doc(db, "clientes", id), cliente);
      setMsg("✅ Cliente atualizado!");
    } catch {
      setMsg("❌ Erro ao atualizar cliente.");
    }
    setSalvando(false);
  }

  if (!cliente) return <div className="text-white p-8">Carregando...</div>;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-2xl mx-auto py-12 px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Editar Cliente</h2>
          {msg && (
            <div className={`mb-6 p-3 rounded-lg text-center font-semibold ${
              msg.includes("✅")
                ? "bg-green-600/20 text-green-400 border border-green-600"
                : "bg-red-600/20 text-red-400 border border-red-600"
            }`}>
              {msg}
            </div>
          )}
          <form onSubmit={salvar} className="space-y-6">
            {/* Razão Social */}
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Razão Social</label>
              <Input value={cliente.razaoSocial} onChange={e => setCliente({ ...cliente, razaoSocial: e.target.value })} required className="bg-gray-900 text-white border-gray-700" />
            </div>
            {/* Nome Fantasia */}
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Nome Fantasia</label>
              <Input value={cliente.nomeFantasia} onChange={e => setCliente({ ...cliente, nomeFantasia: e.target.value })} className="bg-gray-900 text-white border-gray-700" />
            </div>
            {/* CNPJ */}
            <div>
              <label className="block text-gray-300 font-semibold mb-1">CNPJ</label>
              <Input value={cliente.cnpj} onChange={e => setCliente({ ...cliente, cnpj: e.target.value })} required className="bg-gray-900 text-white border-gray-700" />
            </div>
            {/* Endereço (cidade, estado) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Cidade</label>
                <Input value={cliente.endereco?.cidade || ""} onChange={e => setCliente({ ...cliente, endereco: { ...cliente.endereco, cidade: e.target.value } })} className="bg-gray-900 text-white border-gray-700" />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Estado</label>
                <Input value={cliente.endereco?.estado || ""} onChange={e => setCliente({ ...cliente, endereco: { ...cliente.endereco, estado: e.target.value } })} className="bg-gray-900 text-white border-gray-700" />
              </div>
            </div>
            <div className="text-center mt-8">
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-12 py-3 text-lg font-bold rounded-xl transition-all duration-300" disabled={salvando}>
                {salvando ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
