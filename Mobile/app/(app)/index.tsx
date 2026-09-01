import { Link } from "expo-router";
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

import { useTheme } from "../../src/context/theme";

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
  const { styles } = useTheme();
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
    <SafeAreaView style={styles.homeScreen}>


      {/* CONTEÚDO DA PÁGINA */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Header */}
        <View style={styles.homeHeader}>
          <Image
            source={logo}
            style={styles.homeLogo}
            resizeMode="contain"
          />

          <Text style={styles.homeHeaderMeta}>
            EXCLUSIVIDADE EM MOVIMENTO
          </Text>
        </View>

        {/* Introdução */}
        <View style={styles.homeIntro}>
          <Text style={styles.homeEyebrow}>
            COLEÇÃO PRIME
          </Text>

          <Text style={styles.homeHeading}>
            Encontre sua próxima obra-prima
          </Text>

          <Text style={styles.homeDescription}>
            Veículos selecionados para quem reconhece a excelência em cada
            detalhe.
          </Text>
        </View>

        {/* Carrossel de carros */}
        <ScrollView
          ref={carouselRef}
          contentContainerStyle={styles.homeCarousel}
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
              style={[
                styles.homeCarCard,
                { width: cardWidth },
                index === activeCar &&
                  styles.homeCarCardActive,
              ]}
            >
              <Text style={styles.homeCarName}>
                {car.name}
              </Text>

              <Text style={styles.homeCarSlogan}>
                {car.slogan}
              </Text>

              <Image
                source={car.image}
                style={styles.homeCarImage}
                resizeMode="contain"
              />

              <Link href="/(app)/explorar" asChild>
                <Pressable
                  style={({ pressed }) => [
                    styles.homeOutlineButton,
                    pressed && styles.homePressed,
                  ]}
                >
                  <Text style={styles.homeOutlineText}>
                    VER VEÍCULOS ↓
                  </Text>
                </Pressable>
              </Link>
            </View>
          ))}
        </ScrollView>

        {/* Paginação */}
        <View style={styles.homePagination}>
          {cars.map((car, index) => (
            <Pressable
              accessibilityLabel={`Selecionar ${car.name}`}
              key={car.name}
              onPress={() => selectCar(index)}
              style={[
                styles.homePaginationDot,
                index === activeCar &&
                  styles.homePaginationDotActive,
              ]}
            />
          ))}
        </View>

        {/* Depoimentos */}
        <View style={styles.homeReviews}>
          <Text style={styles.homeEyebrow}>
            DEPOIMENTOS
          </Text>

          <Text style={styles.homeReviewHeading}>
            A experiência de quem escolheu a excelência
          </Text>

          <ScrollView
            contentContainerStyle={styles.homeReviewList}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {reviews.map((review) => (
              <View
                key={review.name}
                style={styles.homeReviewCard}
              >
                <Image
                  source={review.image}
                  style={styles.homeReviewImage}
                />

                <Text style={styles.homeReviewText}>
                  {review.text}
                </Text>

                <View style={styles.homeReviewFooter}>
                  <Text style={styles.homeReviewer}>
                    {review.name}
                  </Text>

                  <Text style={styles.homeReviewCar}>
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

