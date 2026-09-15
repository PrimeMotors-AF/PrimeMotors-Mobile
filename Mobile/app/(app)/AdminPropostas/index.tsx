import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { ActivityIndicator, Alert, Image, Modal, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";

import garageService, { type ProposalDecision } from "../../../src/services/garageService";
import type { GarageProposal } from "../../../src/types/types";
import { authStorage } from "../../../src/utils/userLocalStorage";

const formatCurrency = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
const formatDate = (value?: string) => value ? new Intl.DateTimeFormat("pt-BR").format(new Date(value)) : "Não informada";
const formatStatus = (status: GarageProposal["status"]) => status === "EmAnalise" ? "Em Analise" : status;

export default function AdminPropostas() {
  const router = useRouter();
  const [proposals, setProposals] = useState<GarageProposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [proposalToDelete, setProposalToDelete] = useState<GarageProposal | null>(null);

  const loadProposals = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true); else setIsLoading(true);
    try {
      const user = await authStorage.getUser();
      if (!user?.id) return router.replace("/(auth)/login");
      if (user.role !== "admin") return router.replace("/(app)");
      setProposals(await garageService.getAllProposals());
      setErrorMessage(null);
    } catch (error) {
      console.error("Erro ao buscar propostas administrativas:", error);
      setErrorMessage("Não foi possível carregar as propostas.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [router]);

  useEffect(() => { void loadProposals(); }, [loadProposals]);

  const changeStatus = async (proposal: GarageProposal, status: ProposalDecision) => {
    setIsSaving(proposal.id);
    try {
      await garageService.updateProposalStatus(proposal.id, status);
      setProposals((current) => current.map((item) => item.id === proposal.id ? { ...item, status } : item));
    } catch (error) {
      console.error("Erro ao atualizar proposta:", error);
      Alert.alert("Erro", "Não foi possível atualizar o status da proposta.");
    } finally { setIsSaving(null); }
  };

  const removeProposal = (proposal: GarageProposal) => {
    setProposalToDelete(proposal);
  };

  const confirmRemoveProposal = async () => {
    if (!proposalToDelete) return;

    const proposalId = proposalToDelete.id;
    setIsSaving(proposalId);
    try {
      await garageService.deleteAdminProposal(proposalId);
      setProposals((current) => current.filter((item) => item.id !== proposalId));
      setProposalToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir proposta:", error);
      Alert.alert(
        "Erro",
        error instanceof Error ? error.message : "Não foi possível excluir a proposta.",
      );
    } finally {
      setIsSaving(null);
    }
  };

  if (isLoading) return <View className="flex-1 items-center justify-center bg-[#121212]"><ActivityIndicator color="#C59958" /><Text className="mt-4 text-[11px] tracking-[2px] text-[#C59958]">CARREGANDO PROPOSTAS...</Text></View>;

  return <>
  <ScrollView className="flex-1 bg-[#121212]" contentContainerStyle={{ padding: 20, paddingTop: 12, paddingBottom: 32 }} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => void loadProposals(true)} tintColor="#C59958" />}>
    <View className="mb-8 border-l-[5px] border-[#C59958] pl-4"><Text className="text-[25px] font-light tracking-[3px] text-[#F8F6F1]">PROPOSTAS RECEBIDAS</Text><Text className="mt-2 text-[12px] text-[#A9A49B]">Gestão administrativa</Text></View>
    {errorMessage ? <Text className="mb-5 border border-[#A94343] bg-[#351D1D] p-3 text-[#ED8B8B]">{errorMessage}</Text> : null}
    {proposals.length === 0 && !errorMessage ? <Text className="text-[14px] italic text-[#77736D]">Nenhuma proposta recebida.</Text> : <View className="gap-5">{proposals.map((proposal) => <View key={proposal.id} className="overflow-hidden border border-[#3D3933] bg-[#1C1C1C]">
      {proposal.imgUrl ? <Image source={{ uri: proposal.imgUrl }} className="h-[170px] w-full" resizeMode="cover" /> : <View className="h-[170px] items-center justify-center bg-[#252321]"><Text className="text-[11px] tracking-[1px] text-[#77736D]">IMAGEM INDISPONÍVEL</Text></View>}
      <View className="p-4"><View className="mb-3 flex-row items-start justify-between gap-3"><Text className="flex-1 text-[19px] font-bold uppercase text-[#F8F6F1]">{proposal.name}</Text><Text className="bg-[#C59958] px-2 py-1 text-[10px] font-bold uppercase text-[#171615]">{formatStatus(proposal.status)}</Text></View>
        <Text className="mb-2 text-[11px] uppercase tracking-[1px] text-[#77736D]">Usuário: <Text className="text-[#F8F6F1]">{proposal.user?.name ?? "Não informado"}</Text></Text>
        <Text className="mb-2 text-[11px] uppercase tracking-[1px] text-[#77736D]">Valor: <Text className="text-[#F8F6F1]">{formatCurrency(proposal.offeredValue)}</Text></Text>
        <Text className="text-[11px] uppercase tracking-[1px] text-[#77736D]">Data: <Text className="text-[#F8F6F1]">{formatDate(proposal.date_offer)}</Text></Text>
        {proposal.message ? <Text className="mt-3 border-t border-[#3D3933] pt-3 text-[12px] italic text-[#A9A49B]">&quot;{proposal.message}&quot;</Text> : null}
        <View className="mt-5 gap-2">
          <Text className="text-[10px] font-bold tracking-[1px] text-[#A9A49B]">ALTERAR STATUS</Text>
          <View className="flex-row gap-2">
            <Pressable disabled={isSaving === proposal.id} onPress={() => void changeStatus(proposal, "EmAnalise")} className="flex-1 items-center border border-[#C59958] py-3 disabled:opacity-50"><Text className="text-[10px] font-bold tracking-[1px] text-[#C59958]">EM ANALISE</Text></Pressable>
            <Pressable disabled={isSaving === proposal.id} onPress={() => void changeStatus(proposal, "Aceita")} className="flex-1 items-center bg-[#3C8063] py-3 disabled:opacity-50"><Text className="text-[10px] font-bold tracking-[1px] text-white">ACEITA</Text></Pressable>
            <Pressable disabled={isSaving === proposal.id} onPress={() => void changeStatus(proposal, "Recusada")} className="flex-1 items-center bg-[#A94343] py-3 disabled:opacity-50"><Text className="text-[10px] font-bold tracking-[1px] text-white">RECUSADA</Text></Pressable>
          </View>
          <Pressable disabled={isSaving === proposal.id} onPress={() => removeProposal(proposal)} className="items-center border border-[#A94343] py-3 disabled:opacity-50"><Text className="text-[10px] font-bold tracking-[1px] text-[#ED8B8B]">REMOVER DA LISTA</Text></Pressable>
        </View>
      </View>
    </View>)}</View>}
  </ScrollView>
  <Modal visible={proposalToDelete !== null} transparent animationType="fade" onRequestClose={() => setProposalToDelete(null)}>
    <View className="flex-1 items-center justify-center bg-black/75 px-5">
      <View className="w-full max-w-[420px] border border-[#3D3933] bg-[#121212] p-5">
        <Text className="mb-3 text-[18px] font-bold text-[#F8F6F1]">Remover da lista</Text>
        <Text className="mb-6 text-[14px] text-[#A9A49B]">Deseja remover esta proposta somente da sua lista administrativa?</Text>
        <View className="flex-row gap-3">
          <Pressable disabled={isSaving !== null} onPress={() => setProposalToDelete(null)} className="flex-1 items-center border border-[#3D3933] py-3 disabled:opacity-50">
            <Text className="text-[11px] font-bold tracking-[1px] text-[#A9A49B]">CANCELAR</Text>
          </Pressable>
          <Pressable disabled={isSaving !== null} onPress={() => void confirmRemoveProposal()} className="flex-1 items-center bg-[#A94343] py-3 disabled:opacity-50">
            {isSaving !== null ? <ActivityIndicator color="#FFFFFF" /> : <Text className="text-[11px] font-bold tracking-[1px] text-white">REMOVER</Text>}
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>
  </>;
}