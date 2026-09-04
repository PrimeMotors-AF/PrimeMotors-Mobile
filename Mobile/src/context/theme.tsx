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
	homeScreen: {
		backgroundColor: colors.background,
		flex: 1,
	},
	homeHeader: {
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingTop: 24,
		paddingBottom: 12,
	},
	homeLogo: {
		width: logoSizes.main.width,
		height: logoSizes.main.height,
		marginBottom: 6,
	},
	homeHeaderMeta: {
		color: colors.textMuted,
		fontSize: 11,
		fontWeight: '700',
		letterSpacing: 2,
		textTransform: 'uppercase',
	},
	homeIntro: {
		paddingHorizontal: 20,
		paddingVertical: 8,
	},
	homeEyebrow: {
		color: colors.primary,
		fontSize: 11,
		fontWeight: '700',
		letterSpacing: 2,
		marginBottom: 8,
		textTransform: 'uppercase',
	},
	homeHeading: {
		color: colors.text,
		fontSize: 32,
		fontWeight: '700',
		lineHeight: 38,
		marginBottom: 10,
	},
	homeDescription: {
		color: colors.textSecondary,
		fontSize: 15,
		lineHeight: 22,
	},
	homeCarousel: {
		alignItems: 'center',
		paddingHorizontal: 12,
		paddingVertical: 12,
	},
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
	homeCarCard: {
		backgroundColor: colors.surface,
		borderColor: colors.border,
		borderRadius: 16,
		borderWidth: 1,
		justifyContent: 'space-between',
		marginRight: 14,
		minHeight: 480,
		padding: 18,
	},
	homeCarCardActive: {
		borderColor: colors.primary,
		elevation: 4,
		shadowColor: '#000000',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.15,
		shadowRadius: 20,
	},
	homeCarName: {
		color: colors.text,
		fontSize: 22,
		fontWeight: '700',
		marginBottom: 6,
	},
	homeCarSlogan: {
		color: colors.primary,
		fontSize: 11,
		fontWeight: '700',
		letterSpacing: 1.2,
		marginBottom: 12,
		textTransform: 'uppercase',
	},
	homeCarImage: {
		height: 190,
		marginBottom: 12,
		width: '100%',
	},
	homeOutlineButton: {
		alignItems: 'center',
		borderColor: colors.border,
		borderRadius: 999,
		borderWidth: 1,
		justifyContent: 'center',
		paddingHorizontal: 18,
		paddingVertical: 12,
	},
	homePressed: {
		opacity: 0.7,
	},
	homeOutlineText: {
		color: colors.text,
		fontSize: 11,
		fontWeight: '700',
		letterSpacing: 1.8,
	},
	homePagination: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center',
		paddingVertical: 8,
	},
	homePaginationDot: {
		backgroundColor: colors.border,
		borderRadius: 999,
		height: 8,
		marginHorizontal: 4,
		width: 8,
	},
	homePaginationDotActive: {
		backgroundColor: colors.primary,
		width: 26,
	},
	homeReviews: {
		paddingHorizontal: 20,
		paddingTop: 20,
		paddingBottom: 24,
	},
	homeReviewHeading: {
		color: colors.text,
		fontSize: 24,
		fontWeight: '700',
		lineHeight: 30,
		marginBottom: 14,
	},
	homeReviewList: {
		paddingVertical: 8,
	},
	homeReviewCard: {
		backgroundColor: colors.surfaceElevated,
		borderColor: colors.border,
		borderRadius: 14,
		borderWidth: 1,
		marginRight: 12,
		padding: 14,
		width: 280,
	},
	homeReviewImage: {
		borderRadius: 12,
		height: 180,
		marginBottom: 12,
		width: '100%',
	},
	homeReviewText: {
		color: colors.textSecondary,
		fontSize: 13,
		lineHeight: 20,
		marginBottom: 16,
	},
	homeReviewFooter: {
		borderTopColor: colors.borderMuted,
		borderTopWidth: 1,
		paddingTop: 12,
	},
	homeReviewer: {
		color: colors.text,
		fontSize: 14,
		fontWeight: '700',
		marginBottom: 4,
	},
	homeReviewCar: {
		color: colors.primary,
		fontSize: 12,
		fontWeight: '600',
	},
	homeReviewCard2: {
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
	navItem: {
		alignItems: 'center',
		minWidth: 54,
		paddingVertical: 10,
	},
	navLabel: {
		fontSize: 15,
		fontWeight: '600',
		letterSpacing: 0.4,
		marginVertical:5
	},
	navPressed: {
		opacity: 0.65,
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

