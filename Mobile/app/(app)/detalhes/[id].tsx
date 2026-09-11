import { useEffect, useState, useContext } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import Notification from "@/components/detalhes/notification";
import { AuthContext } from "@/context/authContext";
import api from "@/services/api";
import type { CardCarProps } from "../../../src/types/types";
import Button from "@/components/button";
import ProposalModal from "@/components/detalhes/proposalModal";
import SpecDescription from "@/components/detalhes/specDescription";
import TestDriveModal from "@/components/detalhes/testDriveModal";

export default function ProdutoCard() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [carro, setCarro] = useState<CardCarProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imgSelecionada, setImgSelecionada] = useState("");
  const [isTestDriveModalOpen, setIsTestDriveModalOpen] = useState(false);

  const [notification, setNotification] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);

  useEffect(() => {
    async function fetchCarro() {
      try {
        const res = await api.get(`/cars/${id}`);
        const data = res.data;
        setCarro(data);
        if (data.allImages && data.allImages.length > 0) {
          setImgSelecionada(data.allImages[0]);
        }
      } catch (err) {
        console.error("Erro:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchCarro();
  }, [id]);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 3200);
    return () => clearTimeout(timer);
  }, [notification]);

  const irParaLogin = () => router.push("/Login");

  if (loading)
    return (
      <View style={styles.centerScreen}>
        <ActivityIndicator color="#C59958" size="large" />
        <Text style={styles.centerText}>Carregando...</Text>
      </View>
    );

  if (!carro)
    return (
      <View style={styles.centerScreen}>
        <Text style={styles.centerText}>Carro não encontrado.</Text>
      </View>
    );

  return (
    <View style={styles.screen}>
      {notification && (
        <Notification
          message={notification.message}
          variant={notification.variant}
          onClose={() => setNotification(null)}
        />
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Card Superior Principal */}
        <View style={styles.topCard}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#111827" />
          </TouchableOpacity>

          {/* Miniaturas */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbRow}
          >
            {carro.allImages?.map((img, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setImgSelecionada(img)}
                style={[
                  styles.thumb,
                  imgSelecionada === img && styles.thumbSelected,
                ]}
              >
                <Image source={{ uri: img }} style={styles.thumbImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Imagem principal */}
          <View style={styles.mainImageWrapper}>
            <Image
              source={{ uri: imgSelecionada }}
              style={styles.mainImage}
              resizeMode="contain"
            />
          </View>

          {/* Informações */}
          <View style={styles.infoBlock}>
            <Text style={styles.title}>{carro.name}</Text>

            <Text style={styles.subtitle}>
              {carro.specs?.engine} • {carro.specs?.fuel} • {carro.specs?.transmission}
            </Text>

            <View style={styles.priceBlock}>
              <Text style={styles.priceLabel}>Preço à vista</Text>
              <Text style={styles.price}>
                <Text style={styles.priceCurrency}>R$ </Text>
                {carro.price.toLocaleString("pt-BR")}
              </Text>
            </View>

            {/* Grid de Atributos */}
            <View style={styles.attrGrid}>
              <View style={styles.attrItem}>
                <Text style={styles.attrLabel}>
                  <Feather name="map-pin" size={11} /> CIDADE
                </Text>
                <Text style={styles.attrValue}>São Paulo - SP</Text>
              </View>
              <View style={styles.attrItem}>
                <Text style={styles.attrLabel}>
                  <Feather name="calendar" size={11} /> ANO
                </Text>
                <Text style={styles.attrValue}>{carro.year}</Text>
              </View>
              <View style={styles.attrItem}>
                <Text style={styles.attrLabel}>CÂMBIO</Text>
                <Text style={styles.attrValue}>{carro.specs?.transmission}</Text>
              </View>
              <View style={styles.attrItem}>
                <Text style={styles.attrLabel}>
                  <Feather name="truck" size={11} /> MODELO
                </Text>
                <Text style={styles.attrValue}>{carro.model}</Text>
              </View>
            </View>

            <Button
              texto="Iniciar Proposta"
              style={styles.primaryButton}
              onPress={() => {
                if (!user?.id) return irParaLogin();
                setIsModalOpen(true);
              }}
            />

            <Button
              style={styles.secondaryButton}
              onPress={() => {
                if (!user?.id) return irParaLogin();
                setIsTestDriveModalOpen(true);
              }}
            >
              <Feather name="calendar" size={14} /> Agendar Test Drive
            </Button>
          </View>
        </View>

        {/* Especificações Técnicas */}
        <View style={styles.bottomCard}>
          <Text style={styles.sectionTitle}>Recursos e Itens do Veículo</Text>

          <View style={styles.specsGrid}>
            <SpecDescription titulo="Motorização" valor={carro.specs?.engine} />
            <SpecDescription titulo="Transmissão" valor={carro.specs?.transmission} />
            <SpecDescription titulo="Potência" valor={carro.specs?.potency} />
            <SpecDescription titulo="Velocidade Máxima" valor={carro.specs?.max_speed} />
            <SpecDescription titulo="Cor" valor={carro.specs?.color} />
          </View>

          <Text style={styles.sectionTitle}>Itens de Série</Text>
          <View style={styles.featuresWrap}>
            {carro?.features && Array.isArray(carro.features) && carro.features.length > 0 ? (
              carro.features.map((item: string | { name: string }, index: number) => (
                <View key={index} style={styles.featureBadge}>
                  <Text style={styles.featureText}>
                    {typeof item === "object" ? item.name : item}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Dados não disponíveis</Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Barra de ações fixa */}
      <View style={styles.actionBar}>
        <Button
          style={[styles.secondaryButton, { flex: 1 }]}
          onPress={() => {
            if (!user?.id) return irParaLogin();
            setIsTestDriveModalOpen(true);
          }}
        >
          <Feather name="calendar" size={14} /> Test Drive
        </Button>
        <Button
          texto="Iniciar Proposta"
          style={[styles.primaryButton, { flex: 1, marginTop: 0 }]}
          onPress={() => {
            if (!user?.id) return irParaLogin();
            setIsModalOpen(true);
          }}
        />
      </View>

      {/* Modais */}
      {isModalOpen && (
        <ProposalModal
          carId={id as string}
          isOpen={isModalOpen}
          userId={user?.id ?? ""}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isTestDriveModalOpen && (
        <TestDriveModal
          isOpen={isTestDriveModalOpen}
          carId={id as string}
          userId={user?.id ?? ""}
          onClose={() => setIsTestDriveModalOpen(false)}
          onSuccess={(msg: string) => setNotification({ message: msg, variant: "success" })}
          onError={(msg: string) => setNotification({ message: msg, variant: "error" })}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#121212" },
  scrollContent: { padding: 12, paddingBottom: 100 },
  centerScreen: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  centerText: { color: "#fff" },
  topCard: {
    backgroundColor: "#fff",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
  },
  backButton: { marginBottom: 12, alignSelf: "flex-start" },
  thumbRow: { marginBottom: 12 },
  thumb: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    padding: 2,
    marginRight: 8,
  },
  thumbSelected: { borderColor: "#C59958", borderWidth: 2 },
  thumbImage: { width: "100%", height: "100%", borderRadius: 4 },
  mainImageWrapper: {
    width: "100%",
    minHeight: 240,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  mainImage: { width: "90%", height: 240 },
  infoBlock: { width: "100%" },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#C59958",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  priceBlock: { marginBottom: 24 },
  priceLabel: { fontSize: 14, color: "#6b7280" },
  price: { fontSize: 34, fontWeight: "900", color: "#030712" },
  priceCurrency: { fontSize: 18, fontWeight: "700" },
  attrGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 24,
  },
  attrItem: { width: "45%" },
  attrLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  attrValue: { fontWeight: "700", color: "#111827" },
  primaryButton: {
    width: "100%",
    backgroundColor: "#C59958",
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  secondaryButton: {
    width: "100%",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  bottomCard: {
    backgroundColor: "#fff",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingBottom: 12,
    marginBottom: 20,
  },
  specsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    marginBottom: 24,
  },
  featuresWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  featureBadge: {
    backgroundColor: "#C59958",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  featureText: {
    color: "#fff",
    fontSize: 12,
    textTransform: "uppercase",
  },
  emptyText: { fontSize: 12, color: "#9ca3af" },
  actionBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    padding: 12,
    flexDirection: "row",
    gap: 8,
  },
});