import { useState, useEffect } from "react";
import Notification from "../../../components/Notification";
import { testDriveService } from "../../../services/testDriveService";
import { Button } from "../../UserProfile/Components";

// 1. Definimos a estrutura exata que o agendamento pode ter ao entrar no Modal
interface TestDriveCarData {
  model: string;
  name: string;
  images: Array<{ url: string }>;
}

interface TestDriveData {
  id: string;
  scheduledAt: string;
  carId: string;
  userId: string;
  message?: string | null;
  status?: string;
  car?: TestDriveCarData;
}

// 2. Aplicamos a tipagem segura na propriedade do Modal
interface TestDriveModalProps {
  carId: string;
  userId: string;
  onClose: () => void;
  agendamentoInicial?: TestDriveData | null; 
  isOpen?: boolean;           
  onSuccess?: (msg: string) => void;  
  onError?: (msg: string) => void;    
}

export default function TestDriveModal({
  carId,
  userId,
  onClose,
  agendamentoInicial,
}: TestDriveModalProps) {
  const [scheduledAt, setScheduledAt] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);

  // Efeito para preencher os campos se for Modo Edição
  useEffect(() => {
    if (agendamentoInicial?.scheduledAt) {
      try {
        // Converte a data de forma segura para o input datetime-local
        const dataFormatada = new Date(agendamentoInicial.scheduledAt)
          .toISOString()
          .slice(0, 16);
        setScheduledAt(dataFormatada);
        setMessage(agendamentoInicial.message || "");
      } catch (err) {
        console.error("Erro ao formatar data inicial:", err);
      }
    }
  }, [agendamentoInicial]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!scheduledAt) {
      setNotification({ message: "Selecione uma data válida.", variant: "error" });
      return;
    }

    setLoading(true);
    try {
      if (agendamentoInicial?.id) {
        // MODO EDIÇÃO
        await testDriveService.atualizarData(agendamentoInicial.id, {
          scheduledAt: new Date(scheduledAt).toISOString(),
          message: message.trim() || undefined,
        });
        setNotification({ message: "Agendamento atualizado com sucesso!", variant: "success" });
      } else {
        // MODO CRIAÇÃO
        await testDriveService.criar({
          scheduledAt: new Date(scheduledAt).toISOString(),
          carId,
          userId,
          message: message.trim() || undefined,
        });
        setNotification({ message: "Test Drive agendado com sucesso!", variant: "success" });
      }

      setTimeout(onClose, 1500);
    } catch (error: unknown) {
      console.error("Erro na operação:", error);
      
      // Tratamento de erro seguro para a tipagem 'unknown' do bloco catch
      let errorMessage = "Ocorreu um erro ao salvar.";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: { error?: string } } };
        if (axiosError.response?.data?.error) {
          errorMessage = axiosError.response.data.error;
        }
      }

      setNotification({ 
        message: errorMessage, 
        variant: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Notification
        message={notification?.message ?? ""}
        variant={notification?.variant ?? "success"}
        onClose={() => setNotification(null)}
      />
      
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[#121212] border border-white/20 w-full max-w-xl shadow-2xl p-2 animate-fadeIn">
          <div className="p-6 border-b border-white/10 text-center">
            <h2 className="text-white text-2xl font-light tracking-[0.3em] uppercase">
              {agendamentoInicial ? "Editar Agendamento" : "Agendar Test Drive"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                Data e Horário Pretendido *
              </label>
              <input
                type="datetime-local"
                required
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 py-2 text-white outline-none focus:border-[#C59958]"
                style={{ colorScheme: "dark" }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                Observações / Mensagem (Opcional)
              </label>
              <textarea
                rows={3}
                placeholder="Ex: Detalhes adicionais..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-3 text-white outline-none focus:border-[#C59958] placeholder-gray-600"
              />
            </div>

            <div className="flex flex-col pt-4">
              <Button
                texto={loading ? "Salvando..." : agendamentoInicial ? "Salvar Alterações" : "Confirmar Agendamento"}
                type="submit"
                className="text-gray-50 font-bold"
              />
              <Button
                texto="Cancelar"
                type="button"
                onClick={onClose}
                className="text-gray-50 hover:text-red-500!"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}