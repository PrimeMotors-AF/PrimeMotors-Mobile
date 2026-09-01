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
	const { colors } = useTheme();
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
		<View className="mb-[14px]">
			<Text className="mb-[7px] text-[11px] font-bold tracking-[1px] text-[#C9C2B8]">{label}</Text>
			<TextInput
				autoCapitalize={name === 'email' ? 'none' : 'words'}
				autoCorrect={false}
				keyboardType={keyboardType}
				onChangeText={(value) => updateField(name, value)}
				placeholder={placeholder}
				placeholderTextColor={colors.placeholder}
				className="h-[48px] rounded-[4px] border border-[#3D3933] bg-[#F4F1EB] px-[14px] text-[16px] text-[#171615]"
				value={form[name]}
			/>
			{errors[name] ? <Text className="mt-[5px] text-[12px] text-[#ED8B8B]">{errors[name]}</Text> : null}
		</View>
	);

	return (
		<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-[#121212]">
			<ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }} keyboardShouldPersistTaps="handled">
				<View className="rounded-[6px] border border-[#3D3933] bg-[#201F1D] p-6">
					<Text className="mb-2.5 text-center text-[11px] font-bold tracking-[2px] text-[#C59958]">PRIME MOTORS</Text>
					<Text className="mb-5 text-center text-[22px] font-bold text-[#F8F6F1]">
						Associe-se à <Text className="text-[#C59958]">Prime Motors</Text>
					</Text>
					{field('name', 'NOME COMPLETO', 'Seu nome completo')}
					{field('cpf', 'CPF', '000.000.000-00')}
					{field('email', 'EMAIL', 'seu@email.com', 'email-address')}
					{field('number', 'TELEFONE', '(00) 00000-0000', 'phone-pad')}
					{field('cep', 'CEP', '00000-000')}
					{field('password', 'SENHA', 'Mínimo de 6 caracteres')}
					{field('confirmPassword', 'CONFIRMAR SENHA', 'Digite sua senha novamente')}
					<Pressable accessibilityRole="checkbox" accessibilityState={{ checked: acceptedTerms }} onPress={() => setAcceptedTerms((current) => !current)} className="mt-1 mb-[22px] flex-row items-center">
						<View className={`mr-[9px] h-[20px] w-[20px] items-center justify-center rounded-[2px] border ${acceptedTerms ? 'border-[#C59958] bg-[#C59958]' : 'border-[#C9C2B8]'}`}>
							{acceptedTerms ? <Text className="text-[14px] font-extrabold text-[#171615]">✓</Text> : null}
						</View>
						<Text className="flex-1 text-[12px] text-[#C9C2B8]">Aceito os Termos de Uso e a Política de Privacidade.</Text>
					</Pressable>
					{errors.terms ? <Text className="mt-[5px] text-[12px] text-[#ED8B8B]">{errors.terms}</Text> : null}
					<View className="mt-0.5 flex-row items-center justify-between">
						<Pressable onPress={() => router.replace('/(auth)/login')} style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
							<Text className="text-[14px] text-[#E8E2D8]">← Voltar</Text>
						</Pressable>
						<Pressable accessibilityRole="button" disabled={isLoading} onPress={handleRegister} className="ml-4 h-[50px] flex-1 items-center justify-center rounded-[4px] bg-[#C59958]" style={({ pressed }) => [{ opacity: pressed ? 0.8 : isLoading ? 0.6 : 1 }]}>
							{isLoading ? <ActivityIndicator color={colors.textOnButton} /> : <Text className="text-[13px] font-extrabold tracking-[1px] text-[#171615]">CONFIRMAR</Text>}
						</Pressable>
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
