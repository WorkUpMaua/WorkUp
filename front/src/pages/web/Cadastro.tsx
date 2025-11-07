import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo_WorkUp.png";
import { IMaskInput } from "react-imask";
import userClient from "../../utils/userClient";
import { getCookie } from "../../utils/cookies";
import { Alert } from "../../components/Alert";
import { AxiosError } from "axios";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpf, setCpf] = useState("");
  const [birthdateString, setBirthdateString] = useState("");
  const [apiAlert, setApiAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await userClient.post("/user", {
        username: email,
        password: password,
        name: name,
        cpf: cpf,
        birth: new Date(birthdateString).getTime(),
        phone: phone,
      });

      if (response.status !== 500) {
        setApiAlert({ message: "Cadastro efetuado!", type: "success" });
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (err: unknown) {
      const axiosErr = err instanceof AxiosError ? (err as AxiosError) : err;
      const messageFromBack =
        (axiosErr as AxiosError).response?.data &&
        typeof (axiosErr as AxiosError).response?.data === "object"
          ? ((axiosErr as AxiosError).response?.data as { message?: string })
              .message
          : undefined;
      setApiAlert({
        message:
          "ERRO: " + (messageFromBack !== undefined ? messageFromBack : "NULL"),
        type: "error",
      });
    }
  };

  useEffect(() => {
    const token = getCookie("token");
    if (token) navigate("/");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white">
      <header className="w-full bg-[#34495e] flex justify-center items-center py-4 shadow-md">
        <img src={Logo} alt="Logo WorkUp" className="w-16" />
      </header>

      {apiAlert && (
        <div className="max-w-md m-auto mt-10">
          <Alert
            message={apiAlert.message}
            type={apiAlert.type}
            onClose={() => {
              setApiAlert(null)
            }}
          />
        </div>
      )}

      <div className="max-w-md mx-auto my-10 p-6 border rounded-xl shadow-md flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-center">Cadastro</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <div>
            <label className="block mb-1">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Seu nome completo"
            />
          </div>

          <div>
            <label className="block mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="exemplo@email.com"
            />
          </div>

          <div>
            <label className="block mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Digite sua senha"
            />
          </div>

          <div>
            <label className="block mb-1">CPF</label>
            <IMaskInput
              mask="000.000.000-00"
              value={cpf}
              unmask={false}
              onAccept={(value) => setCpf(value)}
              placeholder="000.000.000-00"
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Data de Nascimento</label>
            <input
              type="date"
              value={birthdateString}
              onChange={(e) => setBirthdateString(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-1">Telefone</label>

            <IMaskInput
              id="telefone-input"
              mask="(00) 00000-0000"
              value={phone}
              unmask={false}
              onAccept={(value) => setPhone(value)}
              placeholder="(00) 00000-0000"
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-[#34495e] cursor-pointer mt-4 text-white py-2 rounded-lg transition-colors duration-300
                            hover:bg-gradient-to-r hover:from-[#2c3e50] hover:to-[#5d6d7e]"
          >
            Cadastrar
          </button>
        </form>

        <button
          onClick={() => navigate("/login")}
          className="text-[#34495e] py-2 rounded-xl cursor-pointer mt-4"
        >
          Já tem uma conta? Faça login
        </button>
      </div>
    </div>
  );
}
