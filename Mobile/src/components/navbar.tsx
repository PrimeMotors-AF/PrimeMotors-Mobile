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
    <View
      style={[
        styles.navContainer,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        },
      ]}
    >
      {items.map((item, index) => (
        <Link href={item.href} asChild key={item.label}>
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.navItem,
              pressed && styles.navPressed,
            ]}
          >
            <Text
              style={[
                styles.navLabel,
                {
                  color:
                    index === 0
                      ? colors.primary
                      : colors.textMuted,
                },
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        </Link>
      ))}
    </View>
  );
}
