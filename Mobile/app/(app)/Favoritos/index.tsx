import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { favoriteService } from "../../../src/services/favoriteService";
import { authStorage } from "../../../src/utils/userLocalStorage";

type FavoriteCar = {
  id: string;
  favoriteId?: string;
  name: string;
  brand?: string;
  imgUrl?: string | null;
  offeredValue: number;
  message?: string | null;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export default function Favoritos() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteCar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeFavorite, setActiveFavorite] = useState<FavoriteCar | null>(null);
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirmingRemoval, setIsConfirmingRemoval] = useState(false);

  const loadFavorites = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    setErrorMessage(null);

    try {
      const user = await authStorage.getUser();
      if (!user?.id) {
        router.replace("/(auth)/login");
        return;
      }

      const data = await favoriteService.getByUser(user.id);
      setFavorites(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
      setErrorMessage("Não foi possível carregar seus favoritos.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    void loadFavorites();
  }, [loadFavorites]);

  const openEditor = (favorite: FavoriteCar) => {
    setActiveFavorite(favorite);
    setNote(favorite.message ?? "");
  };

  const closeEditor = () => {
    if (!isSaving) {
      setIsConfirmingRemoval(false);
      setActiveFavorite(null);
    }
  };

  const saveNote = async () => {
    if (!activeFavorite) return;

    setIsSaving(true);
    try {
      if (activeFavorite.favoriteId) {
        await favoriteService.updateMessage(activeFavorite.favoriteId, { message: note });
      } else {
        await favoriteService.create({ carId: activeFavorite.id, message: note });
      }
      setFavorites((current) =>
        current.map((favorite) =>
          favorite.id === activeFavorite.id ? { ...favorite, message: note } : favorite,
        ),
      );
      setActiveFavorite(null);
      Alert.alert("Sucesso", "Anotação salva com sucesso.");
    } catch (error) {
      console.error("Erro ao salvar anotação:", error);
      Alert.alert("Erro", "Não foi possível salvar a anotação.");
    } finally {
      setIsSaving(false);
    }
  };

  const removeFavorite = () => {
    if (activeFavorite && !isSaving) setIsConfirmingRemoval(true);
  };

  const confirmRemoveFavorite = async () => {
    if (!activeFavorite) return;

    setIsSaving(true);
    try {
      await favoriteService.deleteByCar(activeFavorite.id);
      setFavorites((current) =>
        current.filter((favorite) => favorite.id !== activeFavorite.id),
      );
      setIsConfirmingRemoval(false);
      setActiveFavorite(null);
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
      setErrorMessage("Não foi possível remover este favorito. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#121212]">
        <ActivityIndicator color="#C59958" />
        <Text className="mt-4 text-[11px] font-light tracking-[2px] text-[#C59958]">
          CARREGANDO SEUS FAVORITOS...
        </Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        className="flex-1 bg-[#121212]"
        contentContainerStyle={{ padding: 20, paddingTop: 12, paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => void loadFavorites(true)}
            tintColor="#C59958"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-8 border-l-[5px] border-[#C59958] pl-4">
          <Text className="text-[25px] font-light tracking-[3px] text-[#F8F6F1]">
            MEUS FAVORITOS
          </Text>
        </View>

        {errorMessage ? (
          <View className="mb-5 border border-[#A94343] bg-[#351D1D] p-3">
            <Text className="text-[13px] text-[#ED8B8B]">{errorMessage}</Text>
            <Pressable onPress={() => void loadFavorites()} className="mt-3">
              <Text className="text-[11px] font-bold tracking-[1px] text-[#C59958]">
                TENTAR NOVAMENTE
              </Text>
            </Pressable>
          </View>
        ) : null}

        {favorites.length === 0 && !errorMessage ? (
          <Text className="px-1 text-[14px] italic text-[#77736D]">
            Nenhum veículo foi adicionado aos favoritos. Explore e escolha seu próximo carro.
          </Text>
        ) : (
          <View className="gap-5">
            {favorites.map((favorite) => (
              <View key={favorite.id} className="overflow-hidden border border-[#3D3933] bg-[#1C1C1C]">
                {favorite.imgUrl && !favorite.imgUrl.startsWith("/") ? (
                  <Image source={{ uri: favorite.imgUrl }} className="h-[190px] w-full" resizeMode="cover" />
                ) : (
                  <View className="h-[190px] items-center justify-center bg-[#252321]">
                    <Text className="text-[11px] tracking-[1px] text-[#77736D]">IMAGEM INDISPONÍVEL</Text>
                  </View>
                )}

                <View className="p-4">
                  <View className="mb-4 flex-row items-start justify-between gap-3">
                    <Text className="flex-1 text-[19px] font-bold uppercase text-[#F8F6F1]">{favorite.name}</Text>
                    <Text className="rounded bg-[#C59958] px-2 py-1 text-[10px] font-bold uppercase text-[#171615]">FAVORITO</Text>
                  </View>
                  {favorite.brand ? (
                    <Text className="mb-2 text-[11px] uppercase tracking-[1px] text-[#77736D]">
                      Marca: <Text className="text-[#F8F6F1]">{favorite.brand}</Text>
                    </Text>
                  ) : null}
                  <Text className="mb-2 text-[11px] uppercase tracking-[1px] text-[#77736D]">
                    Valor ofertado: <Text className="text-[#F8F6F1]">{formatCurrency(favorite.offeredValue)}</Text>
                  </Text>
                  {favorite.message ? (
                    <Text className="mt-3 border-t border-[#3D3933] pt-3 text-[12px] italic text-[#A9A49B]">&quot;{favorite.message}&quot;</Text>
                  ) : null}
                  <Pressable onPress={() => openEditor(favorite)} className="mt-5 items-center rounded bg-[#C59958] py-3">
                    <Text className="text-[12px] font-bold tracking-[1px] text-[#171615]">EDITAR ANOTAÇÃO</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal visible={activeFavorite !== null} transparent animationType="fade" onRequestClose={closeEditor}>
        <View className="flex-1 justify-center bg-black/75 p-5">
          <View className="border border-[#3D3933] bg-[#121212] p-5">
            <Text className="mb-6 border-b border-[#3D3933] pb-4 text-center text-[20px] font-light tracking-[2px] text-[#F8F6F1]">
              EDITAR ANOTAÇÃO
            </Text>
            <Text className="mb-2 text-[11px] font-bold tracking-[1px] text-[#A9A49B]">SUA ANOTAÇÃO</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={5}
              editable={!isSaving}
              placeholder="Digite algo sobre este carro..."
              placeholderTextColor="#77736D"
              className="mb-6 min-h-[120px] border border-[#3D3933] bg-[#1C1C1C] p-3 text-[15px] text-[#F8F6F1]"
            />
            <Pressable disabled={isSaving} onPress={() => void saveNote()} className="items-center rounded bg-[#C59958] py-3 disabled:opacity-50">
              {isSaving ? <ActivityIndicator color="#171615" /> : <Text className="text-[12px] font-bold tracking-[1px] text-[#171615]">SALVAR ANOTAÇÃO</Text>}
            </Pressable>
            <Pressable disabled={isSaving} onPress={closeEditor} className="mt-3 items-center py-3">
              <Text className="text-[12px] tracking-[1px] text-[#A9A49B]">CANCELAR</Text>
            </Pressable>
            {isConfirmingRemoval ? (
              <View className="mt-2 border border-[#A94343] bg-[#351D1D] p-3">
                <Text className="mb-3 text-center text-[12px] text-[#ED8B8B]">
                  Deseja remover este veículo dos favoritos?
                </Text>
                <View className="flex-row gap-2">
                  <Pressable
                    disabled={isSaving}
                    onPress={() => setIsConfirmingRemoval(false)}
                    className="flex-1 items-center border border-[#3D3933] py-3 disabled:opacity-50"
                  >
                    <Text className="text-[11px] font-bold tracking-[1px] text-[#A9A49B]">CANCELAR</Text>
                  </Pressable>
                  <Pressable
                    disabled={isSaving}
                    onPress={() => void confirmRemoveFavorite()}
                    className="flex-1 items-center bg-[#A94343] py-3 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text className="text-[11px] font-bold tracking-[1px] text-white">REMOVER</Text>
                    )}
                  </Pressable>
                </View>
              </View>
            ) : (
              <Pressable disabled={isSaving} onPress={removeFavorite} className="mt-2 items-center py-2">
                <Text className="text-[11px] font-bold tracking-[1px] text-[#ED8B8B]">REMOVER DOS FAVORITOS</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}