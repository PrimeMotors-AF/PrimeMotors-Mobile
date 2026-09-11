import { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import Notification from "@/components/detalhes/notification";
import { testDriveService } from "@/services/testDriveService";
import Button from "@/components/button";

interface TestDriveCarData {
  model: string;
  name: string;
  images: Array<{ url: string }>;
}

interface TestDriveData {
  id: string;
  scheduledAt: string;
  carId: string;
  userId: string;
  message?: string | null;
  status?: string;
  car?: TestDriveCarData;
}

interface TestDriveModalProps {
  carId: string;
  userId: string;
  onClose: () => void;
  agendamentoInicial?: TestDriveData | null;
  isOpen?: boolean;
  onSuccess?: (msg: string) => void;
  onError?: (msg: string) => void;
}

export default function TestDriveModal({
  carId,
  userId,
  onClose,
  agendamentoInicial,
  isOpen = true,
}: TestDriveModalProps) {
  const [scheduledAt, setScheduledAt] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (agendamentoInicial?.scheduledAt) {
      try {
        setScheduledAt(new Date(agendamentoInicial.scheduledAt));
        setMessage(agendamentoInicial.message || "");
      } catch (err) {
        console.error("Erro ao formatar data inicial:", err);
      }
    }
  }, [agendamentoInicial]);

  const handleChangeDate = (event: any, selected?: Date) => {
    setShowPicker(Platform.OS === "ios");
    if (event.type === "dismissed" || !selected) return;

    if (pickerMode === "date") {
      setScheduledAt(selected);
      // no Android, depois de escolher a data, abre o seletor de hora
      if (Platform.OS === "android") {
        setPickerMode("time");
        setShowPicker(true);
      }
    } else {
      setScheduledAt((prev) => {
        const base = prev ?? new Date();
        const updated = new Date(base);
        updated.setHours(selected.getHours(), selected.getMinutes());
        return updated;
      });
      setShowPicker(false);
      setPickerMode("date");
    }
  };

  const openPicker = () => {
    setPickerMode("date");
    setShowPicker(true);
  };

  const handleSubmit = async () => {
    if (!scheduledAt) {
      setNotification({ message: "Selecione uma data válida.", variant: "error" });
      return;
    }

    setLoading(true);
    try {
      if (agendamentoInicial?.id) {
        await testDriveService.atualizarData(agendamentoInicial.id, {
          scheduledAt: scheduledAt.toISOString(),
          message: message.trim() || undefined,
        });
        setNotification({ message: "Agendamento atualizado com sucesso!", variant: "success" });
      } else {
        await testDriveService.criar({
          scheduledAt: scheduledAt.toISOString(),
          carId,
          userId,
          message: message.trim() || undefined,
        });
        setNotification({ message: "Test Drive agendado com sucesso!", variant: "success" });
      }

      setTimeout(onClose, 1500);
    } catch (error: unknown) {
      console.error("Erro na operação:", error);

      let errorMessage = "Ocorreu um erro ao salvar.";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: { error?: string } } };
        if (axiosError.response?.data?.error) {
          errorMessage = axiosError.response.data.error;
        }
      }

      setNotification({ message: errorMessage, variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const dataFormatada = scheduledAt
    ? scheduledAt.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Selecionar data e horário";

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <Notification
        message={notification?.message ?? ""}
        variant={notification?.variant ?? "success"}
        onClose={() => setNotification(null)}
      />

      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.headerText}>
              {agendamentoInicial ? "EDITAR AGENDAMENTO" : "AGENDAR TEST DRIVE"}
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Data e Horário Pretendido *</Text>
              <TouchableOpacity style={styles.dateInput} onPress={openPicker}>
                <Text style={styles.dateInputText}>{dataFormatada}</Text>
              </TouchableOpacity>
              {showPicker && (
                <DateTimePicker
                  value={scheduledAt ?? new Date()}
                  mode={pickerMode}
                  is24Hour
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleChangeDate}
                />
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Observações / Mensagem (Opcional)</Text>
              <TextInput
                multiline
                numberOfLines={3}
                placeholder="Ex: Detalhes adicionais..."
                placeholderTextColor="#4b5563"
                value={message}
                onChangeText={setMessage}
                style={styles.textarea}
              />
            </View>

            <View style={styles.actions}>
              <Button
                texto={loading ? "Salvando..." : agendamentoInicial ? "Salvar Alterações" : "Confirmar Agendamento"}
                onPress={handleSubmit}
                disabled={loading}
              />
              <Button texto="Cancelar" onPress={onClose} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 576,
    backgroundColor: "#121212",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    padding: 8,
  },
  header: {
    paddingVertical: 24,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "300",
    letterSpacing: 4,
  },
  form: {
    padding: 24,
    gap: 24,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 2,
    color: "#6b7280",
    fontWeight: "700",
  },
  dateInput: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
    paddingVertical: 8,
  },
  dateInputText: {
    color: "#fff",
  },
  textarea: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    padding: 12,
    color: "#fff",
    textAlignVertical: "top",
    minHeight: 80,
  },
  actions: {
    flexDirection: "column",
    paddingTop: 16,
    gap: 8,
  },
});