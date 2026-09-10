import { StyleSheet, Text, View } from "react-native";

import type { SpecDescriptionProps } from "../../types/types";

export default function SpecDescription({ titulo, valor }: SpecDescriptionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={styles.valor}>{valor || "N/A"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  titulo: {
    fontSize: 14,
    fontWeight: "900",
    color: "#111827",
  },
  valor: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4b5563",
  },
});