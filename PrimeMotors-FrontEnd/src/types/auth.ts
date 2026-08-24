export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  cep: string;
  number: string;
  password?: string;
}

export type AuthServiceUser = {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  cpf: string;
  cep: string;
  number: string;
  password?: string;
};

export type AuthLoginPayload = AuthServiceUser | { user: AuthServiceUser };

export interface AuthContextType {
  user: User | null;
  login: (userData: AuthLoginPayload, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}
