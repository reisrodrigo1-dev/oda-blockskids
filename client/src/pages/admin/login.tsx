import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

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

const LoginAdmin = () => {
  const [form, setForm] = useState({ email: "", senha: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, form.email, form.senha);
      setMsg("Login realizado com sucesso!");
      // Redirecionar para área admin após login
      window.location.href = "/admin";
    } catch (error: any) {
      setMsg("Email ou senha inválidos.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md space-y-4 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">Login Administrativo</h2>
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600" required />
        <input name="senha" type="password" value={form.senha} onChange={handleChange} placeholder="Senha" className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600" required />
        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded mt-2">
          {loading ? "Entrando..." : "Entrar"}
        </button>
        {msg && <div className="text-center text-sm text-white bg-black/30 p-2 rounded">{msg}</div>}
        <button
          type="button"
          onClick={() => window.location.href = "/admin/cadastro"}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded mt-2"
        >
          Cadastrar novo administrador
        </button>
      </form>
    </div>
  );
};

export default LoginAdmin;
