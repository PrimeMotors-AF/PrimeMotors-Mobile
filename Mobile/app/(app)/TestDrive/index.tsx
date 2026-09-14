import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

import TestDriveModal from "../../../src/components/detalhes/testDriveModal";
import { testDriveService } from "../../../src/services/testDriveService";
import type { TestDriveAppointment } from "../../../src/types/testDrive";
import { authStorage } from "../../../src/utils/userLocalStorage";

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Data não informada"
    : new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(date);
};

export default function TestDrivePage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<TestDriveAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeAppointment, setActiveAppointment] = useState<TestDriveAppointment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadAppointments = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    setErrorMessage(null);

    try {
      const user = await authStorage.getUser();
      if (!user?.id) {
        router.replace("/(auth)/login");
        return;
      }
      setAppointments(await testDriveService.buscarPorUsuario(user.id));
    } catch (error) {
      console.error("Erro ao carregar test drives:", error);
      setErrorMessage(error instanceof Error ? error.message : "Não foi possível carregar seus test drives.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    void loadAppointments();
  }, [loadAppointments]);

  const closeEditor = () => {
    if (!isDeleting) setActiveAppointment(null);
  };

  const deleteAppointment = async (appointment: TestDriveAppointment) => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      await testDriveService.excluir(appointment.id);
      setAppointments((current) => current.filter((item) => item.id !== appointment.id));
      setActiveAppointment(null);
    } catch (error) {
      console.error("Erro ao excluir test drive:", error);
      setErrorMessage(error instanceof Error ? error.message : "Não foi possível excluir o test drive.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#121212]">
        <ActivityIndicator color="#C59958" />
        <Text className="mt-4 text-[11px] font-light tracking-[2px] text-[#C59958]">CARREGANDO SEUS TEST DRIVES...</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        className="flex-1 bg-[#121212]"
        contentContainerStyle={{ padding: 20, paddingTop: 12, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => void loadAppointments(true)} tintColor="#C59958" />}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-8 border-l-[5px] border-[#C59958] pl-4">
          <Text className="text-[25px] font-light tracking-[3px] text-[#F8F6F1]">MEUS TEST DRIVES</Text>
        </View>

        {errorMessage ? (
          <View className="mb-5 border border-[#A94343] bg-[#351D1D] p-3">
            <Text className="text-[13px] text-[#ED8B8B]">{errorMessage}</Text>
            <Pressable onPress={() => void loadAppointments()} className="mt-3">
              <Text className="text-[11px] font-bold tracking-[1px] text-[#C59958]">TENTAR NOVAMENTE</Text>
            </Pressable>
          </View>
        ) : null}

        {appointments.length === 0 && !errorMessage ? (
          <Text className="px-1 text-[14px] italic text-[#77736D]">Nenhum test drive agendado no momento.</Text>
        ) : (
          <View className="gap-5">
            {appointments.map((appointment) => (
              <View key={appointment.id} className="overflow-hidden border border-[#3D3933] bg-[#1C1C1C]">
                {appointment.car?.images?.[0]?.url ? (
                  <Image source={{ uri: appointment.car.images[0].url }} className="h-[190px] w-full" resizeMode="cover" />
                ) : (
                  <View className="h-[190px] items-center justify-center bg-[#252321]">
                    <Text className="text-[11px] tracking-[1px] text-[#77736D]">IMAGEM INDISPONÍVEL</Text>
                  </View>
                )}
                <View className="p-4">
                  <View className="mb-4 flex-row items-start justify-between gap-3">
                    <Text className="flex-1 text-[19px] font-bold uppercase text-[#F8F6F1]">{appointment.car?.name ?? "Test Drive"}</Text>
                    <Text className="rounded bg-[#C59958] px-2 py-1 text-[10px] font-bold uppercase text-[#171615]">{appointment.status ?? "Pendente"}</Text>
                  </View>
                  <Text className="mb-2 text-[11px] uppercase tracking-[1px] text-[#77736D]">
                    Veículo: <Text className="text-[#F8F6F1]">{appointment.car?.model ?? "Não informado"}</Text>
                  </Text>
                  <Text className="text-[11px] uppercase tracking-[1px] text-[#77736D]">
                    Data: <Text className="text-[#F8F6F1]">{formatDate(appointment.scheduledAt)}</Text>
                  </Text>
                  {appointment.message ? <Text className="mt-3 border-t border-[#3D3933] pt-3 text-[12px] italic text-[#A9A49B]">&quot;{appointment.message}&quot;</Text> : null}
                  <Pressable onPress={() => setActiveAppointment(appointment)} className="mt-5 items-center bg-[#C59958] py-3">
                    <Text className="text-[12px] font-bold tracking-[1px] text-[#171615]">EDITAR AGENDAMENTO</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {activeAppointment ? (
        <TestDriveModal
          isOpen
          carId={activeAppointment.carId}
          userId={activeAppointment.userId}
          agendamentoInicial={activeAppointment}
          onClose={() => {
            closeEditor();
            void loadAppointments(true);
          }}
          onDelete={() => deleteAppointment(activeAppointment)}
        />
      ) : null}
    </>
  );
}
