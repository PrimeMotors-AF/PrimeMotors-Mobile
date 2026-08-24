import { useState } from "react";

import Notification from "../../../components/Notification";
import garageService from "../../../services/garageService";
import type { ProposalModalProps } from "../../../types/types";
import { Button } from "../../UserProfile/Components";

export default function ProposalModal({
  carId,
  userId,
  onClose,
}: ProposalModalProps) {
  const [offeredValue, setOfferedValue] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!offeredValue || parseFloat(offeredValue) <= 0) {
      setNotification({ message: "Insira um valor válido.", variant: "error" });
      return;
    }

    setLoading(true);
    try {
      // Chamada correta através do objeto garageService
      await garageService.sendCarProposal({
        offeredValue: parseFloat(offeredValue),
        message,
        carId,
        userId,
      });
      setNotification({
        message: "Proposta enviada com sucesso!",
        variant: "success",
      });
      setTimeout(onClose, 700);
    } catch (error) {
      console.error("Erro ao enviar:", error);
      setNotification({
        message:
          "Erro ao enviar proposta.",
        variant: "error",
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
      <div className="fixed inset-0 bg-black/20  flex items-center justify-center z-50 p-4">
        <div className="bg-[#121212] border border-white/20 w-full max-w-4xl shadow-2xl p-2">
          <div className="p-6 border-b border-white/10 text-center">
            <h2 className="text-white text-2xl font-light tracking-[0.3em] uppercase">
              Proposta
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col p-6! space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                Valor (R$)
              </label>
              <input
                type="number"
                required
                value={offeredValue}
                onChange={(e) => setOfferedValue(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 py-2 text-white outline-none focus:border-[#C59958]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                Mensagem
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-3 text-white outline-none focus:border-[#C59958]"
              />
            </div>

            <div className="flex flex-col pt-4">
              <Button
                texto={loading ? "Enviando..." : "Confirmar Proposta"}
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
