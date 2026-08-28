import { createContext, useContext, type PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';

const colors = {
	background: '#121212',
	surface: '#1A1A1A',
	surfaceElevated: '#1C1C1C',
	surfaceMuted: '#201F1D',
	primary: '#C59958',
	primaryDark: '#A67F47',
	primaryLight: '#B68745',
	white: '#FFFFFF',
	text: '#F8F6F1',
	textMuted: '#A9A49B',
	textSecondary: '#C9C2B8',
	textDark: '#171615',
	textOnPrimary: '#171615',
	textOnButton: '#11100F',
	textFooter: '#E8E2D8',
	inputBackground: '#F4F1EB',
	placeholder: '#77746F',
	border: '#3D3933',
	borderMuted: 'rgba(255, 255, 255, 0.1)',
	danger: '#ED8B8B',
	dangerBorder: '#A94343',
} as const;

const textInputBase = {
	backgroundColor: colors.inputBackground,
	borderRadius: 4,
	color: colors.textDark,
	fontSize: 16,
	paddingHorizontal: 14,
};

const labelBase = {
	color: colors.textSecondary,
	fontSize: 11,
	fontWeight: '700' as const,
	letterSpacing: 1,
};

const primaryButtonBase = {
	alignItems: 'center' as const,
	backgroundColor: colors.primary,
	borderRadius: 4,
	justifyContent: 'center' as const,
};

const primaryButtonTextBase = {
	color: colors.textOnPrimary,
	fontWeight: '800' as const,
	letterSpacing: 1,
};

const styles = StyleSheet.create({
	screen: { flex: 1, backgroundColor: colors.background },
	content: { flexGrow: 1, justifyContent: 'center', padding: 24 },
	brandMark: { alignItems: 'center', marginBottom: 18 },
	logo: { height: 145, width: 180 },
	formCard: { backgroundColor: colors.surfaceMuted, borderColor: colors.border, borderRadius: 6, borderWidth: 1, padding: 24 },
	eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '700', letterSpacing: 2, marginBottom: 10, textAlign: 'center' },
	title: { color: colors.text, fontSize: 25, fontWeight: '700', textAlign: 'center' },
	gold: { color: colors.primary },
	subtitle: { color: colors.textMuted, fontSize: 14, marginBottom: 26, marginTop: 8, textAlign: 'center' },
	errorBox: { borderColor: colors.dangerBorder, borderRadius: 4, borderWidth: 1, marginBottom: 18, padding: 10 },
	errorText: { color: colors.danger, fontSize: 13, textAlign: 'center' },
	label: { ...labelBase, marginBottom: 8 },
	input: { ...textInputBase, height: 50, marginBottom: 20 },
	passwordHeader: { flexDirection: 'row', justifyContent: 'space-between' },
	showPassword: { color: colors.primary, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
	submitButton: { ...primaryButtonBase, height: 52, marginTop: 4 },
	submitText: { ...primaryButtonTextBase, fontSize: 14 },
	pressed: { opacity: 0.8 },
	disabled: { opacity: 0.6 },
	footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 22 },
	backText: { color: colors.textFooter, fontSize: 14 },
	registerText: { color: colors.primary, fontSize: 14, fontWeight: '700' },
	registerContent: { flexGrow: 1, padding: 24 },
	registerTitle: { color: colors.text, fontSize: 22, fontWeight: '700', marginBottom: 22, textAlign: 'center' },
	field: { marginBottom: 14 },
	fieldLabel: { ...labelBase, marginBottom: 7 },
	registerInput: { ...textInputBase, height: 48 },
	registerError: { color: colors.danger, fontSize: 12, marginTop: 5 },
	termsRow: { alignItems: 'center', flexDirection: 'row', marginBottom: 22, marginTop: 4 },
	checkbox: { alignItems: 'center', borderColor: colors.textSecondary, borderRadius: 2, borderWidth: 1, height: 20, justifyContent: 'center', marginRight: 9, width: 20 },
	checkboxSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
	checkboxMark: { color: colors.textOnPrimary, fontSize: 14, fontWeight: '800' },
	termsText: { color: colors.textSecondary, flex: 1, fontSize: 12 },
	registerActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
	registerButton: { ...primaryButtonBase, flex: 1, height: 50, marginLeft: 16 },
	registerButtonText: { ...primaryButtonTextBase, fontSize: 13 },
});

export type Theme = {
	colors: typeof colors;
	styles: typeof styles;
};

const theme: Theme = { colors, styles };

const ThemeContext = createContext<Theme>(theme);

export function ThemeProvider({ children }: PropsWithChildren) {
	return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
	return useContext(ThemeContext);
}
