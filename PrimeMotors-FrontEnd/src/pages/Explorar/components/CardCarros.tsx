import { useNavigate } from "react-router-dom";

import Button from "../../../components/Button";
import type { CardCarProps } from "../../../types/types";

interface CardCarroProps {
  carro: CardCarProps;
  isFavorited?: boolean;
  onToggleFavorite: () => void;
}

export default function CardCarro({
  carro,
  isFavorited = false,
  onToggleFavorite,
}: CardCarroProps) {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(`/Explorar/${carro.id}`);
  };

  if (!carro)
    return <div className="animate-pulse bg-gray-200 w-full h-64"></div>;
  // Função para formatar o preço de forma limpa
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <div className="w-full max-w-[345px] bg-[#ffff] text-black shadow-md overflow-hidden mb-3 border border-zinc-800">
      <img
        src={carro.imgUrl}
        alt={`${carro.brand} ${carro.name}`}
        className="w-full h-48 md:h-56 lg:h-64 object-fill object-center"
      />

      <div className="p-4">
        <div className="flex items-center justify-between gap-4 mb-3">
          <h6 className="text-xl font-bold line-clamp-2 min-h-[36px]">
            <span className="font-medium text-gray-600">{carro.name}</span>
          </h6>

          <button
            type="button"
            onClick={onToggleFavorite}
            className="text-[#C59958] hover:text-[#b68745] transition-colors"
            aria-label={
              isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"
            }
          >
            <i
              className={
                isFavorited ? "bi bi-star-fill text-2xl" : "bi bi-star text-2xl"
              }
            />
          </button>
        </div>

        {/* Renderização condicional das specs (motor, tração, transmissão) */}
        <p className="text-gray-700 text-sm mb-2 line-clamp-2 min-h-[40px]">
          {carro.specs?.engine} {carro.specs?.fuel} {carro.specs?.transmission}
        </p>

        <div className="flex gap-4 mb-2">
          {carro.year && (
            <p className="text-gray-700 text-sm flex items-center gap-1">
              <i className="bi bi-calendar" /> {carro.year}
            </p>
          )}

          <p className="text-gray-700 text-sm flex items-center gap-1">
            <i className="bi bi-geo-alt"></i> São Paulo (SP)
          </p>
        </div>

        {/* Preço formatado */}
        <h6 className="text-xl font-bold mb-3">{formatPrice(carro.price)}</h6>

        <Button
          texto="Detalhes"
          onClick={handleNavigation}
          className="bg-[#121212] text-white w-full"
        />
      </div>
    </div>
  );
}
