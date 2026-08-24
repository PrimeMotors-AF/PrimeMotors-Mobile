import { useEffect, useState, useContext } from "react";

import Notification from "../../components/Notification";
import { AuthContext } from "../../contexts/authContext";
import { favoriteService } from "../../services/favoriteService";
import type { CardCarProps } from "../../types/types";
import { authStorage } from "../../utils/userLocalStorage";
import CardCarro from "./components/CardCarros";
import Carrossel from "./components/CarroselMarca";
import SideBar from "./components/SideBar";

export default function Explorar() {
  const [cars, setCars] = useState<CardCarProps[]>([]);
  const [marcaSelecionada, setMarcaSelecionada] = useState("Todos");
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<
    string[]
  >([]);
  const [notification, setNotification] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);
  const { user } = useContext(AuthContext);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const handleCategoryToggle = (category: string) => {
    console.log("Categoria clicada:", category);
    setCategoriasSelecionadas((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch("/cars");
        const data = await res.json();
        setCars(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao buscar carros:", err);
        setCars([]);
      }
    };

    fetchCars();
  }, []);

  const carsFiltrados = cars.filter((carro) => {
    // 1. Filtro de Marcas
    const matchesMarca =
      marcaSelecionada === "Todos" || carro.brand === marcaSelecionada;

    // 2. Filtro de Categorias
    // Convertemos as categorias selecionadas para minúsculo para comparar sem erro
    const categoriasLower = categoriasSelecionadas.map((c) => c.toLowerCase());

    const matchesCategoria =
      categoriasSelecionadas.length === 0 ||
      (carro.category?.name &&
        categoriasLower.includes(carro.category.name.toLowerCase()));

    return matchesMarca && matchesCategoria;
  });

  const handleDismissNotification = () => {
    setNotification(null);
  };

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 3200);
    return () => clearTimeout(timer);
  }, [notification]);

  const handleToggleFavorite = async (carId: string) => {
    const activeUser = user || authStorage.getUser();
    if (!activeUser?.id) {
      setNotification({
        message: "Faça login para adicionar aos favoritos.",
        variant: "error",
      });
      return;
    }

    try {
      const isNowFavorited = !favoriteIds.includes(carId);
      await favoriteService.toggle({ userId: activeUser.id, carId });
      setFavoriteIds((prev) =>
        isNowFavorited ? [...prev, carId] : prev.filter((id) => id !== carId),
      );
      setNotification({
        message: isNowFavorited
          ? "Carro adicionado aos favoritos."
          : "Carro removido dos favoritos.",
        variant: "success",
      });
    } catch (error) {
      console.error("Erro ao alternar favorito:", error);
      setNotification({
        message: "Não foi possível atualizar o favorito.",
        variant: "error",
      });
    }
  };

  return (
    <div className="p-3!">
      {notification ? (
        <Notification
          message={notification.message}
          variant={notification.variant}
          onClose={handleDismissNotification}
        />
      ) : null}

      <div className="w-full">
        <Carrossel onChangeMarca={setMarcaSelecionada} />
      </div>

      <div className="w-full flex">
        <SideBar
          onCategoryChange={handleCategoryToggle}
          selectedCategories={categoriasSelecionadas}
        />

        <div className="w-full px-8">
          <div className="max-w-[1350px] mx-auto grid grid-cols-1 sm:grid-cols-3 justify-items-center gap-4">
            {carsFiltrados.map((carro) => (
              <CardCarro
                key={carro.id}
                carro={carro}
                isFavorited={favoriteIds.includes(carro.id)}
                onToggleFavorite={() => handleToggleFavorite(carro.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
