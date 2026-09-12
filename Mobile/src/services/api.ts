import { authStorage } from "../utils/userLocalStorage";
import { AxiosError, create } from "axios";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';


const api = create({
	baseURL: API_URL,
	timeout: 10000,
	headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
	const token = await authStorage.getToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default api;

// ====================
// AUTH
// ====================


api.interceptors.request.use(async (config) => {
	const token = await authStorage.getToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});


type LoginCredentials = {
	email: string;
	password: string;
};

type LoginResponse = {
	user: UserResponse;
	token: string;
};

export type UserResponse = {
	id: string;
	name: string;
	email: string;
	cpf: string;
	cep: string;
	number: string;
	avatarUrl?: string | null;
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
	user: UserResponse;
};

const getErrorMessage = (error: unknown, fallback: string) => {
	if (error instanceof AxiosError) {
		return error.response?.data?.message ?? fallback;
	}
	return error instanceof Error ? error.message : fallback;
};

export async function login(
	credentials: LoginCredentials
): Promise<LoginResponse> {
	try {
		const { data } = await api.post<LoginResponse>('/auth/login', credentials);

		await authStorage.saveToken(data.token);
		await authStorage.saveUser(data.user);

		return data;
	} catch (error) {
		throw new Error(getErrorMessage(error, 'E-mail ou senha incorretos'));
	}
}

export async function register(
	data: RegisterData
): Promise<RegisterResponse> {
	try {
		const { data: responseData } = await api.post<RegisterResponse>('/auth/users', data);
		return responseData;
	} catch (error) {
		throw new Error(getErrorMessage(error, 'Não foi possível criar sua conta'));
	}
}