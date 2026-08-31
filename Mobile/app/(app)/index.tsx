import { Link } from 'expo-router';
import { useRef, useState } from 'react';
import { Image, Pressable, SafeAreaView, ScrollView, Text, useWindowDimensions, View } from 'react-native';

import { Navbar } from '../../src/components/navbar';
import { useTheme } from '../../src/context/theme';

const logo = require('../../src/assets/images/logo.png');
const cars = [
  { name: 'Porsche 911 GT3R', image: require('../../src/assets/images/Porsche911GT3R.png'), slogan: 'NASCIDO PARA VENCER.' },
  { name: 'Lamborghini Urus SE', image: require('../../src/assets/images/LamborghiniUrusSE.png'), slogan: 'CONQUISTE QUALQUER CAMINHO.' },
  { name: 'McLaren 720S', image: require('../../src/assets/images/McLaren720s.png'), slogan: 'VELOCIDADE EM ESTADO DE ARTE.' },
  { name: 'Bugatti Chiron', image: require('../../src/assets/images/BuggatiReside.png'), slogan: 'PERFORMANCE SEM LIMITES.' },
  { name: 'Mercedes-Benz 300SL', image: require('../../src/assets/images/MercedesBenz300SL1954.png'), slogan: 'BELEZA ETERNA. ENGENHARIA LENDÁRIA.' },
];
const reviews = [
  { name: 'Aitom Donatoni', car: 'McLaren 750S', image: require('../../src/assets/images/imgMcLaren750s.jpg'), text: 'Uma obra-prima da engenharia. A precisão na entrega e o atendimento personalizado refletem o verdadeiro padrão da marca.' },
  { name: 'Fernando Consolin', car: 'Lamborghini Urus SE', image: require('../../src/assets/images/imgUrusSE.jpg'), text: 'A harmonia perfeita entre robustez e sofisticação. Superou todas as minhas expectativas em performance e conforto.' },
  { name: 'Hiago Nascimento', car: 'Porsche 911 GT3R', image: require('../../src/assets/images/imgPorsche911.jpg'), text: 'Um ícone que dispensa apresentações. O processo de aquisição foi conduzido com máxima discrição e profissionalismo.' },
];

export default function HomeScreen() {
  const { styles, logoSizes } = useTheme();
  const { width } = useWindowDimensions();
  const carouselRef = useRef<ScrollView>(null);
  const [activeCar, setActiveCar] = useState(0);
  const cardWidth = Math.min(width - 48, 420);

  const selectCar = (index: number) => {
    setActiveCar(index);
    carouselRef.current?.scrollTo({ x: index * (cardWidth + 14), animated: true });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <Navbar />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
        scrollEnabled={true}
      >
        <View className="px-5 pb-5 pt-5">
          <View className="items-center">
            <Image
              source={logo}
              resizeMode="contain"
              style={{ width: logoSizes.nav.width, height: logoSizes.nav.height, maxWidth: '100%' }}
            />
          </View>

          <View className="mt-5">
            <Text className="mb-2 text-[11px] font-bold tracking-[2px] text-[#C59958]">COLEÇÃO PRIME</Text>
            <Text className="max-w-[320px] text-[28px] font-extrabold leading-[34px] text-[#F8F6F1]">
              Encontre sua próxima obra-prima
            </Text>
            <Text className="mt-3 max-w-[340px] text-[14px] leading-[21px] text-[#A9A49B]">
              Veículos selecionados para quem reconhece a excelência em cada detalhe.
            </Text>
          </View>
        </View>

        <View className="px-4 pb-3">
          <ScrollView
            ref={carouselRef}
            contentContainerStyle={{ gap: 14, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 12 }}
            horizontal
            onMomentumScrollEnd={(event) => setActiveCar(Math.round(event.nativeEvent.contentOffset.x / (cardWidth + 14)))}
            showsHorizontalScrollIndicator={false}
            snapToInterval={cardWidth + 14}
          >
            {cars.map((car, index) => (
              <View
                key={car.name}
                style={[
                  styles.homeCard,
                  { width: cardWidth, opacity: index === activeCar ? 1 : 0.96 },
                  index === activeCar && styles.homeCardActive,
                ]}
                className="rounded-[5px]"
              >
                <Text className="text-[15px] font-bold italic tracking-[1px] text-[#C59958]">{car.name}</Text>
                <Text className="mt-4 max-w-[320px] text-[25px] font-extrabold leading-[31px] text-[#171615]">
                  {car.slogan}
                </Text>
                <Image source={car.image} resizeMode="contain" className="my-[12px] h-[175px] w-full" />

                <Link href="/(app)/explorar" asChild>
                  <Pressable
                    className="h-[46px] items-center justify-center rounded-[4px] border border-[#3D3933] bg-[#F5F3EE]"
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  >
                    <Text className="text-[12px] font-extrabold tracking-[1px] text-[#171615]">VER VEÍCULOS ↓</Text>
                  </Pressable>
                </Link>
              </View>
            ))}
          </ScrollView>
        </View>

        <View className="flex-row items-center justify-center gap-[7px] pb-[18px] pt-[6px]">
          {cars.map((car, index) => (
            <Pressable
              accessibilityLabel={`Selecionar ${car.name}`}
              key={car.name}
              onPress={() => selectCar(index)}
              className={`h-[6px] w-[22px] rounded-[3px] ${index === activeCar ? 'bg-[#C59958]' : 'bg-[#3D3933]'}`}
            />
          ))}
        </View>

        <View className="bg-[#1A1A1A] px-5 pb-7 pt-8">
          <Text className="mb-2.5 text-[11px] font-bold tracking-[2px] text-[#C59958]">DEPOIMENTOS</Text>
          <Text className="max-w-[350px] text-[23px] font-extrabold leading-[29px] text-[#F8F6F1]">
            A experiência de quem escolheu a excelência
          </Text>

          <ScrollView
            contentContainerStyle={{ gap: 14, paddingTop: 20 }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {reviews.map((review) => (
              <View key={review.name} style={styles.homeReviewCard} className="rounded-[6px]">
                <Image source={review.image} className="mb-[15px] h-[118px] w-full" />
                <Text className="min-h-[100px] text-[13px] italic leading-[20px] text-[#C9C2B8]">
                  {review.text}
                </Text>
                <View className="mt-3 border-t border-[#3D3933] pt-[13px]">
                  <Text className="text-[13px] font-extrabold uppercase tracking-[1px] text-[#F8F6F1]">
                    {review.name}
                  </Text>
                  <Text className="mt-[7px] text-[10px] font-bold tracking-[0.5px] text-[#C59958]">
                    {review.car}  ★ 10/10
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
