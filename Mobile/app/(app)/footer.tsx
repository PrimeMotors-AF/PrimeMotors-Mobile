import { Ionicons } from "@expo/vector-icons";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "../../src/context/theme";

const developers = [
  {
    name: "Aitom",
    instagram: "https://www.instagram.com/aitomdonatoni/",
    github: "https://github.com/AitomD",
  },
  {
    name: "Fernando",
    instagram: "https://www.instagram.com/ferconsolin_rosa/",
    github: "https://github.com/FernandoConsolinRosa11",
  },
];

export default function Footer() {
  const { colors } = useTheme();

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      ]}
    >
      <View style={styles.developers}>
        {developers.map((developer) => (
          <View key={developer.name} style={styles.developer}>
            <Text style={[styles.name, { color: colors.text }]}>
              {developer.name}
            </Text>

            <View style={styles.socials}>
              <Pressable
                onPress={() => openLink(developer.instagram)}
                style={({ pressed }) => [
                  styles.iconButton,
                  pressed && styles.pressed,
                ]}
                accessibilityLabel={`Instagram de ${developer.name}`}
              >
                <Ionicons
                  name="logo-instagram"
                  size={19}
                  color={colors.textMuted}
                />
              </Pressable>

              <Pressable
                onPress={() => openLink(developer.github)}
                style={({ pressed }) => [
                  styles.iconButton,
                  pressed && styles.pressed,
                ]}
                accessibilityLabel={`GitHub de ${developer.name}`}
              >
                <Ionicons
                  name="logo-github"
                  size={19}
                  color={colors.textMuted}
                />
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      <Text style={[styles.copyright, { color: colors.textMuted }]}>
        © {new Date().getFullYear()} Prime Motors
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  developers: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  developer: {
    alignItems: "center",
  },

  name: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 7,
  },

  socials: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconButton: {
    padding: 3,
  },

  pressed: {
    opacity: 0.5,
  },

  copyright: {
    fontSize: 8,
    textAlign: "center",
    marginTop: 14,
  },
});
