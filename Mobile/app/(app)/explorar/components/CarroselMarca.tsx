import { logos } from "./logo";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  onChangeMarca: (marca: string) => void;
};

const CARROS_DATA = [
  {
    nome: "Todos",
    logo: logos.todos,
  },
  {
    nome: "Lamborghini",
    logo: logos.lamborghini,
  },
  {
    nome: "Ferrari",
    logo: logos.ferrari,
  },
  {
    nome: "Porsche",
    logo: logos.porsche,
  },
  {
    nome: "McLaren",
    logo: logos.mclaren,
  },
  {
    nome: "Bugatti",
    logo: logos.bugatti,
  },
  {
    nome: "Pagani",
    logo: logos.pagani,
  },
  {
    nome: "Koenigsegg",
    logo: logos.koenigsegg,
  },
  {
    nome: "Rolls-Royce",
    logo: logos.rolls,
  },
  {
    nome: "Audi",
    logo: logos.audi,
  },
  {
    nome: "BMW",
    logo: logos.bmw,
  },
  {
    nome: "Mercedes-Benz",
    logo: logos.mercedes,
  },
];


export default function Carrossel({
  onChangeMarca,
}: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const filtroAtual = CARROS_DATA[index].nome;

    onChangeMarca(filtroAtual);
  }, [index, onChangeMarca]);

  const proximo = () => {
    setIndex(
      (prev) => (prev + 1) % CARROS_DATA.length,
    );
  };

  const anterior = () => {
    setIndex(
      (prev) =>
        (prev - 1 + CARROS_DATA.length) %
        CARROS_DATA.length,
    );
  };

  const indiceAnterior =
    (index - 1 + CARROS_DATA.length) %
    CARROS_DATA.length;

  const indiceProximo =
    (index + 1) % CARROS_DATA.length;

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        {/* Botão anterior */}
        <Pressable
          onPress={anterior}
          style={styles.arrowButton}
        >
          <Text style={styles.arrow}>‹</Text>
        </Pressable>

        {/* Área das marcas */}
        <View style={styles.viewport}>
          {/* Marca anterior */}
          <View style={styles.sideItem}>
            <Image
              source={CARROS_DATA[indiceAnterior].logo}
              style={styles.sideLogo}
              resizeMode="contain"
            />
          </View>

          {/* Marca selecionada */}
          <View style={styles.centerItem}>
            <Image
              source={CARROS_DATA[index].logo}
              style={styles.centerLogo}
              resizeMode="contain"
            />

            <Text style={styles.brandName}>
              {CARROS_DATA[index].nome}
            </Text>
          </View>

          {/* Próxima marca */}
          <View style={styles.sideItem}>
            <Image
              source={CARROS_DATA[indiceProximo].logo}
              style={styles.sideLogo}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Botão próximo */}
        <Pressable
          onPress={proximo}
          style={styles.arrowButton}
        >
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      </View>

      {/* Indicadores */}
      <View style={styles.pagination}>
        {CARROS_DATA.map((carro, i) => (
          <Pressable
            key={carro.nome}
            onPress={() => setIndex(i)}
            accessibilityLabel={`Selecionar ${carro.nome}`}
            style={[
              styles.dot,
              i === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 8,
  },

  wrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },

  arrowButton: {
    width: 40,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  arrow: {
    fontSize: 36,
    fontWeight: "300",
    color: "#121212",
    lineHeight: 40,
  },

  viewport: {
    flex: 1,
    height: 145,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  sideItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.3,
  },

  centerItem: {
    width: 125,
    alignItems: "center",
    justifyContent: "center",
  },

  sideLogo: {
    width: 65,
    height: 65,
  },

  centerLogo: {
    width: 100,
    height: 85,
  },

  brandName: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "600",
    color: "#121212",
    textAlign: "center",
  },

  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    marginTop: 5,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#d1d5db",
  },

  activeDot: {
    width: 18,
    backgroundColor: "#C59958",
  },
});
