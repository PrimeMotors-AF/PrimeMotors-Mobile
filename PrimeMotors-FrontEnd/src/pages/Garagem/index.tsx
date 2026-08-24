import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { AuthContext } from "../../contexts/authContext";
import garageService from "../../services/garageService";
import type { CardGarageProps } from "../../types/types";
import { authStorage } from "../../utils/userLocalStorage";
import GarageCard from "./components/garageCard";

export default function Garagem() {
  const [garageCars, setGarageCars] = useState<CardGarageProps[]>([]);
  const [loadingGarage, setLoadingGarage] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [statusType, setStatusType] = useState<"success" | "error">("success");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const activeUser = user || authStorage.getUser();

    if (!activeUser?.id) {
      navigate("/Login");
      return;
    }
    if (!id || id !== activeUser.id) {
      navigate(`/Garagem/${activeUser.id}`);
      return;
    }

    const fetchGarage = async () => {
      try {
        setLoadingGarage(true);
        setGarageCars(await garageService.getUserProposals(id));
      } catch (error) {
        console.error("Erro ao buscar garagem:", error);
      } finally {
        setLoadingGarage(false);
      }
    };

    fetchGarage();
  }, [user, id, navigate]);

  if (loadingGarage) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center text-[#C59958] tracking-[0.2em] uppercase font-light">
        Carregando sua coleção...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-10 pt-2">
      <div className="ml-10!">
        <h2 className="text-3xl font-light tracking-[0.4em] uppercase mb-12! border-l-[5px] border-[#C59958] pl-6!">
          Minha Garagem
        </h2>

        {statusMessage && (
          <div
            className={`mb-6 rounded-sm border p-4 text-sm ${
              statusType === "success"
                ? "border-emerald-400 bg-emerald-500/10 text-emerald-200"
                : "border-red-500 bg-red-500/10 text-red-200"
            }`}
          >
            {statusMessage}
          </div>
        )}

        <div className="flex flex-wrap gap-8">
          {garageCars.length > 0 ? (
            garageCars.map((car) => (
              <GarageCard
                key={`garage-${car.id}`}
                car={car}
                onUpdate={async (_, offeredValue, message) => {
                  try {
                    await garageService.updateCarProposal(car.id, {
                      offeredValue,
                      message,
                    });
                    setGarageCars((prev) =>
                      prev.map((item) =>
                        item.id === car.id
                          ? { ...item, offeredValue, message }
                          : item,
                      ),
                    );
                    setStatusType("success");
                    setStatusMessage("Proposta atualizada com sucesso.");
                  } catch (error) {
                    console.error("Erro ao atualizar proposta:", error);
                    setStatusType("error");
                    setStatusMessage("Não foi possível atualizar a proposta.");
                  }
                }}
                onDelete={async () => {
                  try {
                    await garageService.deleteCarProposal(car.id);
                    setGarageCars((prev) =>
                      prev.filter((item) => item.id !== car.id),
                    );
                    setStatusType("success");
                    setStatusMessage("Proposta excluída com sucesso.");
                  } catch (error) {
                    console.error("Erro ao excluir proposta:", error);
                    setStatusType("error");
                    setStatusMessage("Não foi possível excluir a proposta.");
                  }
                }}
              />
            ))
          ) : (
            <p className="text-zinc-500 font-light italic pl-2">
              Nenhum veículo em sua garagem no momento.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
