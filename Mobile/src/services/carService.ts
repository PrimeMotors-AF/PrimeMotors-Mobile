import { API_URL } from "./apiConfig";

export async function getCars() {
  const response = await fetch(`${API_URL}/cars`);

  if (!response.ok) {
    throw new Error('Erro ao buscar carros');
  }

  return response.json();
}