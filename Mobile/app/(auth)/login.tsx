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
  const { colors, styles } = useTheme();
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
      style={styles.screen}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.brandMark}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.formCard}>
          <Text style={styles.eyebrow}>PRIME MOTORS</Text>
          <Text style={styles.title}>Acesse sua conta <Text style={styles.gold}>Prime</Text></Text>
          <Text style={styles.subtitle}>Entre para continuar sua experiência.</Text>

          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="seu@email.com"
            placeholderTextColor={colors.placeholder}
            style={styles.input}
            value={email}
          />

          <View style={styles.passwordHeader}>
            <Text style={styles.label}>SENHA</Text>
            <Pressable onPress={() => setIsPasswordVisible((visible) => !visible)}>
              <Text style={styles.showPassword}>{isPasswordVisible ? 'OCULTAR' : 'MOSTRAR'}</Text>
            </Pressable>
          </View>
          <TextInput
            autoCapitalize="none"
            onChangeText={setPassword}
            placeholder="Digite sua senha"
            placeholderTextColor={colors.placeholder}
            secureTextEntry={!isPasswordVisible}
            style={styles.input}
            value={password}
          />

          <Pressable
            accessibilityRole="button"
            disabled={isLoading}
            onPress={handleLogin}
            style={({ pressed }) => [styles.submitButton, pressed && styles.pressed, isLoading && styles.disabled]}
          >
            {isLoading ? <ActivityIndicator color={colors.textOnButton} /> : <Text style={styles.submitText}>CONFIRMAR</Text>}
          </Pressable>

          <View style={styles.footer}>
            <Pressable onPress={() => router.replace('/(app)')}>
              <Text style={styles.backText}>← Voltar</Text>
            </Pressable>
            <Link href="/(auth)/register" asChild>
              <Pressable><Text style={styles.registerText}>Criar conta</Text></Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

