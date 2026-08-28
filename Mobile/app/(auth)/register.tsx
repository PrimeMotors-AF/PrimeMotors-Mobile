import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { useTheme } from '../../src/context/theme';
import { register } from '../../src/services/api';

const onlyDigits = (value: string) => value.replace(/\D/g, '');
const maskCpf = (value: string) => onlyDigits(value).slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
const maskCep = (value: string) => onlyDigits(value).slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
const maskPhone = (value: string) => {
	const digits = onlyDigits(value).slice(0, 11);
	return digits.length > 10 ? digits.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3') : digits.replace(/(\d{2})(\d{4})(\d{1,4})/, '($1) $2-$3');
};

type FormErrors = Partial<Record<'name' | 'cpf' | 'email' | 'password' | 'confirmPassword' | 'number' | 'cep' | 'terms', string>>;

export default function RegisterScreen() {
	const router = useRouter();
	const { colors, styles } = useTheme();
	const [form, setForm] = useState({ name: '', cpf: '', email: '', password: '', confirmPassword: '', number: '', cep: '' });
	const [errors, setErrors] = useState<FormErrors>({});
	const [acceptedTerms, setAcceptedTerms] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const updateField = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));

	const validate = () => {
		const nextErrors: FormErrors = {};
		if (form.name.trim().length < 3) nextErrors.name = 'Informe seu nome completo.';
		if (onlyDigits(form.cpf).length !== 11) nextErrors.cpf = 'CPF inválido ou incompleto.';
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nextErrors.email = 'Email inválido.';
		if (form.password.length < 6) nextErrors.password = 'A senha deve ter ao menos 6 caracteres.';
		if (form.password !== form.confirmPassword) nextErrors.confirmPassword = 'As senhas não conferem.';
		if (onlyDigits(form.number).length < 10) nextErrors.number = 'Telefone inválido ou incompleto.';
		if (onlyDigits(form.cep).length !== 8) nextErrors.cep = 'CEP inválido ou incompleto.';
		if (!acceptedTerms) nextErrors.terms = 'Aceite os termos para continuar.';
		setErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	};

	const handleRegister = async () => {
		if (!validate()) return;
		setIsLoading(true);
		try {
			await register({ name: form.name.trim(), email: form.email.trim(), password: form.password, cpf: onlyDigits(form.cpf), cep: onlyDigits(form.cep), number: onlyDigits(form.number) });
			router.replace('/(auth)/login');
		} catch (error) {
			setErrors({ email: error instanceof Error ? error.message : 'Erro ao realizar cadastro.' });
		} finally {
			setIsLoading(false);
		}
	};

	const field = (name: keyof typeof form, label: string, placeholder: string, keyboardType?: 'default' | 'email-address' | 'phone-pad') => (
		<View style={styles.field}>
			<Text style={styles.fieldLabel}>{label}</Text>
			<TextInput autoCapitalize={name === 'email' ? 'none' : 'words'} autoCorrect={false} keyboardType={keyboardType} onChangeText={(value) => updateField(name, value)} placeholder={placeholder} placeholderTextColor={colors.placeholder} style={styles.registerInput} value={form[name]} />
			{errors[name] ? <Text style={styles.registerError}>{errors[name]}</Text> : null}
		</View>
	);

	return (
		<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
			<ScrollView contentContainerStyle={styles.registerContent} keyboardShouldPersistTaps="handled">
				<View style={styles.formCard}>
					<Text style={styles.eyebrow}>PRIME MOTORS</Text>
					<Text style={styles.registerTitle}>Associe-se à <Text style={styles.gold}>Prime Motors</Text></Text>
					{field('name', 'NOME COMPLETO', 'Seu nome completo')}
					{field('cpf', 'CPF', '000.000.000-00')}
					{field('email', 'EMAIL', 'seu@email.com', 'email-address')}
					{field('number', 'TELEFONE', '(00) 00000-0000', 'phone-pad')}
					{field('cep', 'CEP', '00000-000')}
					{field('password', 'SENHA', 'Mínimo de 6 caracteres')}
					{field('confirmPassword', 'CONFIRMAR SENHA', 'Digite sua senha novamente')}
					<Pressable accessibilityRole="checkbox" accessibilityState={{ checked: acceptedTerms }} onPress={() => setAcceptedTerms((current) => !current)} style={styles.termsRow}>
						<View style={[styles.checkbox, acceptedTerms && styles.checkboxSelected]}>{acceptedTerms ? <Text style={styles.checkboxMark}>✓</Text> : null}</View>
						<Text style={styles.termsText}>Aceito os Termos de Uso e a Política de Privacidade.</Text>
					</Pressable>
					{errors.terms ? <Text style={styles.registerError}>{errors.terms}</Text> : null}
					<View style={styles.registerActions}>
						<Pressable onPress={() => router.replace('/(auth)/login')} style={({ pressed }) => [pressed && styles.pressed]}><Text style={styles.backText}>← Voltar</Text></Pressable>
						<Pressable accessibilityRole="button" disabled={isLoading} onPress={handleRegister} style={({ pressed }) => [styles.registerButton, pressed && styles.pressed, isLoading && styles.disabled]}>{isLoading ? <ActivityIndicator color={colors.textOnButton} /> : <Text style={styles.registerButtonText}>CONFIRMAR</Text>}</Pressable>
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
