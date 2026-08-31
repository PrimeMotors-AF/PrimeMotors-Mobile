import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { useTheme } from '../context/theme';

const items = [
  { label: 'Início', href: '/(app)' as const },
  { label: 'Explorar', href: '/(app)/explorar' as const },
  { label: 'Garagem', href: '/(app)/garagem/1' as const },
  { label: 'Favoritos', href: '/(app)/favoritos/1' as const },
  { label: 'Perfil', href: '/(app)/perfil/1' as const },
];

export function Navbar() {
  const { colors, styles } = useTheme();

  return (
    <View style={[styles.navContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      {items.map((item, index) => (
        <Link href={item.href} asChild key={item.label}>
          <Pressable
            accessibilityRole="button"
            className="items-center min-w-[54px]"
            style={({ pressed }) => [{ opacity: pressed ? 0.65 : 1 }]}
          >
            <View
              className="mb-1.5 h-[5px] w-[5px] rounded-[3px]"
              style={{ backgroundColor: index === 0 ? colors.primary : 'transparent' }}
            />
            <Text
              className="text-[10px] font-bold tracking-[0.4px]"
              style={{ color: index === 0 ? colors.primary : colors.textMuted }}
            >
              {item.label}
            </Text>
          </Pressable>
        </Link>
      ))}
    </View>
  );
}

