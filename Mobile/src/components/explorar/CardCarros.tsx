import { Image, Pressable, Text, View } from "react-native";
import { Link } from "expo-router";

import type { CardCarProps } from "../../types/types";

interface CardCarroProps {
  carro: CardCarProps;
  isFavorited?: boolean;
  onToggleFavorite: () => void;
}

export default function CardCarro({
  carro,
  isFavorited = false,
  onToggleFavorite,
}: CardCarroProps) {
  if (!carro) {
    return (
      <View
        style={{
          width: "100%",
          height: 300,
          backgroundColor: "#e5e5e5",
          marginBottom: 16,
        }}
      />
    );
  }

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <View
      style={{
        width: "100%",
        backgroundColor: "#ffffff",
        overflow: "hidden",
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#27272a",
      }}
    >
      {/* Imagem */}
      <Image
        source={{ uri: carro.imgUrl }}
        style={{
          width: "100%",
          height: 220,
        }}
        resizeMode="cover"
      />

      <View style={{ padding: 16 }}>
        {/* Nome + Favorito */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <Text
            numberOfLines={2}
            style={{
              flex: 1,
              fontSize: 20,
              fontWeight: "700",
              color: "#111111",
            }}
          >
            {carro.name}
          </Text>

          <Pressable
            onPress={onToggleFavorite}
            accessibilityLabel={
              isFavorited
                ? "Remover dos favoritos"
                : "Adicionar aos favoritos"
            }
            hitSlop={10}
          >
            <Text
              style={{
                fontSize: 28,
                color: "#C59958",
              }}
            >
              {isFavorited ? "★" : "☆"}
            </Text>
          </Pressable>
        </View>

        {/* Especificações */}
        <Text
          numberOfLines={2}
          style={{
            fontSize: 14,
            color: "#374151",
            marginBottom: 10,
            minHeight: 40,
          }}
        >
          {carro.specs?.engine}{" "}
          {carro.specs?.fuel}{" "}
          {carro.specs?.transmission}
        </Text>

        {/* Ano + localização */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
            marginBottom: 10,
          }}
        >
          {carro.year && (
            <Text
              style={{
                fontSize: 14,
                color: "#374151",
              }}
            >
              📅 {carro.year}
            </Text>
          )}

          <Text
            style={{
              fontSize: 14,
              color: "#374151",
            }}
          >
            📍 São Paulo (SP)
          </Text>
        </View>

        {/* Preço */}
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: "#111111",
            marginBottom: 12,
          }}
        >
          {formatPrice(carro.price)}
        </Text>

        {/* Detalhes */}
        <Link
          href={`/explorar/${carro.id}`}
          asChild
        >
          <Pressable
            style={{
              width: "100%",
              backgroundColor: "#121212",
              paddingVertical: 14,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#ffffff",
                fontSize: 14,
                fontWeight: "600",
                letterSpacing: 1,
              }}
            >
              DETALHES
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
