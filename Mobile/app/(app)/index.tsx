import { Link } from "expo-router";
import { Image, Pressable, SafeAreaView, Text, View } from "react-native";

import { useTheme } from "../../src/context/theme";

const logo = require("../../src/assets/images/logo.png");

export default function HomeScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          paddingHorizontal: 24,
          paddingVertical: 28,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Image
            source={logo}
            style={{ height: 112, width: 240 }}
            resizeMode="contain"
          />
          <View
            style={{
              backgroundColor: colors.primary,
              height: 2,
              marginTop: 20,
              width: 42,
            }}
          />
        </View>

        <View style={{ alignItems: "center", marginTop: -32 }}>
          <Text
            style={{
              color: colors.primary,
              fontSize: 11,
              fontWeight: "700",
              letterSpacing: 3,
              marginBottom: 14,
            }}
          >
            PERFORMANCE & ELEGÂNCIA
          </Text>
          <Text
            style={{
              color: colors.text,
              fontSize: 34,
              fontWeight: "700",
              lineHeight: 42,
              textAlign: "center",
            }}
          >
            Seu próximo carro começa aqui.
          </Text>
          <Text
            style={{
              color: colors.textMuted,
              fontSize: 15,
              lineHeight: 23,
              marginTop: 16,
              maxWidth: 310,
              textAlign: "center",
            }}
          >
            Encontre veículos selecionados e viva uma experiência premium do seu
            jeito.
          </Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <Link href="/(auth)/login" asChild>
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [
                {
                  alignItems: "center",
                  borderColor: colors.border,
                  borderRadius: 4,
                  borderWidth: 1,
                  height: 54,
                  justifyContent: "center",
                },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text
                style={{
                  color: colors.text,
                  fontSize: 17,
                  fontWeight: "700",
                  letterSpacing: 1,
                  backgroundColor:colors.gold,
                  borderRadius: 5,
                  padding: 10
                }}
              >
                INICIAR SESSÃO
              </Text>
            </Pressable>
          </Link>
          <View></View>
        </View>
        <Text
          style={{
            color: colors.textMuted,
            fontSize: 11,
            letterSpacing: 1,
            marginTop: 8,
            textAlign: "center",
          }}
        >
          PRIME MOTORS • ALTO PADRÃO EM CADA DETALHE
        </Text>
      </View>
    </SafeAreaView>
  );
}
