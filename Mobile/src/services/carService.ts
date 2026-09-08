const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function getCars() {
  const response = await fetch(`${API_URL}/cars`);

  if (!response.ok) {
    throw new Error('Erro ao buscar carros');
  }

  return response.json();
}