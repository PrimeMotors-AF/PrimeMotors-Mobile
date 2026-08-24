import { z } from "zod";

import { isValidCPF } from "../../../utils/isValidCPF";
export const registerSchema = z
  .object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    email: z.string().email("Email inválido"),
    cpf: z
      .string()
      .min(11, "CPF incompleto")
      .max(14, "CPF inválido")
      .refine((cpf) => isValidCPF(cpf), {
        message: "CPF inválido",
      }),
    number: z.string().min(14, "Telefone incompleto"),
    cep: z.string().min(9, "CEP incompleto"),
    password: z.string().min(6, "Senha precisa ter no mínimo 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
