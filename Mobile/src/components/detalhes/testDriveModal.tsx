import { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import Notification from "@/components/detalhes/notification";
import { testDriveService } from "@/services/testDriveService";
import Button from "@/components/button";
import type { TestDriveModalProps } from "../../types/testDrive";
import { formatDateInput, formatTimeInput, parseWebDate } from "../../utils/testDriveDate";

type PickerEvent = { type?: string } | undefined;

export default function TestDriveModal({
  carId,
  userId,
  onClose,
  agendamentoInicial,
  isOpen = true,
  onDelete,
}: TestDriveModalProps) {
  const [scheduledAt, setScheduledAt] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");
  const [message, setMessage] = useState<string>("");
  const [dateText, setDateText] = useState("");
  const [timeText, setTimeText] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isConfirmingRemoval, setIsConfirmingRemoval] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (agendamentoInicial?.scheduledAt) {
      try {
        const initialDate = new Date(agendamentoInicial.scheduledAt);
        setScheduledAt(initialDate);
        setDateText(formatDateInput(initialDate));
        setTimeText(formatTimeInput(initialDate));
        setMessage(agendamentoInicial.message || "");
      } catch (err) {
        console.error("Erro ao formatar data inicial:", err);
      }
    }
  }, [agendamentoInicial]);

  const handleChangeDate = (event: PickerEvent, selected?: Date) => {
    if (event?.type === "dismissed" || !selected) {
      setShowPicker(false);
      setPickerMode("date");
      return;
    }

    if (pickerMode === "date") {
      setScheduledAt((previous) => {
        const next = new Date(selected);
        if (previous) next.setHours(previous.getHours(), previous.getMinutes(), 0, 0);
        return next;
      });
      setPickerMode("time");
      setShowPicker(true);
    } else {
      setScheduledAt((prev) => {
        const base = prev ?? new Date();
        const updated = new Date(base);
        updated.setHours(selected.getHours(), selected.getMinutes());
        return updated;
      });
      setShowPicker(false);
      setPickerMode("date");
      setDateText(formatDateInput(selected));
      setTimeText(formatTimeInput(selected));
    }
  };

  const openPicker = () => {
    if (Platform.OS === "web") return;
    setPickerMode("date");
    setShowPicker(true);
  };

  const updateWebDate = (value: string) => {
    setDateText(value);
    const next = parseWebDate(value, timeText);
    if (next) setScheduledAt(next);
  };

  const updateWebTime = (value: string) => {
    setTimeText(value);
    const next = parseWebDate(dateText, value);
    if (next) setScheduledAt(next);
  };

  const handleSubmit = async () => {
    if (!scheduledAt || Number.isNaN(scheduledAt.getTime())) {
      setNotification({ message: "Selecione uma data e horário válidos.", variant: "error" });
      return;
    }
    if (scheduledAt.getTime() <= Date.now()) {
      setNotification({ message: "Escolha uma data e horário futuros.", variant: "error" });
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

  const minimumWebDate = formatDateInput(new Date());
  const webInputStyle: CSSProperties = {
    flex: 1,
    minWidth: 0,
    boxSizing: "border-box",
    border: "1px solid rgba(255,255,255,0.2)",
    backgroundColor: "rgba(255,255,255,0.05)",
    color: "#fff",
    padding: "10px 8px",
    fontSize: 16,
  };

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

          <ScrollView
            style={styles.formScroll}
            contentContainerStyle={styles.form}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.field}>
              <Text style={styles.label}>Data e Horário Pretendido *</Text>
              {Platform.OS === "web" ? (
                <View style={styles.webDateRow}>
                  <input
                    type="date"
                    value={dateText}
                    min={minimumWebDate}
                    onChange={(event) => updateWebDate(event.currentTarget.value)}
                    aria-label="Data do test drive"
                    style={webInputStyle}
                  />
                  <input
                    type="time"
                    value={timeText}
                    onChange={(event) => updateWebTime(event.currentTarget.value)}
                    aria-label="Horário do test drive"
                    style={webInputStyle}
                  />
                </View>
              ) : (
                <TouchableOpacity style={styles.dateInput} onPress={openPicker} disabled={loading}>
                  <Text style={styles.dateInputText}>{dataFormatada}</Text>
                </TouchableOpacity>
              )}
              {Platform.OS !== "web" && showPicker && (
                <DateTimePicker
                  key={pickerMode}
                  value={scheduledAt ?? new Date()}
                  mode={pickerMode}
                  is24Hour
                  display={
                    Platform.OS === "android"
                      ? pickerMode === "date"
                        ? "calendar"
                        : "clock"
                      : "spinner"
                  }
                  minimumDate={pickerMode === "date" ? new Date() : undefined}
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
                textStyle={styles.actionText}
              />
              <Button texto="Cancelar" onPress={onClose} textStyle={styles.actionText} />
              {agendamentoInicial?.id && onDelete ? (
                isConfirmingRemoval ? (
                  <View style={styles.deleteConfirmation}>
                    <Text style={styles.deleteConfirmationText}>Deseja realmente excluir este agendamento?</Text>
                    <View style={styles.deleteActions}>
                      <TouchableOpacity
                        disabled={loading}
                        onPress={() => setIsConfirmingRemoval(false)}
                        style={styles.deleteCancelButton}
                      >
                        <Text style={styles.deleteCancelText}>CANCELAR</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        disabled={loading}
                        onPress={async () => {
                          setLoading(true);
                          try {
                            await onDelete();
                            setIsConfirmingRemoval(false);
                          } finally {
                            setLoading(false);
                          }
                        }}
                        style={styles.deleteConfirmButton}
                      >
                        {loading ? <Text style={styles.deleteConfirmText}>EXCLUINDO...</Text> : <Text style={styles.deleteConfirmText}>EXCLUIR</Text>}
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity disabled={loading} onPress={() => setIsConfirmingRemoval(true)} style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>EXCLUIR AGENDAMENTO</Text>
                  </TouchableOpacity>
                )
              ) : null}
            </View>
          </ScrollView>
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
    maxHeight: "90%",
    alignSelf: "center",
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
  formScroll: {
    width: "100%",
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
  webDateRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  textarea: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    padding: 12,
    color: "#fff",
    textAlignVertical: "top",
    minHeight: 80,
    width: "100%",
    minWidth: 0,
  },
  actions: {
    flexDirection: "column",
    paddingTop: 16,
    gap: 8,
  },
  deleteButton: {
    alignItems: "center",
    paddingVertical: 10,
  },
  deleteButtonText: {
    color: "#ED8B8B",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  actionText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  deleteConfirmation: {
    borderWidth: 1,
    borderColor: "#A94343",
    backgroundColor: "#351D1D",
    padding: 12,
  },
  deleteConfirmationText: {
    color: "#ED8B8B",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 12,
  },
  deleteActions: {
    flexDirection: "row",
    gap: 8,
  },
  deleteCancelButton: {
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3D3933",
    paddingVertical: 12,
  },
  deleteCancelText: {
    color: "#A9A49B",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  deleteConfirmButton: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#A94343",
    paddingVertical: 12,
  },
  deleteConfirmText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
});