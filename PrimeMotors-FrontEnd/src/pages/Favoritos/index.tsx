import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { AuthContext } from "../../contexts/authContext";
import { favoriteService } from "../../services/favoriteService";
import type { CardGarageProps } from "../../types/types";
import { authStorage } from "../../utils/userLocalStorage";
import useFavorites from "../Garagem/hooks/useFavorites";
import FavoriteCard from "./components/FavoriteCard";

export default function Favoritos() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { favorites, loading, handleToggleFavorite, refresh } = useFavorites(
    id || "",
  );
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [statusType, setStatusType] = useState<"success" | "error">("success");

  useEffect(() => {
    const initialNotes = Object.fromEntries(
      favorites.map((car) => [car.id, car.message || ""]),
    );
    setNotes(initialNotes);
  }, [favorites]);

  const handleNoteChange = (carId: string, value: string) => {
    setNotes((prev) => ({ ...prev, [carId]: value }));
  };

  const handleSaveNote = async (car: CardGarageProps) => {
    setSaving((prev) => ({ ...prev, [car.id]: true }));

    try {
      const message = notes[car.id] ?? "";
      if (car.favoriteId) {
        await favoriteService.updateMessage(car.favoriteId, { message });
      } else {
        await favoriteService.create({ carId: car.id, message });
      }
      await refresh();
      setStatusType("success");
      setStatusMessage("Anotação salva com sucesso.");
    } catch (error) {
      console.error("Erro ao salvar anotação:", error);
      setStatusType("error");
      setStatusMessage("Não foi possível salvar a anotação.");
    } finally {
      setSaving((prev) => ({ ...prev, [car.id]: false }));
    }
  };

  const handleRemoveFavorite = async (carId: string) => {
    try {
      await handleToggleFavorite(carId);
      setStatusType("success");
      setStatusMessage("Favorito removido com sucesso.");
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
      setStatusType("error");
      setStatusMessage("Não foi possível remover o favorito.");
    }
  };

  const activeUser = user || authStorage.getUser();

  useEffect(() => {
    if (!activeUser?.id) {
      navigate("/Login");
      return;
    }

    if (!id || id !== activeUser.id) {
      navigate(`/ListaDeDesejos/${activeUser.id}`);
      return;
    }
  }, [activeUser, id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center text-[#C59958] tracking-[0.2em] uppercase font-light">
        Carregando sua lista de desejos...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-10 pt-2">
      <div className="ml-10!">
        <h2 className="text-3xl font-light tracking-[0.4em] uppercase mb-12! border-l-[5px] border-[#C59958] pl-6!">
          Meus Favoritos
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

        <div className="flex flex-wrap gap-8 items-stretch">
          {favorites.length > 0 ? (
            favorites.map((car: CardGarageProps) => (
              <FavoriteCard
                key={`wishlist-${car.id}`}
                car={car}
                note={notes[car.id] ?? ""}
                saving={Boolean(saving[car.id])}
                onChangeNote={handleNoteChange}
                onSaveNote={handleSaveNote}
                onRemoveFavorite={handleRemoveFavorite}
              />
            ))
          ) : (
            <p className="text-zinc-500 font-light italic pl-2">
              Nenhum veículo foi adicionado ainda. Explore e adicione seus
              carros favoritos.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
