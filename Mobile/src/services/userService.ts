import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export type ProfileUser = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  cep: string;
  number: string;
  avatarUrl?: string | null;
  role?: "user" | "admin";
};

const request = async (path: string, options: RequestInit = {}) => {
  const token = await AsyncStorage.getItem("token");
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(data?.message ?? data?.error ?? "Não foi possível concluir a operação.") as Error & {
      status?: number;
    };
    error.status = response.status;
    throw error;
  }

  return data;
};

export const userService = {
  getProfile: (id: string) => request(`/users/${id}`) as Promise<ProfileUser>,
  updateProfile: (id: string, data: Record<string, string>) =>
    request(`/users/${id}`, { method: "PATCH", body: JSON.stringify(data) }) as Promise<ProfileUser>,
  uploadAvatar: (id: string, formData: FormData) =>
    request(`/users/${id}/avatar`, {
      method: "PATCH",
      body: formData,
    }) as Promise<ProfileUser>,
  removeAvatar: (id: string) =>
    request(`/users/${id}/avatar`, {
      method: "PATCH",
      body: JSON.stringify({ avatarUrl: null }),
    }) as Promise<ProfileUser>,
  deleteProfile: (id: string) => request(`/users/${id}`, { method: "DELETE" }),
};