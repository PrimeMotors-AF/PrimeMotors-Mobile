import prisma from "../config/database";
import bcrypt from "bcrypt";
import type { CreateUserInput, UpdateUserInput } from "../types/user";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^.{6,}$/;

const cleanDigits = (value: string) => value.replace(/\D/g, "");
const cleanCpf = (cpf: string) => cleanDigits(cpf);

const isValidCpf = (cpf: string) => {
  const cleaned = cleanCpf(cpf);
  if (!/^\d{11}$/.test(cleaned)) return false;
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  const digits = cleaned.split("").map(Number);
  const calculateVerifier = (factor: number) => {
    const sum = digits
      .slice(0, factor - 1)
      .reduce((acc, digit, index) => acc + digit * (factor - index), 0);
    const result = (sum * 10) % 11;
    return result === 10 ? 0 : result;
  };

  return (
    calculateVerifier(10) === digits[9] && calculateVerifier(11) === digits[10]
  );
};

const validateNewUser = async (data: CreateUserInput) => {
  if (
    !data.name ||
    !data.email ||
    !data.password ||
    !data.cpf ||
    !data.cep ||
    !data.number
  ) {
    throw new Error(
      "Nome, email, senha, CPF, CEP e telefone são obrigatórios.",
    );
  }

  if (typeof data.name !== "string" || data.name.trim().length < 3) {
    throw new Error("Nome deve ter pelo menos 3 caracteres.");
  }

  if (typeof data.email !== "string" || !emailRegex.test(data.email)) {
    throw new Error("Email inválido.");
  }

  if (typeof data.password !== "string" || !passwordRegex.test(data.password)) {
    throw new Error("Senha inválida. Deve ter ao menos 6 caracteres.");
  }

  const cpfDigits = cleanCpf(data.cpf);
  if (!isValidCpf(cpfDigits)) {
    throw new Error("CPF inválido.");
  }

  const cepDigits = cleanDigits(data.cep);
  if (cepDigits.length !== 8) {
    throw new Error("CEP inválido ou incompleto.");
  }

  const numberDigits = cleanDigits(data.number);
  if (numberDigits.length < 10) {
    throw new Error("Telefone inválido ou incompleto.");
  }

  const existingEmail = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existingEmail) {
    throw new Error("E-mail já cadastrado!");
  }

  const existingCpf = await prisma.user.findFirst({
    where: { cpf: cpfDigits },
  });
  if (existingCpf) {
    throw new Error("CPF já cadastrado!");
  }

  return {
    cpf: cpfDigits,
    cep: cepDigits,
    number: numberDigits,
  };
};

const validateUpdatedUser = async (id: string, data: UpdateUserInput) => {
  if (!data.name || !data.cpf || !data.cep || !data.number) {
    throw new Error(
      "Nome, CPF, CEP e número são obrigatórios para atualização.",
    );
  }

  const cpfDigits = cleanCpf(data.cpf);
  if (!isValidCpf(cpfDigits)) {
    throw new Error("CPF inválido.");
  }

  const cepDigits = cleanDigits(data.cep);
  if (cepDigits.length !== 8) {
    throw new Error("CEP inválido ou incompleto.");
  }

  const numberDigits = cleanDigits(data.number);
  if (numberDigits.length < 10) {
    throw new Error("Telefone inválido ou incompleto.");
  }

  if (
    data.password &&
    (typeof data.password !== "string" || !passwordRegex.test(data.password))
  ) {
    throw new Error("Senha inválida. Deve ter ao menos 6 caracteres.");
  }

  const existingCpf = await prisma.user.findFirst({
    where: { cpf: cpfDigits, id: { not: id } },
  });
  if (existingCpf) {
    throw new Error("CPF já cadastrado!");
  }

  return { cpf: cpfDigits, cep: cepDigits, number: numberDigits };
};

export const createUserService = async (data: CreateUserInput) => {
  const normalized = await validateNewUser(data);

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      cpf: normalized.cpf,
      cep: normalized.cep,
      number: normalized.number,
      password: hashedPassword,
      active: true,
    },
  });

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const loginService = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const getUserByIdService = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      cpf: true,
      cep: true,
      number: true,
      avatarUrl: true,
    },
  });
};

export const updateUserService = async (id: string, data: UpdateUserInput) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  if (data.email !== undefined) {
    throw new Error("Não é permitido alterar o email.");
  }

  const normalized = await validateUpdatedUser(id, data);

  const updateData: {
    name: string;
    cpf: string;
    cep: string;
    number: string;
    password?: string;
  } = {
    name: data.name,
    cpf: normalized.cpf,
    cep: normalized.cep,
    number: normalized.number,
  };

  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      cpf: true,
      cep: true,
      number: true,
      active: true,
    },
  });

  return updatedUser;
};

export const deactivateUserService = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  return await prisma.user.update({
    where: { id },
    data: { active: false },
  });
};

export const updateUserAvatarService = async (id: string, avatarUrl: string | null) => {
  return await prisma.user.update({
    where: { id },
    data: { avatarUrl },
    
  });
};