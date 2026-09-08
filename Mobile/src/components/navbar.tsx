import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../context/theme"; // Ajuste o caminho do import se necessário

export function Navbar() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors?.primary ?? "#10B981",
        tabBarInactiveTintColor: colors?.textMuted ?? "#6B7280",
        tabBarStyle: {
          backgroundColor: colors?.surface ?? "#121212",
          borderTopColor: colors?.border ?? "#27272A",
          height: 70,
        },
        tabBarIconStyle: {
          marginTop: 3,
        },
      }}
    >
      {/* 1º Início: Se o arquivo estiver direto em app/index.tsx */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 2º Explorar: Pasta app/explorar/index.tsx */}
      <Tabs.Screen
        name="explorar/index"
        options={{
          title: "Explorar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 3º Perfil: Pasta app/Perfil/index.tsx */}

      {/* 4º Garagem: Pasta app/Garagem/index.tsx */}
      <Tabs.Screen
        name="Garagem/index"
        options={{
          title: "Garagem",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="car-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 5º Favoritos: Pasta app/Favoritos/index.tsx */}
      <Tabs.Screen
        name="Favoritos/index"
        options={{
          title: "Favoritos",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />
  <Tabs.Screen
    name="Perfil/index"
    options={{
      title: "Perfil",
      tabBarIcon: ({ color, size }) => (
        <Ionicons name="person-outline" size={size} color={color} />
      ),
    }}
  />
    </Tabs>
  );
}
