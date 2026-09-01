import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface SideBarProps {
  onCategoryChange: (category: string) => void;
  selectedCategories: string[];
}

export default function SideBar({
  onCategoryChange,
  selectedCategories,
}: SideBarProps) {
  const categoriasDisponiveis = [
    {
      label: "Esportivo",
      value: "Esportivo",
    },
    {
      label: "SUV",
      value: "SUV",
    },
    {
      label: "Super Esportivo",
      value: "Super Esportivo",
    },
    {
      label: "Luxo",
      value: "Luxo",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          Filtros do Veículo
        </Text>

        <View style={styles.divider} />

        <View style={styles.categories}>
          {categoriasDisponiveis.map((cat) => {
            const isActive =
              selectedCategories.includes(cat.value);

            return (
              <Pressable
                key={cat.value}
                onPress={() =>
                  onCategoryChange(cat.value)
                }
                style={styles.category}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isActive &&
                      styles.categoryTextActive,
                  ]}
                >
                  {cat.label}
                </Text>

                <View
                  style={[
                    styles.checkbox,
                    isActive && styles.checkboxActive,
                  ]}
                >
                  {isActive && (
                    <Text style={styles.check}>
                      ✓
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.bottomDivider} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  card: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },

  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginTop: 10,
  },

  categories: {
    marginTop: 20,
    gap: 16,
  },

  category: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  categoryText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },

  categoryTextActive: {
    color: "#C59958",
  },

  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: "#9ca3af",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxActive: {
    backgroundColor: "#C59958",
    borderColor: "#C59958",
  },

  check: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },

  bottomDivider: {
    height: 1,
    backgroundColor: "#f3f4f6",
    marginTop: 24,
  },
});

