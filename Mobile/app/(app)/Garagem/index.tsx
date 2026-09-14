import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Image,
	Modal,
	Pressable,
	RefreshControl,
	ScrollView,
	Text,
	TextInput,
	View,
} from "react-native";

import garageService from "../../../src/services/garageService";
import type { GarageProposal } from "../../../src/types/types";
import { authStorage } from "../../../src/utils/userLocalStorage";

const formatCurrency = (value: number) =>
	new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(value);

const formatDate = (value?: string) => {
	if (!value) return "Não informada";

	const date = new Date(value);
	return Number.isNaN(date.getTime())
		? "Não informada"
		: new Intl.DateTimeFormat("pt-BR").format(date);
};

export default function Garagem() {
	const router = useRouter();
	const [proposals, setProposals] = useState<GarageProposal[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [activeProposal, setActiveProposal] = useState<GarageProposal | null>(null);
	const [offeredValue, setOfferedValue] = useState("");
	const [message, setMessage] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const [isConfirmingRemoval, setIsConfirmingRemoval] = useState(false);

	const loadGarage = useCallback(async (refresh = false) => {
		if (refresh) setIsRefreshing(true);
		else setIsLoading(true);
		setErrorMessage(null);

		try {
			const user = await authStorage.getUser();
			if (!user?.id) {
				router.replace("/(auth)/login");
				return;
			}

			setProposals(await garageService.getUserProposals(user.id));
		} catch (error) {
			console.error("Erro ao buscar garagem:", error);
			setErrorMessage("Não foi possível carregar sua garagem.");
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	}, [router]);

	useEffect(() => {
		void loadGarage();
	}, [loadGarage]);

	const openEditor = (proposal: GarageProposal) => {
		setActiveProposal(proposal);
		setOfferedValue(String(proposal.offeredValue));
		setMessage(proposal.message ?? "");
	};

	const closeEditor = () => {
		if (!isSaving) {
			setIsConfirmingRemoval(false);
			setActiveProposal(null);
		}
	};

	const saveProposal = async () => {
		const parsedValue = Number(offeredValue.replace(",", "."));
		if (!activeProposal || !Number.isFinite(parsedValue) || parsedValue <= 0) {
			Alert.alert("Valor inválido", "Insira um valor maior que zero.");
			return;
		}

		setIsSaving(true);
		try {
			await garageService.updateCarProposal(activeProposal.id, {
				offeredValue: parsedValue,
				message: message.trim(),
			});
			setProposals((current) =>
				current.map((proposal) =>
					proposal.id === activeProposal.id
						? { ...proposal, offeredValue: parsedValue, message }
						: proposal,
				),
			);
			setActiveProposal(null);
			Alert.alert("Sucesso", "Proposta atualizada com sucesso.");
		} catch (error) {
			console.error("Erro ao atualizar proposta:", error);
			Alert.alert("Erro", "Não foi possível atualizar a proposta.");
		} finally {
			setIsSaving(false);
		}
	};

	const deleteProposal = () => {
		if (activeProposal && !isSaving) setIsConfirmingRemoval(true);
	};

	const confirmDeleteProposal = async () => {
		if (!activeProposal) return;

		setIsSaving(true);
		try {
			await garageService.deleteCarProposal(activeProposal.id);
			setProposals((current) =>
				current.filter((proposal) => proposal.id !== activeProposal.id),
			);
			setIsConfirmingRemoval(false);
			setActiveProposal(null);
		} catch (error) {
			console.error("Erro ao excluir proposta:", error);
			setErrorMessage("Não foi possível excluir a proposta. Tente novamente.");
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) {
		return (
			<View className="flex-1 items-center justify-center bg-[#121212]">
				<ActivityIndicator color="#C59958" />
				<Text className="mt-4 text-[11px] font-light tracking-[2px] text-[#C59958]">
					CARREGANDO SUA COLEÇÃO...
				</Text>
			</View>
		);
	}

	return (
		<>
			<ScrollView
				className="flex-1 bg-[#121212]"
				contentContainerStyle={{ padding: 20, paddingTop: 12, paddingBottom: 32 }}
				refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => void loadGarage(true)} tintColor="#C59958" />}
				showsVerticalScrollIndicator={false}
			>
				<View className="mb-8 border-l-[5px] border-[#C59958] pl-4">
					<Text className="text-[25px] font-light tracking-[3px] text-[#F8F6F1]">
						MINHA GARAGEM
					</Text>
				</View>

				{errorMessage ? (
					<View className="mb-5 border border-[#A94343] bg-[#351D1D] p-3">
						<Text className="text-[13px] text-[#ED8B8B]">{errorMessage}</Text>
						<Pressable onPress={() => void loadGarage()} className="mt-3">
							<Text className="text-[11px] font-bold tracking-[1px] text-[#C59958]">
								TENTAR NOVAMENTE
							</Text>
						</Pressable>
					</View>
				) : null}

				{proposals.length === 0 && !errorMessage ? (
					<Text className="px-1 text-[14px] italic text-[#77736D]">
						Nenhum veículo em sua garagem no momento.
					</Text>
				) : (
					<View className="gap-5">
						{proposals.map((proposal) => (
							<View key={proposal.id} className="overflow-hidden border border-[#3D3933] bg-[#1C1C1C]">
								{proposal.imgUrl ? (
									<Image source={{ uri: proposal.imgUrl }} className="h-[190px] w-full" resizeMode="cover" />
								) : (
									<View className="h-[190px] items-center justify-center bg-[#252321]">
										<Text className="text-[11px] tracking-[1px] text-[#77736D]">IMAGEM INDISPONÍVEL</Text>
									</View>
								)}

								<View className="p-4">
									<View className="mb-4 flex-row items-start justify-between gap-3">
										<Text className="flex-1 text-[19px] font-bold uppercase text-[#F8F6F1]">{proposal.name}</Text>
										<Text className="rounded bg-[#C59958] px-2 py-1 text-[10px] font-bold uppercase text-[#171615]">{proposal.status}</Text>
									</View>
									<Text className="mb-2 text-[11px] uppercase tracking-[1px] text-[#77736D]">
										Valor ofertado: <Text className="text-[#F8F6F1]">{formatCurrency(proposal.offeredValue)}</Text>
									</Text>
									<Text className="text-[11px] uppercase tracking-[1px] text-[#77736D]">
										Data da proposta: <Text className="text-[#F8F6F1]">{formatDate(proposal.date_offer)}</Text>
									</Text>
									  {proposal.message ? <Text className="mt-3 border-t border-[#3D3933] pt-3 text-[12px] italic text-[#A9A49B]">&quot;{proposal.message}&quot;</Text> : null}
									<Pressable onPress={() => openEditor(proposal)} className="mt-5 items-center rounded bg-[#C59958] py-3">
										<Text className="text-[12px] font-bold tracking-[1px] text-[#171615]">EDITAR PROPOSTA</Text>
									</Pressable>
								</View>
							</View>
						))}
					</View>
				)}
			</ScrollView>

			<Modal visible={activeProposal !== null} transparent animationType="fade" onRequestClose={closeEditor}>
				<View className="flex-1 justify-center bg-black/75 p-5">
					<View className="border border-[#3D3933] bg-[#121212] p-5">
						<Text className="mb-6 border-b border-[#3D3933] pb-4 text-center text-[20px] font-light tracking-[2px] text-[#F8F6F1]">EDITAR PROPOSTA</Text>
						<Text className="mb-2 text-[11px] font-bold tracking-[1px] text-[#A9A49B]">VALOR (R$)</Text>
						<TextInput value={offeredValue} onChangeText={setOfferedValue} keyboardType="decimal-pad" editable={!isSaving} className="mb-5 border-b border-[#3D3933] py-2 text-[17px] text-[#F8F6F1]" placeholderTextColor="#77736D" />
						<Text className="mb-2 text-[11px] font-bold tracking-[1px] text-[#A9A49B]">MENSAGEM</Text>
						<TextInput value={message} onChangeText={setMessage} multiline numberOfLines={4} editable={!isSaving} className="mb-6 min-h-[96px] border border-[#3D3933] bg-[#1C1C1C] p-3 text-[15px] text-[#F8F6F1]" placeholderTextColor="#77736D" />
						<Pressable disabled={isSaving} onPress={() => void saveProposal()} className="items-center bg-[#C59958] py-3 opacity-100 disabled:opacity-50">
							{isSaving ? <ActivityIndicator color="#171615" /> : <Text className="text-[12px] font-bold tracking-[1px] text-[#171615]">SALVAR ALTERAÇÕES</Text>}
						</Pressable>
						<Pressable disabled={isSaving} onPress={closeEditor} className="mt-3 items-center py-3">
							<Text className="text-[12px] tracking-[1px] text-[#A9A49B]">CANCELAR</Text>
						</Pressable>
						{isConfirmingRemoval ? (
							<View className="mt-2 border border-[#A94343] bg-[#351D1D] p-3">
								<Text className="mb-3 text-center text-[12px] text-[#ED8B8B]">
									Deseja excluir esta proposta?
								</Text>
								<View className="flex-row gap-2">
									<Pressable
										disabled={isSaving}
										onPress={() => setIsConfirmingRemoval(false)}
										className="flex-1 items-center border border-[#3D3933] py-3 disabled:opacity-50"
									>
										<Text className="text-[11px] font-bold tracking-[1px] text-[#A9A49B]">CANCELAR</Text>
									</Pressable>
									<Pressable
										disabled={isSaving}
										onPress={() => void confirmDeleteProposal()}
										className="flex-1 items-center bg-[#A94343] py-3 disabled:opacity-50"
									>
										{isSaving ? <ActivityIndicator color="#FFFFFF" /> : <Text className="text-[11px] font-bold tracking-[1px] text-white">EXCLUIR</Text>}
									</Pressable>
								</View>
							</View>
						) : (
							<Pressable disabled={isSaving} onPress={deleteProposal} className="mt-2 items-center py-2">
								<Text className="text-[11px] font-bold tracking-[1px] text-[#ED8B8B]">EXCLUIR PROPOSTA</Text>
							</Pressable>
						)}
					</View>
				</View>
			</Modal>
		</>
	);
}
