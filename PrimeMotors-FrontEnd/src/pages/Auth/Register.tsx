import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";


import Button from "../../components/Button.tsx";
import Checkbox from "../../components/checkbox.tsx";
import Notification from "../../components/Notification";
import api from "../../services/api";
import { authStorage } from "../../utils/userLocalStorage.ts";
import { cpfMask, zipCodeMask, phoneMask } from "../Auth/masks/masks.ts";
import { registerSchema } from "../Auth/masks/validationRegister.ts";
import type { RegisterFormData } from "../Auth/masks/validationRegister.ts";
import "../Auth/css/auth.css";

export default function Register() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const cpf = useWatch({ control, name: "cpf" });
  const number = useWatch({ control, name: "number" });
  const cep = useWatch({ control, name: "cep" });

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 3200);
    return () => clearTimeout(timer);
  }, [notification]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const cleanData = {
        ...data,
        cpf: data.cpf.replace(/\D/g, ""),
        number: data.number.replace(/\D/g, ""),
        cep: data.cep.replace(/\D/g, ""),
      };

      const response = await api.post(
        "/auth/users",
        cleanData,
      );

      if (response.status === 201) {
        authStorage.saveUser(response.data.user);
        setNotification({
          message: "Cadastro realizado com sucesso.",
          variant: "success",
        });
        navigate("/Login");
        window.location.reload();
      }
    } catch (error: unknown) {
      let errormessage = "Erro ao conectar com o servidor";

      if (axios.isAxiosError(error)) {
        errormessage = error.response?.data?.message ?? errormessage;
      } else if (error instanceof Error) {
        errormessage = error.message;
      }

      setNotification({ message: errormessage, variant: "error" });
      console.log("Erro no cadastro:", error);
    }
  };

  return (
    <div className="max-h-screen w-full bg-[#121212] flex justify-end items-center overflow-hidden">
      <div className="absolute inset-0 register-bg py-10!" />
      {notification ? (
        <Notification
          message={notification.message}
          variant={notification.variant}
          onClose={() => setNotification(null)}
        />
      ) : null}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-col gap-4 flex glass-form m-6! w-full scale-80 backdrop-blur-xl! border border-white/10! overflow-y-hidden! "
      >
        <h3 className="m-auto text-white">
          Associe-se à <span className="text-[#C59958]">Prime Motors</span>
        </h3>

        <div className="flex flex-col gap-1">
          <input
            {...register("name")}
            className="p-2 bg-white rounded-sm placeholder-gray-700 text-black "
            placeholder="Nome completo"
          />
          {errors.name && (
            <span className="text-red-500 text-base">
              {errors.name.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <input
            {...register("cpf")}
            value={cpf || ""}
            onChange={(e) => setValue("cpf", cpfMask(e.target.value))}
            className="p-2 bg-white rounded-sm placeholder-gray-700 text-black "
            placeholder="CPF"
          />
          {errors.cpf && (
            <span className="text-red-500 text-base">{errors.cpf.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <input
            {...register("email")}
            type="email"
            className="p-2 bg-white rounded-sm placeholder-gray-700 text-black "
            placeholder="Email"
          />
          {errors.email && (
            <span className="text-red-500 text-base">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <input
            {...register("password")}
            type="password"
            className="p-2 bg-white rounded-sm mb-2 placeholder-gray-700 text-black "
            placeholder="Senha"
          />
          {errors.password && (
            <span className="text-red-500 text-base">
              {errors.password.message}
            </span>
          )}
          {!errors.password && (
            <span className="text-white">* Mínimo de 6 caracteres</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <input
            {...register("confirmPassword")}
            type="password"
            className="p-2 bg-white rounded-sm mb-2 placeholder-gray-700 text-black "
            placeholder="Confirmar senha"
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-base">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <input
              {...register("number")}
              value={number || ""}
              onChange={(e) => setValue("number", phoneMask(e.target.value))}
              className="w-full p-2 bg-white border border-gray-300 rounded-sm placeholder-gray-700 text-black  focus:outline-blue-500"
              placeholder="Telefone"
            />
            {errors.number && (
              <span className="text-red-500 text-base">
                {errors.number.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <input
              {...register("cep")}
              value={cep || ""}
              onChange={(e) => setValue("cep", zipCodeMask(e.target.value))}
              className="w-full p-2 bg-white border border-gray-300 rounded-sm placeholder-gray-700 text-black  focus:outline-blue-500"
              placeholder="CEP"
            />
            {errors.cep && (
              <span className="text-red-500 text-base">
                {errors.cep.message}
              </span>
            )}
          </div>
        </div>

        <Checkbox texto="Aceito os Termos de Uso e a Política de Privacidade." />

        <div className="grid grid-cols-3 items-center w-full">
          <Button
            texto=" ← "
            type="button"
            className="text-white justify-self-start gap-2 text-[20px]!"
            onClick={() => navigate("/")}
          />
          <Button
            texto="Confirmar"
            type="submit"
            className="text-white justify-self-center items-center gap-2 text-[20px]! m-auto"
          />
        </div>
      </form>
    </div>
  );
}
