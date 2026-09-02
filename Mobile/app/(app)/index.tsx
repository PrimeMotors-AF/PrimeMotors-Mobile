import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
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

  const cardWidth = Math.min(width - 48, 420);

  const selectCar = (index: number) => {
    setActiveCar(index);

    carouselRef.current?.scrollTo({
      x: index * (cardWidth + 14),
      animated: true,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="items-center px-5 pb-3 pt-6">
          <Image
            source={logo}
            className="mb-1 h-[150px] w-[220px]"
            resizeMode="contain"
          />

          <Text className="text-[11px] font-bold tracking-[2px] text-[#A9A49B] uppercase">
            EXCLUSIVIDADE EM MOVIMENTO
          </Text>
        </View>

        <View className="px-5 py-2">
          <Text className="mb-2 text-[11px] font-bold tracking-[2px] text-[#C59958] uppercase">
            COLEÇÃO PRIME
          </Text>

          <Text className="mb-2 text-[32px] font-bold leading-[38px] text-[#F8F6F1]">
            Encontre sua próxima obra-prima
          </Text>

          <Text className="text-[15px] leading-[22px] text-[#C9C2B8]">
            Veículos selecionados para quem reconhece a excelência em cada
            detalhe.
          </Text>
        </View>

        <ScrollView
          ref={carouselRef}
          contentContainerStyle={{ alignItems: "center", paddingHorizontal: 12, paddingVertical: 12 }}
          horizontal
          onMomentumScrollEnd={(event) =>
            setActiveCar(
              Math.round(
                event.nativeEvent.contentOffset.x /
                  (cardWidth + 14),
              ),
            )
          }
          showsHorizontalScrollIndicator={false}
          snapToInterval={cardWidth + 14}
        >
          {cars.map((car, index) => (
            <View
              key={car.name}
              className={[
                "mr-[14px] rounded-[16px] border border-[#3D3933] bg-[#1A1A1A] p-[18px]",
                index === activeCar && "border-[#C59958] shadow-lg",
              ].join(" ")}
              style={{ width: cardWidth, minHeight: 480 }}
            >
              <Text className="mb-1.5 text-[22px] font-bold text-[#F8F6F1]">
                {car.name}
              </Text>

              <Text className="mb-3 text-[11px] font-bold tracking-[1.2px] text-[#C59958] uppercase">
                {car.slogan}
              </Text>

              <Image
                source={car.image}
                className="mb-3 h-[190px] w-full"
                resizeMode="contain"
              />

              <Pressable
                onPress={() => router.push("/(app)/explorar")}
                className="items-center justify-center rounded-full border border-[#3D3933] px-4 py-3"
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <Text className="text-[11px] font-bold tracking-[1.8px] text-[#F8F6F1]">
                  VER VEÍCULOS ↓
                </Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>

        <View className="flex-row items-center justify-center py-2">
          {cars.map((car, index) => (
            <Pressable
              accessibilityLabel={`Selecionar ${car.name}`}
              key={car.name}
              onPress={() => selectCar(index)}
              className={[
                "mx-1 h-2 rounded-full bg-[#3D3933]",
                index === activeCar && "w-[26px] bg-[#C59958]",
              ].join(" ")}
              style={index === activeCar ? undefined : { width: 8 }}
            />
          ))}
        </View>

        <View className="px-5 pb-6 pt-5">
          <Text className="mb-2 text-[11px] font-bold tracking-[2px] text-[#C59958] uppercase">
            DEPOIMENTOS
          </Text>

          <Text className="mb-3 text-[24px] font-bold leading-[30px] text-[#F8F6F1]">
            A experiência de quem escolheu a excelência
          </Text>

          <ScrollView
            contentContainerStyle={{ paddingVertical: 8 }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {reviews.map((review) => (
              <View
                key={review.name}
                className="mr-3 w-[280px] rounded-[14px] border border-[#3D3933] bg-[#1C1C1C] p-[14px]"
              >
                <Image
                  source={review.image}
                  className="mb-3 h-[180px] w-full rounded-[12px]"
                />

                <Text className="mb-4 text-[13px] leading-[20px] text-[#C9C2B8]">
                  {review.text}
                </Text>

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
    </SafeAreaView>
  );
}

