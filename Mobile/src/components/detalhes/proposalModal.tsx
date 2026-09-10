import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import Notification from "./notification";
import garageService from "../../services/garageService";
import type { ProposalModalProps } from "../../types/types";
import Button from "@/components/button";

export default function ProposalModal({
  carId,
  userId,
  onClose,
  isOpen = true,
}: ProposalModalProps) {
  const [offeredValue, setOfferedValue] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);

  const handleSubmit = async () => {
    if (!offeredValue || parseFloat(offeredValue) <= 0) {
      setNotification({ message: "Insira um valor válido.", variant: "error" });
      return;
    }

    setLoading(true);
    try {
      await garageService.sendCarProposal({
        offeredValue: parseFloat(offeredValue),
        message,
        carId,
        userId,
      });
      setNotification({
        message: "Proposta enviada com sucesso!",
        variant: "success",
      });
      setTimeout(onClose, 700);
    } catch (error) {
      console.error("Erro ao enviar:", error);
      setNotification({
        message: "Erro ao enviar proposta.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <Notification
        message={notification?.message ?? ""}
        variant={notification?.variant ?? "success"}
        onClose={() => setNotification(null)}
      />

      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.headerText}>PROPOSTA</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Valor (R$)</Text>
              <TextInput
                keyboardType="decimal-pad"
                value={offeredValue}
                onChangeText={setOfferedValue}
                style={styles.input}
                placeholderTextColor="#6b7280"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Mensagem</Text>
              <TextInput
                multiline
                numberOfLines={3}
                value={message}
                onChangeText={setMessage}
                style={styles.textarea}
                placeholderTextColor="#6b7280"
              />
            </View>

            <View style={styles.actions}>
              <Button
                texto={loading ? "Enviando..." : "Confirmar Proposta"}
                disabled={loading}
                onPress={handleSubmit}
                style={styles.confirmButton}
                textStyle={styles.confirmButtonText}
              />
              <Button
                texto="Cancelar"
                onPress={onClose}
                style={styles.cancelButton}
                textStyle={styles.cancelButtonText}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  card: {
    backgroundColor: "#121212",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    maxHeight: "92%",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "300",
    letterSpacing: 3,
  },
  form: {
    padding: 16,
    gap: 20,
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
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
    paddingVertical: 12,
    fontSize: 16,
    color: "#fff",
  },
  textarea: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    padding: 12,
    fontSize: 16,
    color: "#fff",
    textAlignVertical: "top",
    minHeight: 80,
  },
  actions: {
    flexDirection: "column",
    gap: 12,
    paddingTop: 8,
  },
  confirmButton: {
    width: "100%",
    paddingVertical: 14,
  },
  confirmButtonText: {
    color: "#f9fafb",
    fontWeight: "700",
  },
  cancelButton: {
    width: "100%",
    paddingVertical: 14,
  },
  cancelButtonText: {
    color: "#f9fafb",
    fontWeight: "700",
  },
});