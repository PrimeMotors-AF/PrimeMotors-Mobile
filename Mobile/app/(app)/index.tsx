import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

const logo = require("../../src/assets/images/logo.png");

const cars = [
  {
    name: "Porsche 911 GT3R",
    image: require("../../src/assets/images/Porsche911GT3R.png"),
    slogan: "NASCIDO PARA VENCER.",
  },
  {
    name: "Lamborghini Urus SE",
    image: require("../../src/assets/images/LamborghiniUrusSE.png"),
    slogan: "CONQUISTE QUALQUER CAMINHO.",
  },
  {
    name: "McLaren 720S",
    image: require("../../src/assets/images/McLaren720s.png"),
    slogan: "VELOCIDADE EM ESTADO DE ARTE.",
  },
  {
    name: "Bugatti Chiron",
    image: require("../../src/assets/images/BuggatiReside.png"),
    slogan: "PERFORMANCE SEM LIMITES.",
  },
  {
    name: "Mercedes-Benz 300SL",
    image: require("../../src/assets/images/MercedesBenz300SL1954.png"),
    slogan: "BELEZA ETERNA. ENGENHARIA LENDÁRIA.",
  },
];

const reviews = [
  {
    name: "Aitom Donatoni",
    car: "McLaren 750S",
    image: require("../../src/assets/images/imgMcLaren750s.jpg"),
    text: "Uma obra-prima da engenharia. A precisão na entrega e o atendimento personalizado refletem o verdadeiro padrão da marca.",
  },
  {
    name: "Fernando Consolin",
    car: "Lamborghini Urus SE",
    image: require("../../src/assets/images/imgUrusSE.jpg"),
    text: "A harmonia perfeita entre robustez e sofisticação. Superou todas as minhas expectativas em performance e conforto.",
  },
  {
    name: "Hiago Nascimento",
    car: "Porsche 911 GT3R",
    image: require("../../src/assets/images/imgPorsche911.jpg"),
    text: "Um ícone que dispensa apresentações. O processo de aquisição foi conduzido com máxima discrição e profissionalismo.",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const carouselRef = useRef<ScrollView>(null);

  const [activeCar, setActiveCar] = useState(0);

  /*
   * Mantém o card responsivo:
   * - Em telas pequenas: largura da tela - 40
   * - Em telas maiores: máximo de 420px
   */
  const cardWidth = Math.min(width - 40, 420);

  const selectCar = (index: number) => {
    setActiveCar(index);

    carouselRef.current?.scrollTo({
      x: index * (cardWidth + 14),
      animated: true,
    });
  };

  return (
    <ScrollView
      className="flex-1 bg-[#121212]"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 30,
      }}
    >
 
      {/* ===================================================== */}
      {/* INTRODUÇÃO */}
      {/* ===================================================== */}

      <View className="px-5 pb-5 pt-3">
        <Text className="mb-2 text-[11px] font-bold tracking-[2px] text-[#C59958]">
          COLEÇÃO PRIME
        </Text>

        <Text className="mb-3 text-[30px] font-bold leading-[36px] text-[#F8F6F1]">
          Encontre sua próxima obra-prima
        </Text>

        <Text className="text-[15px] leading-[22px] text-[#C9C2B8]">
          Veículos selecionados para quem reconhece a excelência em cada
          detalhe.
        </Text>
      </View>

      {/* ===================================================== */}
      {/* CARROS */}
      {/* ===================================================== */}

      <ScrollView
        ref={carouselRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + 15}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: 26,
          paddingVertical: 14,
        }}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / (cardWidth + 14),
          );

          setActiveCar(Math.max(0, Math.min(index, cars.length - 1)));
        }}
      >
        {cars.map((car, index) => (
          <View
            key={car.name}
            style={{
              width: cardWidth,
              minHeight: 450,
              marginRight: 15,
            }}
            className={[
              "rounded-[16px] border bg-[#1A1A1A] p-[18px]",
              index === activeCar
                ? "border-[#C59958]"
                : "border-[#3D3933]",
            ].join(" ")}
          >
            {/* Nome */}
            <Text className="mb-2 text-[22px] font-bold text-[#F8F6F1]">
              {car.name}
            </Text>

            {/* Slogan */}
            <Text className="mb-3 text-[11px] font-bold tracking-[1.2px] text-[#C59958]">
              {car.slogan}
            </Text>

            {/* Imagem do carro */}
            <View className="items-center justify-center">
              <Image
                source={car.image}
                style={{
                  width: "100%",
                  height: 190,
                }}
                resizeMode="contain"
              />
            </View>

            {/* Botão */}
            <Pressable
              onPress={() => router.push("/(app)/explorar")}
              className="mt-3 items-center justify-center rounded-full border border-[#3D3933] px-4 py-3"
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text className="text-center text-[11px] font-bold tracking-[1.8px] text-[#F8F6F1]">
                VER VEÍCULOS ↓
              </Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>

      {/* ===================================================== */}
      {/* INDICADORES DO CARROSSEL */}
      {/* ===================================================== */}

      <View className="flex-row items-center justify-center py-3">
        {cars.map((car, index) => (
          <Pressable
            key={car.name}
            accessibilityLabel={`Selecionar ${car.name}`}
            onPress={() => selectCar(index)}
            style={{
              width: index === activeCar ? 26 : 8,
              height: 8,
              marginHorizontal: 4,
              borderRadius: 999,
              backgroundColor:
                index === activeCar ? "#C59958" : "#3D3933",
            }}
          />
        ))}
      </View>

      {/* ===================================================== */}
      {/* DEPOIMENTOS */}
      {/* ===================================================== */}

      <View className="px-5 pb-6 pt-7">
        <Text className="mb-2 text-[11px] font-bold tracking-[2px] text-[#C59958]">
          DEPOIMENTOS
        </Text>

        <Text className="mb-4 text-[24px] font-bold leading-[30px] text-[#F8F6F1]">
          A experiência de quem escolheu a excelência
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingVertical: 8,
          }}
        >
          {reviews.map((review) => (
            <View
              key={review.name}
              style={{
                width: Math.min(width - 60, 280),
                marginRight: 12,
              }}
              className="rounded-[14px] border border-[#3D3933] bg-[#1C1C1C] p-[14px]"
            >
              {/* Foto */}
              <Image
                source={review.image}
                style={{
                  width: "100%",
                  height: 180,
                  borderRadius: 12,
                  marginBottom: 12,
                }}
                resizeMode="cover"
              />

              {/* Texto */}
              <Text className="mb-4 text-[13px] leading-[20px] text-[#C9C2B8]">
                {review.text}
              </Text>

              {/* Autor */}
              <View className="border-t border-[#3D3933] pt-3">
                <Text className="mb-1 text-[14px] font-bold text-[#F8F6F1]">
                  {review.name}
                </Text>

                <Text className="text-[12px] font-semibold text-[#C59958]">
                  {review.car} ★ 10/10
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}