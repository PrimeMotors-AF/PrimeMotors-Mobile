import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import Button from "../../../components/Button";
import Notification from "../../../components/Notification";
import type { GarageProposalModalProps } from "../../../types/types";

export default function GarageProposalModal({
  isOpen,
  offeredValue,
  message,
  onClose,
  onSave,
  onDelete,
}: GarageProposalModalProps) {
  const [value, setValue] = useState(offeredValue.toString());
  const [text, setText] = useState(message || "");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setValue(offeredValue !== undefined ? offeredValue.toString() : "");
      setText(message || "");
    }
  }, [isOpen, offeredValue, message]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsedValue = parseFloat(value.replace(",", "."));

    if (Number.isNaN(parsedValue) || parsedValue <= 0) {
      setNotification({ message: "Insira um valor válido.", variant: "error" });
      return;
    }

    setLoading(true);
    try {
      await onSave(parsedValue, text);
      setNotification({
        message: "Proposta salva com sucesso!",
        variant: "success",
      });
      setTimeout(onClose, 700);
    } catch (error) {
      console.error(error);
      setNotification({
        message: "Erro ao salvar a proposta. Tente novamente.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setShowDeleteConfirm(false);
    setLoading(true);

    try {
      await onDelete();
      setNotification({
        message: "Proposta excluída com sucesso.",
        variant: "success",
      });
      setTimeout(onClose, 700);
    } catch (error) {
      console.error(error);
      setNotification({
        message: "Erro ao excluir a proposta. Tente novamente.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Notification
        message={notification?.message ?? ""}
        variant={notification?.variant ?? "success"}
        onClose={() => setNotification(null)}
      />
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[#121212] border border-white/20 w-full max-w-2xl shadow-2xl p-2">
          <div className="p-6 border-b border-white/10 text-center">
            <h2 className="text-white text-2xl font-light tracking-[0.3em] uppercase">
              Editar Proposta
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col p-6! space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                Valor (R$)
              </label>
              <input
                type="number"
                required
                disabled={loading}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 py-2 text-white outline-none focus:border-[#C59958] transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                Mensagem
              </label>
              <textarea
                rows={4}
                disabled={loading}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-3 text-white outline-none focus:border-[#C59958] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button
                texto={loading ? "Processando..." : "Salvar Alterações"}
                type="submit"
                className="w-full font-bold"
              />
              <Button
                texto="Cancelar"
                type="button"
                onClick={onClose}
                className="w-full text-gray-400"
              />
              <button
                type="button"
                disabled={loading}
                onClick={handleDelete}
                className="w-full text-gray-400 hover:text-red-600! transition-all uppercase text-xs tracking-widest "
              >
                Excluir Proposta
              </button>
            </div>
          </form>
        </div>
      </div>
      {showDeleteConfirm ? (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#121212] border border-white/20 p-6! max-w-md w-full">
            <p className="text-white mb-6">Deseja excluir esta proposta?</p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-white/20 text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
