import "../Auth/css/auth.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";


import Button from "../../components/Button.tsx";
import { AuthContext } from "../../contexts/authContext";
import { authService } from "../../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrorMsg(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    setErrorMsg("Email inválido");
    return;
  }

  try {
    const { user, token } = await authService.login({ email, password });

      console.log("Login bem-sucedido. Usuário:", user);

      login(user, token);

      navigate("/");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao realizar login.";
      setErrorMsg(errorMessage);
      console.error("Erro capturado no componente:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#121212] flex justify-end items-center overflow-hidden">
      <div className="absolute inset-0 bg-login-screen opacity-75 py-10!" />

      <form
        onSubmit={handleLogin}
        className="flex-col gap-9 flex w-full glass-form m-6! scale-80 backdrop-blur-xl! border border-white/10!"
      >
        
        <h3 className="m-auto text-white text-center">
          Acesse sua conta <span className="text-[#C59958]">Prime</span>
        </h3>

        {errorMsg && (
          <div className="border-red-500/50 text-red-500 border-2 rounded-sm text-center font-medium">
            {errorMsg}
          </div>
        )}

        <input
          className="p-2 bg-white rounded-sm placeholder-gray-700 text-black outline-none focus:ring-2 focus:ring-[#C59958]"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />

        <input
          className="p-2 bg-white rounded-sm mb-2 placeholder-gray-700 text-black outline-none focus:ring-2 focus:ring-[#C59958]"
          type="password"
          placeholder="Senha"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />
        <div className="grid grid-cols-3 items-center w-full">
          <Button
            texto=" ← "
            type="button"
            className="text-white justify-self-start gap-2 text-[20px]!"
            onClick={() => navigate("/")}
          />
          <Button
            texto="Confirmar"
            className="text-white justify-self-center items-center gap-2 text-[20px]! m-auto"
            type="submit"
          />
        </div>
        
      </form>
      
    </div>
  );
}
