// src/pages/Garagem/components/garageCard.tsx
import { useState } from "react";

import Button from "../../../components/Button";
import type { CardGarageProps } from "../../../types/types";
import GarageProposalModal from "./garageProposalModal";

interface GarageCardComponentProps {
  car: CardGarageProps;
  onUpdate?: (
    id: string,
    offeredValue: number,
    message: string,
  ) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export default function GarageCard({
  car,
  onUpdate,
  onDelete,
}: GarageCardComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-[#1c1c1c] border border-white/10 w-80 overflow-hidden hover:border-[#C59958] transition-colors">
        <div className="h-48 overflow-hidden">
          <img
            src={car.imgUrl || "/placeholder-car.png"}
            alt={car.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-2 space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="text-white uppercase tracking-tighter font-bold text-lg">
              {car.name}
            </h3>
            <span className="text-[10px] bg-[#C59958] text-black px-2 py-1 font-bold rounded">
              {car.status}
            </span>
          </div>

          <p className="text-zinc-500 text-xs uppercase tracking-widest">
            Valor Ofertado:
            <span className="text-white ml-2">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(car.offeredValue)}
            </span>
          </p>
          
          <p className="text-zinc-500 text-xs uppercase tracking-widest">
            Data da Proposta:
            <span className="text-white ml-2">
              {new Intl.DateTimeFormat("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }).format(new Date(car.date_offer))}
            </span>
          </p>

          {car.message && (
            <p className="text-zinc-400 text-xs italic border-t border-white/5 pt-2">
              "{car.message}"
            </p>
          )}
        </div>
        <div className="text-center p-2">
          <Button
            texto="Editar Proposta"
            className="w-full"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      </div>

      <GarageProposalModal
        isOpen={isModalOpen}
        offeredValue={car.offeredValue}
        message={car.message}
        onClose={() => setIsModalOpen(false)}
        onSave={(value, msg) =>
          onUpdate?.(car.id, value, msg) ?? Promise.resolve()
        }
        onDelete={() => onDelete?.(car.id) ?? Promise.resolve()}
      />
    </>
  );
}
