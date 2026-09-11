import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { useTheme } from "../../../src/context/theme";
import { userService, type ProfileUser } from "../../../src/services/userService";
import { authStorage } from "../../../src/utils/userLocalStorage";

type EditMode = "password" | "phone" | "avatar" | null;

export default function Perfil() {
  const router = useRouter();
  const { colors } = useTheme();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editMode, setEditMode] = useState<EditMode>(null);
  const [value, setValue] = useState("");

  const loadProfile = useCallback(async () => {
    try {
      const storedUser = await authStorage.getUser();
      if (!storedUser?.id) {
        router.replace("/(auth)/login");
        return;
      }
      const profile = await userService.getProfile(storedUser.id);
      setUser(profile);
      await authStorage.saveUser(profile);
    } catch (error) {
      Alert.alert("Erro", error instanceof Error ? error.message : "Não foi possível carregar seu perfil.");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const openEditor = (mode: Exclude<EditMode, null>) => {
    setEditMode(mode);
    setValue(mode === "phone" ? user?.number ?? "" : "");
  };

  const saveEdit = async () => {
    if (!user || !editMode || !value.trim()) return;
    setIsSaving(true);
    try {
      const updated = editMode === "avatar"
        ? await userService.updateAvatar(user.id, value.trim())
        : await userService.updateProfile(user.id, {
            name: user.name,
            cpf: user.cpf,
            cep: user.cep,
            number: editMode === "phone" ? value.trim() : user.number,
            ...(editMode === "password" ? { password: value.trim() } : {}),
          });
      setUser(updated);
      await authStorage.saveUser(updated);
      setEditMode(null);
      setValue("");
      Alert.alert("Sucesso", editMode === "avatar" ? "Foto de perfil atualizada!" : "Perfil atualizado com sucesso!");
    } catch (error) {
      Alert.alert("Erro", error instanceof Error ? error.message : "Não foi possível atualizar o perfil.");
    } finally {
      setIsSaving(false);
    }
  };

  const removeAvatar = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const updated = await userService.updateAvatar(user.id, null);
      setUser(updated);
      await authStorage.saveUser(updated);
      Alert.alert("Sucesso", "Foto removida com sucesso!");
    } catch (error) {
      Alert.alert("Erro", error instanceof Error ? error.message : "Erro ao remover foto.");
    } finally {
      setIsSaving(false);
    }
  };

  const logout = async () => {
    setIsSaving(true);
    try {
      await authStorage.removeSession();
      router.replace("/(auth)/login");
    } catch (error) {
      Alert.alert("Erro", error instanceof Error ? error.message : "Erro ao sair da conta.");
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <View className="flex-1 items-center justify-center bg-[#121212]"><ActivityIndicator color={colors.primary} /></View>;
  }
  if (!user) return null;

  const modalTitle = editMode === "password" ? "SEGURANÇA" : editMode === "avatar" ? "ATUALIZAR FOTO" : "CONTATO";
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 bg-[#121212]">
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 36 }} keyboardShouldPersistTaps="handled">
        <View className="mb-8 border-l-4 border-[#C59958] pl-3"><Text className="text-[24px] font-light tracking-[3px] text-[#F8F6F1]">MEU PERFIL</Text></View>
        <View className="mb-7 items-center">
          {user.avatarUrl ? <Image source={{ uri: user.avatarUrl }} className="h-36 w-36 rounded-full border border-[#C59958]" /> : <View className="h-36 w-36 items-center justify-center rounded-full border border-[#C59958] bg-[#F4F1EB]"><Text className="text-[13px] text-[#77746F]">Sem foto</Text></View>}
          <Pressable onPress={() => openEditor("avatar")} className="mt-4"><Text className="text-[14px] text-[#C59958]">Trocar foto</Text></Pressable>
          {user.avatarUrl ? <Pressable disabled={isSaving} onPress={removeAvatar} className="mt-3"><Text className="text-[13px] text-[#ED8B8B]">Remover foto</Text></Pressable> : null}
        </View>
        <View className="border border-[#3D3933] bg-[#121212]">
          <View className="border-b border-[#3D3933] p-5"><Text className="text-[10px] font-bold tracking-[2px] text-[#A9A49B]">USUÁRIO</Text><Text className="mt-1 text-[28px] font-semibold italic text-[#F8F6F1]">{user.name}</Text></View>
          <View className="p-5">
            <InfoRow label="EMAIL" value={user.email} />
            <InfoRow label="SENHA" value="••••••••••••••" onPress={() => openEditor("password")} />
            <InfoRow label="CEP" value={user.cep} />
            <InfoRow label="CPF" value={user.cpf} />
            <InfoRow label="TELEFONE" value={user.number} onPress={() => openEditor("phone")} />
          </View>
        </View>
        <Pressable disabled={isSaving} onPress={logout} className="mt-4 border border-[#A94343] p-4"><Text className="text-center text-[13px] font-bold tracking-[1px] text-[#ED8B8B]">{isSaving ? "SAINDO..." : "SAIR DA CONTA"}</Text></Pressable>
      </ScrollView>

      <Modal visible={editMode !== null} transparent animationType="fade" onRequestClose={() => setEditMode(null)}>
        <View className="flex-1 justify-center bg-black/80 px-5"><View className="border border-[#3D3933] bg-[#1A1A1A] p-6">
          <Text className="mb-7 text-[19px] font-light tracking-[3px] text-[#F8F6F1]">{modalTitle}</Text>
          <TextInput autoCapitalize="none" autoCorrect={false} keyboardType={editMode === "phone" ? "phone-pad" : "default"} secureTextEntry={editMode === "password"} onChangeText={(text) => setValue(editMode === "phone" ? text.replace(/\D/g, "").slice(0, 13) : text)} placeholder={editMode === "avatar" ? "URL da imagem" : editMode === "password" ? "Nova senha" : "Novo telefone"} placeholderTextColor={colors.placeholder} value={value} className="mb-5 h-[50px] border-b border-[#3D3933] px-1 text-[16px] text-[#F8F6F1]" />
          <View className="flex-row justify-end gap-3"><Pressable onPress={() => setEditMode(null)} className="border border-[#3D3933] px-4 py-3"><Text className="text-[#F8F6F1]">Cancelar</Text></Pressable><Pressable disabled={isSaving || !value.trim()} onPress={saveEdit} className="bg-[#C59958] px-5 py-3"><Text className="font-bold text-[#171615]">{isSaving ? "SALVANDO..." : "CONFIRMAR"}</Text></Pressable></View>
        </View></View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

function InfoRow({ label, value, onPress }: { label: string; value: string; onPress?: () => void }) {
  return <View className="mb-5 flex-row items-end justify-between border-b border-[#201F1D] pb-3"><View className="flex-1"><Text className="mb-1 text-[10px] font-bold tracking-[1px] text-[#A9A49B]">{label}</Text><Text className="text-[16px] text-[#F8F6F1]">{value}</Text></View>{onPress ? <Pressable onPress={onPress}><Text className="text-[12px] font-bold text-[#C59958]">EDITAR</Text></Pressable> : null}</View>;
}
