import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useTheme } from '../../src/context/theme';
import { login } from '../../src/services/api';

const logo = require('../../src/assets/images/logo.png');

export default function LoginScreen() {
  const router = useRouter();
  const { colors, logoSizes } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setErrorMessage(null);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Email inválido');
      return;
    }

    if (!password) {
      setErrorMessage('Senha é obrigatória');
      return;
    }

    setIsLoading(true);
    try {
      await login({ email: email.trim(), password });
      router.replace('/(app)');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao realizar login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-[#121212]"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }} keyboardShouldPersistTaps="handled">
        <View className="mb-4 items-center">
          <Image
            source={logo}
            resizeMode="contain"
            style={{ width: logoSizes.main.width, height: logoSizes.main.height, maxWidth: '100%' }}
          />
        </View>

        <View className="rounded-[6px] border border-[#3D3933] bg-[#201F1D] p-6">
          <Text className="mb-2.5 text-center text-[11px] font-bold tracking-[2px] text-[#C59958]">PRIME MOTORS</Text>
          <Text className="text-center text-[25px] font-bold text-[#F8F6F1]">
            Acesse sua conta <Text className="text-[#C59958]">Prime</Text>
          </Text>
          <Text className="mt-2 text-center text-[14px] text-[#A9A49B]">Entre para continuar sua experiência.</Text>

          {errorMessage ? (
            <View className="mb-4 mt-5 rounded border border-[#A94343] bg-[#1A1A1A] p-2.5">
              <Text className="text-center text-[13px] text-[#ED8B8B]">{errorMessage}</Text>
            </View>
          ) : null}

          <Text className="mb-2 text-[11px] font-bold tracking-[1px] text-[#C9C2B8]">EMAIL</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="seu@email.com"
            placeholderTextColor={colors.placeholder}
            className="mb-5 h-[50px] rounded-[4px] border border-[#3D3933] bg-[#F4F1EB] px-[14px] text-[16px] text-[#171615]"
            value={email}
          />

          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-[11px] font-bold tracking-[1px] text-[#C9C2B8]">SENHA</Text>
            <Pressable onPress={() => setIsPasswordVisible((visible) => !visible)}>
              <Text className="text-[11px] font-bold tracking-[1px] text-[#C59958]">{isPasswordVisible ? 'OCULTAR' : 'MOSTRAR'}</Text>
            </Pressable>
          </View>
          <TextInput
            autoCapitalize="none"
            onChangeText={setPassword}
            placeholder="Digite sua senha"
            placeholderTextColor={colors.placeholder}
            secureTextEntry={!isPasswordVisible}
            className="mb-5 h-[50px] rounded-[4px] border border-[#3D3933] bg-[#F4F1EB] px-[14px] text-[16px] text-[#171615]"
            value={password}
          />

          <Pressable
            accessibilityRole="button"
            disabled={isLoading}
            onPress={handleLogin}
            className="mt-1 h-[52px] items-center justify-center rounded-[4px] bg-[#C59958]"
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : isLoading ? 0.6 : 1 }]}
          >
            {isLoading ? <ActivityIndicator color={colors.textOnButton} /> : <Text className="text-[14px] font-extrabold tracking-[1px] text-[#171615]">CONFIRMAR</Text>}
          </Pressable>

          <View className="mt-5 flex-row items-center justify-between">
            <Pressable onPress={() => router.replace('/(app)')}>
              <Text className="text-[14px] text-[#E8E2D8]">← Voltar</Text>
            </Pressable>
            <Link href="/(auth)/register" asChild>
              <Pressable>
                <Text className="text-[14px] font-bold text-[#C59958]">Criar conta</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

