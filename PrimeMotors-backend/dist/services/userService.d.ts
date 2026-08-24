import type { CreateUserInput, UpdateUserInput } from "../types/user";
export declare const createUserService: (data: CreateUserInput) => Promise<{
    number: string | null;
    id: string;
    email: string;
    cpf: string;
    name: string;
    cep: string;
    active: boolean;
}>;
export declare const loginService: (email: string) => Promise<{
    number: string | null;
    id: string;
    email: string;
    cpf: string;
    name: string;
    cep: string;
    password: string;
    active: boolean;
} | null>;
export declare const getUserByIdService: (id: string) => Promise<{
    number: string | null;
    id: string;
    email: string;
    cpf: string;
    name: string;
    cep: string;
} | null>;
export declare const updateUserService: (id: string, data: UpdateUserInput) => Promise<{
    number: string | null;
    id: string;
    email: string;
    cpf: string;
    name: string;
    cep: string;
    active: boolean;
}>;
export declare const deactivateUserService: (id: string) => Promise<{
    number: string | null;
    id: string;
    email: string;
    cpf: string;
    name: string;
    cep: string;
    password: string;
    active: boolean;
}>;
