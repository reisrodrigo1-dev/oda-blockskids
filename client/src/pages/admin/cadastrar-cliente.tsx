import { useState } from "react";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "./DashboardLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
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

export default function CadastrarCliente() {
  const [logo, setLogo] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [inscricaoEstadual, setInscricaoEstadual] = useState("");
  const [inscricaoMunicipal, setInscricaoMunicipal] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cep, setCep] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [redesSociais, setRedesSociais] = useState("");
  const [repNome, setRepNome] = useState("");
  const [repCargo, setRepCargo] = useState("");
  const [repTelefone, setRepTelefone] = useState("");
  const [repEmail, setRepEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setMensagem("");
    try {
      await addDoc(collection(db, "clientes"), {
        logo,
        razaoSocial,
        nomeFantasia,
        cnpj,
        inscricaoEstadual,
        inscricaoMunicipal,
        endereco: {
          logradouro,
          numero,
          complemento,
          bairro,
          cidade,
          estado,
          cep,
        },
        contato: {
          telefone,
          email,
          website,
          redesSociais,
        },
        representante: {
          nome: repNome,
          cargo: repCargo,
          telefone: repTelefone,
          email: repEmail,
        },
        criadoEm: new Date().toISOString(),
      });
      setMensagem("✅ Cliente cadastrado com sucesso!");
      setLogo(""); setRazaoSocial(""); setNomeFantasia(""); setCnpj(""); setInscricaoEstadual(""); setInscricaoMunicipal("");
      setLogradouro(""); setNumero(""); setComplemento(""); setBairro(""); setCidade(""); setEstado(""); setCep("");
      setTelefone(""); setEmail(""); setWebsite(""); setRedesSociais("");
      setRepNome(""); setRepCargo(""); setRepTelefone(""); setRepEmail("");
    } catch (e) {
      setMensagem("❌ Erro ao cadastrar cliente.");
    }
    setSalvando(false);
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-2xl mx-auto py-12 px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Cadastrar Cliente</h2>
          {mensagem && (
            <div className={`mb-6 p-3 rounded-lg text-center font-semibold ${
              mensagem.includes("✅")
                ? "bg-green-600/20 text-green-400 border border-green-600"
                : "bg-red-600/20 text-red-400 border border-red-600"
            }`}>
              {mensagem}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Logo (URL ou upload futuro) */}
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Logo (URL)</label>
              <Input value={logo} onChange={e => setLogo(e.target.value)} placeholder="URL da logo" className="bg-gray-900 text-white border-gray-700" />
            </div>
            {/* Dados da Empresa */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Razão Social</label>
                <Input value={razaoSocial} onChange={e => setRazaoSocial(e.target.value)} required className="bg-gray-900 text-white border-gray-700" />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Nome Fantasia</label>
                <Input value={nomeFantasia} onChange={e => setNomeFantasia(e.target.value)} className="bg-gray-900 text-white border-gray-700" />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">CNPJ</label>
                <Input value={cnpj} onChange={e => setCnpj(e.target.value)} required className="bg-gray-900 text-white border-gray-700" />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Inscrição Estadual</label>
                <Input value={inscricaoEstadual} onChange={e => setInscricaoEstadual(e.target.value)} className="bg-gray-900 text-white border-gray-700" />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Inscrição Municipal</label>
                <Input value={inscricaoMunicipal} onChange={e => setInscricaoMunicipal(e.target.value)} className="bg-gray-900 text-white border-gray-700" />
              </div>
            </div>
            {/* Endereço */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Logradouro</label>
                <Input value={logradouro} onChange={e => setLogradouro(e.target.value)} required className="bg-gray-900 text-white border-gray-700" />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Número</label>
                <Input value={numero} onChange={e => setNumero(e.target.value)} required className="bg-gray-900 text-white border-gray-700" />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Complemento</label>
                <Input value={complemento} onChange={e => setComplemento(e.target.value)} className="bg-gray-900 text-white border-gray-700" />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Bairro</label>
                <Input value={bairro} onChange={e => setBairro(e.target.value)} required className="bg-gray-900 text-white border-gray-700" />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Cidade</label>
                <Input value={cidade} onChange={e => setCidade(e.target.value)} required className="bg-gray-900 text-white border-gray-700" />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Estado</label>
                <Input value={estado} onChange={e => setEstado(e.target.value)} required className="bg-gray-900 text-white border-gray-700" />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">CEP</label>
                <Input value={cep} onChange={e => setCep(e.target.value)} required className="bg-gray-900 text-white border-gray-700" />
              </div>
            </div>
            {/* Contato */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Telefone Principal</label>
                <Input value={telefone} onChange={e => setTelefone(e.target.value)} required className="bg-gray-900 text-white border-gray-700" />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">E-mail Principal</label>
                <Input value={email} onChange={e => setEmail(e.target.value)} required className="bg-gray-900 text-white border-gray-700" />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Website</label>
                <Input value={website} onChange={e => setWebsite(e.target.value)} className="bg-gray-900 text-white border-gray-700" />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Redes Sociais</label>
                <Input value={redesSociais} onChange={e => setRedesSociais(e.target.value)} className="bg-gray-900 text-white border-gray-700" />
              </div>
            </div>
            {/* Representante */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Nome do Representante</label>
                <Input value={repNome} onChange={e => setRepNome(e.target.value)} required className="bg-gray-900 text-white border-gray-700" />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Cargo</label>
                <Input value={repCargo} onChange={e => setRepCargo(e.target.value)} required className="bg-gray-900 text-white border-gray-700" />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Telefone do Representante</label>
                <Input value={repTelefone} onChange={e => setRepTelefone(e.target.value)} required className="bg-gray-900 text-white border-gray-700" />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">E-mail do Representante</label>
                <Input value={repEmail} onChange={e => setRepEmail(e.target.value)} required className="bg-gray-900 text-white border-gray-700" />
              </div>
            </div>
            <div className="text-center mt-8">
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-12 py-3 text-lg font-bold rounded-xl transition-all duration-300" disabled={salvando}>
                {salvando ? "Salvando..." : "Cadastrar Cliente"}
              </Button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
