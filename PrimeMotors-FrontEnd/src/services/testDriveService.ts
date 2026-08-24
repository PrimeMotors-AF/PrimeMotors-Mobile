import api from "./api";

// Definição das interfaces de tipos para o Service
export interface CarImages {
  id: string;
  url: string;
  carId: string;
}

export interface TestDriveCarType {
  id: string;
  model: string;
  name: string; 
  images: CarImages[];
}

export interface TestDriveType {
  id: string;
  scheduledAt: string;
  carId: string;
  userId: string;
  message?: string | null;
  status?: string;
  car?: TestDriveCarType;
}

export const testDriveService = {
  // Criar um agendamento
  criar: async (dados: { carId: string; userId: string; scheduledAt: string; message?: string }): Promise<TestDriveType> => {
    const response = await api.post("/test-drives", dados);
    return response.data;
  },

  // Buscar agendamentos de um usuário específico
  buscarPorUsuario: async (userId: string): Promise<TestDriveType[]> => {
    const response = await api.get(`/test-drives/user/${userId}`);
    return response.data;
  },

  // Atualizar o agendamento (Mantendo o seu nome: atualizarData)
  atualizarData: async (id: string, dados: { scheduledAt?: string; message?: string }): Promise<TestDriveType> => {
    const response = await api.put(`/test-drives/${id}`, dados);
    return response.data;
  },

  // Eliminar um agendamento (Mantendo o seu nome: excluir)
  excluir: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/test-drives/${id}`);
    return response.data;
  }
};