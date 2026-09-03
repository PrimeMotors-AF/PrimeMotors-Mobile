import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useTheme } from '../context/theme';

const items = [
  { label: 'Início', href: '/' as const },
  { label: 'Explorar', href: '/explorar' as const },
  { label: 'Garagem', href: '/Garagem/' as const },
  { label: 'Favoritos', href: '/favoritos/' as const },
  { label: 'Perfil', href: '/perfil/' as const },
];

export function Navbar() {
  const { colors, styles } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={{ backgroundColor: colors.surface, borderBottomColor: colors.border, borderBottomWidth: 1 }}>
      <View style={[styles.navContainer, { paddingVertical: 25, justifyContent: 'flex-end' }]}>
        <Pressable
          accessibilityLabel={isOpen ? 'Fechar menu' : 'Abrir menu'}
          accessibilityRole="button"
          accessibilityState={{ expanded: isOpen }}
          onPress={() => setIsOpen((open) => !open)}
          style={({ pressed }) => [
            styles.navItem,
            { minWidth: 48, paddingVertical: 8 },
            pressed && styles.navPressed,
          ]}
        >
          <View style={{ gap: 5, marginLeft:-5 }}>
            <View style={{ width: 30, height: 4, backgroundColor: colors.text }} />
            <View style={{ width: 30, height: 4, backgroundColor: colors.text }} />
            <View style={{ width: 30, height: 4, backgroundColor: colors.text }} />
          </View>
        </Pressable>
      </View>

      {isOpen ? (
        <View style={{ borderTopColor: colors.border, borderTopWidth: 1, paddingHorizontal: 14, paddingVertical: 10,alignItems:'center' }}>
          {items.map((item, index) => (
            <Link href={item.href} asChild key={item.label}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setIsOpen(false)}
                style={({ pressed }) => [
                  styles.navItem,
                  { alignItems: 'flex-start', paddingVertical: 14 },
                  pressed && styles.navPressed,
                ]}
              >
                <Text
                  style={[
                    styles.navLabel,
                    { color: index === 0 ? colors.primary : colors.textMuted },
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            </Link>
          ))}
        </View>
      ) : null}
    </View>
  );
}
