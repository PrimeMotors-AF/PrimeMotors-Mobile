const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

type LoginCredentials = {
	email: string;
	password: string;
};

type LoginResponse = {
	user: Record<string, unknown>;
	token: string;
};

export type RegisterData = {
	name: string;
	email: string;
	password: string;
	cpf: string;
	cep: string;
	number: string;
};

type RegisterResponse = {
	user: Record<string, unknown>;
};

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
	try {
		const response = await fetch(`${API_URL}/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(credentials),
		});
		const data = (await response.json()) as LoginResponse & { message?: string };

		if (!response.ok) {
			throw new Error(data.message ?? 'E-mail ou senha incorretos');
		}

		return data;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}

		throw new Error('Erro ao conectar com o servidor');
	}
}

export async function register(data: RegisterData): Promise<RegisterResponse> {
	try {
		const response = await fetch(`${API_URL}/auth/users`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});
		const responseData = (await response.json()) as RegisterResponse & { message?: string };

		if (!response.ok) {
			throw new Error(responseData.message ?? 'Não foi possível criar sua conta');
		}

		return responseData;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}

		throw new Error('Erro ao conectar com o servidor');
	}
}
