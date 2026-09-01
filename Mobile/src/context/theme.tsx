import { createContext, useContext, type PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';

const colors = {
	gold: '#C59958',
	background: '#121212',
	surface: '#1A1A1A',
	surfaceElevated: '#1C1C1C',
	surfaceMuted: '#201F1D',
	primary: '#C59958',
	primaryDark: '#A67F47',
	primaryLight: '#B68745',
	white: '#FFFFFF',
	whiteBackground: '#F5F3EE',
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

const logoSizes = {
	main: {
		width: 300,
		height: 170,
	},
	nav: {
		width: 240,
		height: 150,
	},
} as const;

const styles = StyleSheet.create({
	homeCard: {
		backgroundColor: colors.white,
		borderColor: colors.gold,
		borderRadius: 5,
		borderWidth: 2,
		minHeight: 390,
		padding: 22,
	},
	homeCardActive: {
		borderColor: colors.primary,
	},
	homeReviewCard: {
		backgroundColor: colors.surfaceElevated,
		borderColor: colors.border,
		borderRadius: 4,
		borderWidth: 1,
		padding: 16,
		width: 285,
	},
	navContainer: {
		borderBottomWidth: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 14,
		paddingVertical: 13,
	},
});

export type Theme = {
	colors: typeof colors;
	styles: typeof styles;
	logoSizes: typeof logoSizes;
};

const theme: Theme = { colors, styles, logoSizes };

const ThemeContext = createContext<Theme>(theme);

export function ThemeProvider({ children }: PropsWithChildren) {
	return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
	return useContext(ThemeContext);
}

