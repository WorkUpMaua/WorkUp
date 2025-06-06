import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FormData,
  ProfilePersonalInfo,
} from "../components/ProfilePersonalInfo";
import { AxiosError } from "axios";
import { getCookie } from "../utils/cookies";
import HeaderBar from "../components/HeaderBar";
import SidebarMenu from "../components/SidebarMenu";
import userClient from "../utils/userClient";
import { Alert } from "../components/Alert";

function UserProfile(): React.ReactElement {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    cpf: "",
    birth: "",
    phone: "",
  });
  const [reliableUser, setReliableUser] = useState<FormData>({
    name: "",
    email: "",
    cpf: "",
    birth: "",
    phone: "",
  });
  const [sidebarActive, setSidebarActive] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [apiAlert, setApiAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const getModifiedFields = (prev: FormData, curr: Partial<FormData>) => {
    const modified: Partial<FormData> = {};

    Object.keys(curr).forEach((key) => {
      const typedKey = key as keyof FormData;
      if (curr[typedKey] !== undefined && curr[typedKey] !== prev[typedKey]) {
        modified[typedKey] = curr[typedKey] as string;
      }
    });

    return modified;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? e.target.checked : undefined;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = getCookie("token");
    if (!token) navigate("/login");

    const fieldsToSend = getModifiedFields(reliableUser, formData);

    // Basicamente transforma a data para timestamp
    if (fieldsToSend.birth) {
      fieldsToSend.birth = String(new Date(fieldsToSend.birth).getTime());
    }
    if (fieldsToSend.birth && typeof fieldsToSend.birth === "string") {
      const timestamp = Number(fieldsToSend.birth);
      if (!isNaN(timestamp)) {
        fieldsToSend.birth = timestamp as unknown as string;
      }
    }
    try {
      const response = await userClient.patch(`/user/${token}`, {
        ...fieldsToSend,
      });

      const userData = {
        name: response.data.updatedUser.name,
        email: response.data.updatedUser.email,
        cpf: response.data.updatedUser.cpf,
        birth: new Date(response.data.updatedUser.birth).toISOString().split("T")[0],
        phone: response.data.updatedUser.phone,
      };

      setReliableUser(userData);
      setFormData(userData);

      setApiAlert({
        message: "Perfil atualizado com sucesso!",
        type: "success",
      });

      setIsEditing(false);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const axiosErr = err;
        const messageFromBack =
          (axiosErr as AxiosError).response?.data &&
          typeof (axiosErr as AxiosError).response?.data === "object"
            ? ((axiosErr as AxiosError).response?.data as { message?: string })
                .message
            : undefined;
        setApiAlert({
          message:
            "ERRO: " +
            (messageFromBack !== undefined ? messageFromBack : "NULL"),
          type: "error",
        });
      } else {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    const token = getCookie("token");
    if (!token) navigate("/login");
    const fetchUser = async () => {
      try {
        const response = await userClient.get(`/user/${token}`);

        const userData = {
          name: response.data.user.name,
          email: response.data.user.email,
          cpf: response.data.user.cpf,
          birth: new Date(response.data.user.birth).toISOString().split("T")[0],
          phone: response.data.user.phone,
        };

        setReliableUser(userData);
        setFormData(userData);
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
            "ERRO: " +
            (messageFromBack !== undefined ? messageFromBack : "NULL"),
          type: "error",
        });
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-light to-gray-100">
      <SidebarMenu
        active={sidebarActive}
        onClose={() => setSidebarActive(false)}
      />
      <HeaderBar onMenuClick={() => setSidebarActive(!sidebarActive)} />
      <main className="mt-20 p-10 w-full min-h-[calc(100vh-80px)] flex justify-center">
        <div className="w-full max-w-[1000px] mx-auto">
          {apiAlert && (
            <div className="max-w-md m-auto mt-10">
              <Alert
                message={apiAlert.message}
                type={apiAlert.type}
                onClose={() => {
                  setApiAlert(null);
                }}
              />
            </div>
          )}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-8 border-b border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-secondary">
                  Perfil do Usuário
                </h1>
                <button
                  onClick={() => {
                    setFormData(reliableUser);
                    setIsEditing(!isEditing);
                  }}
                  className="bg-primary text-white bg-[#34495e] border-none px-6 py-2.5 rounded-lg cursor-pointer font-medium text-sm transition-all duration-300 hover:bg-primary-dark hover:-translate-y-0.5"
                >
                  {isEditing ? "Cancelar" : "Editar Perfil"}
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1">
                <ProfilePersonalInfo
                  formData={formData}
                  isEditing={isEditing}
                  handleChange={handleChange}
                />
              </div>
              {isEditing && (
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    onSubmit={handleSubmit}
                    className="bg-primary m-auto text-white bg-[#34495e] border-none px-8 py-3 rounded-lg cursor-pointer font-medium text-base transition-all duration-300 hover:bg-primary-dark hover:-translate-y-0.5"
                  >
                    Salvar Alterações
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserProfile;
