import type { CreateUserInput, UpdateUserInput } from "../types/user";
export declare const createUserService: (data: CreateUserInput) => Promise<{
    number: string | null;
    id: string;
    email: string;
    cpf: string;
    name: string;
    cep: string;
    active: boolean;
    role: import("@prisma/client").$Enums.UserRole;
    avatarUrl: string | null;
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
    role: import("@prisma/client").$Enums.UserRole;
    avatarUrl: string | null;
} | null>;
export declare const getUserByIdService: (id: string) => Promise<{
    number: string | null;
    id: string;
    email: string;
    cpf: string;
    name: string;
    cep: string;
    role: import("@prisma/client").$Enums.UserRole;
    avatarUrl: string | null;
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
    role: import("@prisma/client").$Enums.UserRole;
    avatarUrl: string | null;
}>;
export declare const updateUserAvatarService: (id: string, avatarUrl: string | null) => Promise<{
    number: string | null;
    id: string;
    email: string;
    cpf: string;
    name: string;
    cep: string;
    password: string;
    active: boolean;
    role: import("@prisma/client").$Enums.UserRole;
    avatarUrl: string | null;
}>;
