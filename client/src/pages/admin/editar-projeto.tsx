import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "./DashboardLayout";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

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

export default function EditarProjeto() {
  const [location] = useLocation();
  const id = location.split("/").pop();
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState("");
  const [titulo, setTitulo] = useState("");
  const [etapas, setEtapas] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProjeto() {
      setCarregando(true);
      try {
        const ref = doc(db, "projetos-pedagogicos-avancados", id!);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setTitulo(data.titulo || "");
          setEtapas(data.etapas || []);
        } else {
          setMsg("Projeto não encontrado.");
        }
      } catch (e) {
        setMsg("Erro ao carregar projeto.");
      }
      setCarregando(false);
    }
    if (id) fetchProjeto();
  }, [id]);

  async function salvar() {
    setSalvando(true);
    setMsg("");
    try {
      await updateDoc(doc(db, "projetos-pedagogicos-avancados", id!), {
        titulo,
        etapas
      });
      setMsg("Projeto atualizado com sucesso!");
    } catch (e) {
      setMsg("Erro ao salvar alterações.");
    }
    setSalvando(false);
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-3xl mx-auto py-12 px-4">
          <h1 className="text-3xl font-bold text-white mb-8">Editar Projeto</h1>
          {carregando ? (
            <div className="text-white text-center">Carregando...</div>
          ) : (
            <Card className="bg-gray-800/50 border-gray-700 mb-8">
              <CardHeader>
                <CardTitle className="text-white">Título do Projeto</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  value={titulo}
                  onChange={e => setTitulo(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white mb-4"
                />
                {/* Aqui você pode adicionar edição das etapas, se desejar */}
                <Button onClick={salvar} disabled={salvando} className="bg-blue-600 text-white">
                  {salvando ? "Salvando..." : "Salvar Alterações"}
                </Button>
                {msg && <div className="mt-4 text-white">{msg}</div>}
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
