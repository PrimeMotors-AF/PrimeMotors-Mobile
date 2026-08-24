import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
import api from "../../services/api";
import TestDriveCard from "./components/testDriveCard"; // Certifique-se de que o card está nesta pasta

export interface TestDriveCarData {
  model: string;
  name: string;
  images: Array<{ url: string }>;
}

export interface TestDriveData {
  id: string;
  scheduledAt: string;
  carId: string;
  userId: string;
  message?: string | null;
  status?: string;
  car?: TestDriveCarData;
}

export const TestDrive = () => {
  const { user } = useContext(AuthContext);
  const [agendamentos, setAgendamentos] = useState<TestDriveData[]>([]);

  // 1. Criamos a função normal, sem envolver no useCallback
  const fetchAgendamentos = () => {
    if (user?.id) {
      api
        .get(`/test-drives/user/${user.id}`)
        .then((res) => setAgendamentos(res.data))
        .catch((err) => console.error(err));
    }
  };

  // 2. O useEffect monitora apenas o id do usuário para rodar na primeira carga
  useEffect(() => {
    fetchAgendamentos();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-[#121212]  text-white p-10 pt-2">
      <div className="ml-10!">
        <h2 className="text-3xl font-light tracking-[0.4em] uppercase mb-12! border-l-[5px] border-[#C59958] pl-6!">
          Meu Agendamento
        </h2>
        <div className="flex flex-wrap gap-8 justify-start items-start w-full">
          {agendamentos.length === 0 ? (
            <p className="text-zinc-500 font-light italic pl-2">
              Nenhum agendamento de test drive no momento.
            </p>
          ) : (
            agendamentos.map((agendamento) => (
              <TestDriveCard
                key={agendamento.id}
                agendamento={agendamento}
                onDeleteSuccess={fetchAgendamentos}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TestDrive;
