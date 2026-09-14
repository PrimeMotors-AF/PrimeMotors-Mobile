import api from "./api";
import type {
  CreateTestDrivePayload,
  TestDriveAppointment,
  UpdateTestDrivePayload,
} from "../types/testDrive";

export const testDriveService = {
  criar: async (dados: CreateTestDrivePayload): Promise<TestDriveAppointment> => {
    const response = await api.post("/test-drives", dados);
    return response.data;
  },

  // Buscar agendamentos de um usuário específico
  buscarPorUsuario: async (userId: string): Promise<TestDriveAppointment[]> => {
    const response = await api.get(`/test-drives/user/${userId}`);
    return response.data;
  },

  // Atualizar o agendamento (Mantendo o seu nome: atualizarData)
  atualizarData: async (id: string, dados: UpdateTestDrivePayload): Promise<TestDriveAppointment> => {
    const response = await api.put(`/test-drives/${id}`, dados);
    return response.data;
  },

  // Eliminar um agendamento (Mantendo o seu nome: excluir)
  excluir: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/test-drives/${id}`);
    return response.data;
  }
};