import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL =
	process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

const api = axios.create({
	baseURL: API_URL,
	timeout: 5000,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use(async (config) => {
	const token = await AsyncStorage.getItem("token");

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

// ====================
// AUTH
// ====================

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

export async function login(
	credentials: LoginCredentials
): Promise<LoginResponse> {
	try {
		const response = await api.post<LoginResponse>(
			"/auth/login",
			credentials
		);

		const data = response.data;

		// Salva o token para as próximas requisições
		await AsyncStorage.setItem("token", data.token);

		return data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				error.response?.data?.message ??
					"E-mail ou senha incorretos"
			);
		}

		throw new Error("Erro ao conectar com o servidor");
	}
}

export async function register(
	data: RegisterData
): Promise<RegisterResponse> {
	try {
		const response = await api.post<RegisterResponse>(
			"/auth/users",
			data
		);

		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				error.response?.data?.message ??
					"Não foi possível criar sua conta"
			);
		}

		throw new Error("Erro ao conectar com o servidor");
	}
}

export default api;