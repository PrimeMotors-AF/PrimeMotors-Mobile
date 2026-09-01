import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Carrossel from "./components/CarroselMarca";
import CardCarro from "./components/CardCarros";
import SideBar from "./components/SideBar";

import type { CardCarProps } from "../../../src/types/types";
import { favoriteService } from "../../../src/services/favoriteService";
import { authStorage } from "../../../src/utils/userLocalStorage";

export default function Explorar() {
  const [cars, setCars] = useState<CardCarProps[]>([]);

  const [marcaSelecionada, setMarcaSelecionada] =
    useState("Todos");

  const [categoriasSelecionadas, setCategoriasSelecionadas] =
    useState<string[]>([]);

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const handleCategoryToggle = (category: string) => {
    setCategoriasSelecionadas((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("/cars");
        const data = await response.json();

        setCars(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erro ao buscar carros:", error);
        setCars([]);
      }
    };

    fetchCars();
  }, []);

  const carsFiltrados = cars.filter((carro) => {
    const matchesMarca =
      marcaSelecionada === "Todos" ||
      carro.brand === marcaSelecionada;

    const categoriasLower =
      categoriasSelecionadas.map((categoria) =>
        categoria.toLowerCase(),
      );

    const matchesCategoria =
      categoriasSelecionadas.length === 0 ||
      (carro.category?.name &&
        categoriasLower.includes(
          carro.category.name.toLowerCase(),
        ));

    return matchesMarca && matchesCategoria;
  });

  const handleToggleFavorite = async (carId: string) => {
    const user = await authStorage.getUser();

    if (!user?.id) {
      console.log(
        "Faça login para adicionar aos favoritos.",
      );
      return;
    }

    try {
      const isNowFavorited =
        !favoriteIds.includes(carId);

      await favoriteService.toggle({
        userId: user.id,
        carId,
      });

      setFavoriteIds((prev) =>
        isNowFavorited
          ? [...prev, carId]
          : prev.filter((id) => id !== carId),
      );
    } catch (error) {
      console.error(
        "Erro ao alternar favorito:",
        error,
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* CARROSSEL DE MARCAS */}
      <Carrossel
        onChangeMarca={setMarcaSelecionada}
      />

      {/* ÁREA DE FILTROS E CARROS */}
      <View style={styles.content}>
        <SideBar
          onCategoryChange={handleCategoryToggle}
          selectedCategories={categoriasSelecionadas}
        />

        <View style={styles.carsContainer}>
          {carsFiltrados.map((carro) => (
            <CardCarro
              key={carro.id}
              carro={carro}
              isFavorited={favoriteIds.includes(
                carro.id,
              )}
              onToggleFavorite={() =>
                handleToggleFavorite(carro.id)
              }
            />
          ))}

          {carsFiltrados.length === 0 && (
            <Text style={styles.emptyText}>
              Nenhum veículo encontrado.
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  content: {
    flexDirection: "row",
    width: "100%",
  },

  carsContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingBottom: 20,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: "#666",
  },
});
