import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

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
const auth = getAuth(app);
const db = getFirestore(app);

const ADMIN_CODE = "N&kxTuw^7!7xWg2w";

const CadastroAdmin = () => {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    senha: "",
    codigo: ""
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    if (form.codigo !== ADMIN_CODE) {
      setMsg("Código administrativo incorreto.");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.senha);
      const user = userCredential.user;
      await setDoc(doc(db, "admins", user.uid), {
        nome: form.nome,
        email: form.email,
        cpf: form.cpf,
        telefone: form.telefone,
        criadoEm: new Date().toISOString()
      });
      setMsg("Cadastro realizado com sucesso! Faça login.");
      setForm({ nome: "", email: "", cpf: "", telefone: "", senha: "", codigo: "" });
    } catch (error: any) {
      setMsg(error.message || "Erro ao cadastrar.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md space-y-4 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">Cadastro Administrativo</h2>
        <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome" className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600" required />
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600" required />
        <input name="cpf" value={form.cpf} onChange={handleChange} placeholder="CPF" className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600" required />
        <input name="telefone" value={form.telefone} onChange={handleChange} placeholder="Telefone" className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600" required />
        <input name="senha" type="password" value={form.senha} onChange={handleChange} placeholder="Senha" className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600" required />
        <input name="codigo" value={form.codigo} onChange={handleChange} placeholder="Código Administrativo" className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600" required />
        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded mt-2">
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
        {msg && <div className="text-center text-sm text-white bg-black/30 p-2 rounded">{msg}</div>}
      </form>
    </div>
  );
};

export default CadastroAdmin;
