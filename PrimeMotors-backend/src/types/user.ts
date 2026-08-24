export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  cpf: string;
  cep: string;
  number: string;
}

export interface UpdateUserInput {
  name: string;
  cpf: string;
  cep: string;
  number: string;
  password?: string;
  email?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
