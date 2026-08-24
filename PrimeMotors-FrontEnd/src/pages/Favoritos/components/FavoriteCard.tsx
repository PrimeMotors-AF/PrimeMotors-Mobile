import Button from "../../../components/Button";
import type { CardGarageProps } from "../../../types/types";

interface FavoriteCardProps {
  car: CardGarageProps;
  note: string;
  saving: boolean;
  onChangeNote: (carId: string, value: string) => void;
  onSaveNote: (car: CardGarageProps) => void;
  onRemoveFavorite: (carId: string) => void;
}

export default function FavoriteCard({
  car,
  note,
  saving,
  onChangeNote,
  onSaveNote,
  onRemoveFavorite,
}: FavoriteCardProps) {
  return (
    <div className="bg-[#1c1c1c] border border-white/10 w-80 overflow-hidden hover:border-[#C59958] transition-colors mb-3!">
      <div className="h-48 overflow-hidden">
        <img
          src={car.imgUrl || "/placeholder-car.png"}
          alt={car.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="text-white uppercase tracking-tighter font-bold text-lg">
            {car.name}
          </h3>
          <span className="text-[10px] bg-[#C59958] text-black px-2 py-1 font-bold rounded">
            Favorito
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

        {car.brand && (
          <p className="text-zinc-500 text-xs uppercase tracking-widest">
            Marca:
            <span className="text-white ml-2">{car.brand}</span>
          </p>
        )}

        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-[0.3em] text-zinc-500">
            Sua anotação
          </label>
          <textarea
            value={note}
            onChange={(event) => onChangeNote(car.id, event.target.value)}
            className="w-full min-h-[100px] rounded-sm border border-white/10 bg-[#121212] p-3 text-sm text-white outline-none focus:border-[#C59958] focus:ring-2 focus:ring-[#C59958]/30 resize-none"
            placeholder="Digite algo sobre este carro..."
          />
          <div className="flex gap-2">
            <Button
              texto={saving ? "Salvando..." : "Salvar"}
              className="flex-1 bg-[#C59958] text-black hover:bg-[#b68745]"
              onClick={() => onSaveNote(car)}
            />
            <Button
              texto="Remover"
              className="flex-1 bg-red-400 text-white hover:bg-red-700"
              onClick={() => onRemoveFavorite(car.id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
