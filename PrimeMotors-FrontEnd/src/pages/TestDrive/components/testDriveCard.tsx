import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { testDriveService } from "../../../services/testDriveService";
import TestDriveModal from "../../ProdutoCard/components/testDriveModal";
import type { TestDriveData } from "../index";

export interface TestDriveCardProps {
  agendamento: TestDriveData; // Obrigatório aqui!
  onDeleteSuccess?: () => void;
}

const getStatusBadge = (status?: string) => {
  const currentStatus = status ? status.toUpperCase() : "PENDENTE";
  const statusMap: Record<string, { label: string; color: string }> = {
    PENDENTE: { label: "Pendente", color: "text-amber-500 bg-amber-500/10" },
    CONFIRMADO: { label: "Confirmado", color: "text-emerald-500 bg-emerald-500/10" },
    CANCELADO: { label: "Cancelado", color: "text-rose-500 bg-rose-500/10" },
    REALIZADO: { label: "Realizado", color: "text-blue-500 bg-blue-500/10" },
  };

  const current = statusMap[currentStatus] || { label: currentStatus, color: "text-gray-400 bg-gray-500/10" };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${current.color}`}>
      {current.label}
    </span>
  );
};

export const TestDriveCard = ({ agendamento, onDeleteSuccess }: TestDriveCardProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const handleDelete = async () => {
    if (window.confirm("Deseja realmente eliminar este agendamento?")) {
      try {
        await testDriveService.excluir(agendamento.id);
        alert("Agendamento eliminado com sucesso!");
        if (onDeleteSuccess) onDeleteSuccess();
      } catch (error) {
        console.error("Erro ao eliminar:", error);
      }
    }
  };

  const carImage = agendamento.car?.images?.[0]?.url || null;

  return (
    <>
      <div className="bg-[#121212] border border-white/10  w-80 h-150 overflow-hidden max-w-sm  shadow-xl flex flex-col justify-between">
        <div className="relative h-48 w-full bg-neutral-900 overflow-hidden">
          {carImage ? (
            <img src={carImage} alt={agendamento.car?.model} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs uppercase tracking-widest">
              Prime Motors
            </div>
          )}
         
        </div>

        <div className="p-5 flex flex-col space-y-4">
          <div>
            <h3 className="text-white font-light text-xl tracking-wide uppercase">
              {agendamento.car?.model || "Test Drive"}
            </h3>
            <p className="text-gray-500 text-xs tracking-wider uppercase mt-1">
              {agendamento.car?.name || "Premium Vehicle"}
            </p>
          </div>

          <div className="border-t border-white/5 pt-3 space-y-3">
            <div className="">
              <span className="text-[9px] uppercase tracking-widest text-gray-500 block font-bold">Status</span>
              <span className="text-sm text-gray-200 ">{getStatusBadge(agendamento.status)}</span>
              <span className="text-[9px] uppercase tracking-widest text-gray-500 block font-bold">Data e Horário</span>
              <span className="text-sm text-gray-200">
                {new Date(agendamento.scheduledAt).toLocaleString("pt-BR", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-widest text-gray-500 block font-bold">Observações</span>
              <p className="text-sm text-gray-300 italic font-light">"{agendamento.message || "Nenhuma observação informada."}"</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 grid grid-cols-2 bg-black/20">
          <button onClick={() => setIsEditModalOpen(true)} className="flex items-center justify-center gap-2 py-3 text-xs uppercase tracking-widest text-gray-400 hover:text-[#C59958] hover:bg-white/5 transition-all border-r border-white/10">
            <FaEdit /> Editar
          </button>
          <button onClick={handleDelete} className="flex items-center justify-center gap-2 py-3 text-xs uppercase tracking-widest text-gray-400 hover:text-red-500 hover:bg-white/5 transition-all">
            <FaTrash /> Excluir
          </button>
        </div>
      </div>

      {isEditModalOpen && (
        <TestDriveModal
          carId={agendamento.carId}
          userId={agendamento.userId}
          agendamentoInicial={agendamento}
          onClose={() => {
            setIsEditModalOpen(false);
            if (onDeleteSuccess) onDeleteSuccess();
          }}
        />
      )}
    </>
  );
};

export default TestDriveCard;