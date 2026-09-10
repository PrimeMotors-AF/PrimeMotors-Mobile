import { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type NotificationVariant = "success" | "error";

interface NotificationProps {
  message: string;
  variant?: NotificationVariant;
  onClose?: () => void;
}

export default function Notification({
  message,
  variant = "success",
  onClose,
}: NotificationProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-16)).current;

  useEffect(() => {
    if (!message) return;

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [message]);

  if (!message) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        variant === "success" ? styles.success : styles.error,
        { opacity, transform: [{ translateY }] },
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <View style={styles.row}>
        <Text style={styles.message}>{message}</Text>
        {onClose ? (
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            accessibilityLabel="Fechar notificação"
            accessibilityRole="button"
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 16,
    right: 16,
    left: 16,
    zIndex: 50,
    maxWidth: 384,
    alignSelf: "flex-end",
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  success: {
    borderColor: "#34d399",
    backgroundColor: "rgba(5, 150, 105, 0.95)",
  },
  error: {
    borderColor: "#ef4444",
    backgroundColor: "rgba(220, 38, 38, 0.95)",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },
  message: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: "#fff",
  },
  closeButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});