import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../context/theme';

const items = [
  { label: 'Início', href: '/(app)' as const },
  { label: 'Explorar', href: '/(app)/explorar' as const },
  { label: 'Garagem', href: '/(app)/garagem/1' as const },
  { label: 'Favoritos', href: '/(app)/favoritos/1' as const },
  { label: 'Perfil', href: '/(app)/perfil/1' as const },
];

export function Navbar() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      {items.map((item, index) => (
        <Link href={item.href} asChild key={item.label}>
          <Pressable accessibilityRole="button" style={({ pressed }) => [styles.item, pressed && styles.pressed]}>
            <View style={[styles.dot, index === 0 && { backgroundColor: colors.primary }]} />
            <Text style={[styles.label, { color: index === 0 ? colors.primary : colors.textMuted }]}>{item.label}</Text>
          </Pressable>
        </Link>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 13 },
  item: { alignItems: 'center', minWidth: 54 },
  dot: { backgroundColor: 'transparent', borderRadius: 3, height: 5, marginBottom: 5, width: 5 },
  label: { fontSize: 10, fontWeight: '700', letterSpacing: 0.4 },
  pressed: { opacity: 0.65 },
});
