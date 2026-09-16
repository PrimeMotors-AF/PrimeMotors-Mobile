import { useRef } from "react";
import {
  Animated,
  Pressable,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from "react-native";

export interface ButtonProps {
  texto?: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export default function Button({
  texto,
  onPress,
  disabled,
  children,
  style,
  textStyle,
}: ButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 40,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Animated.View style={[{ transform: [{ scale }] }, style]}>
        {typeof (children || texto) === "string" ? (
          <Text style={[styles.text, textStyle]}>{children || texto}</Text>
        ) : (
          children
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 44,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {                    // NOVO
    width: "100%",
    alignItems: "center",
  },
  pressed: {
    backgroundColor: "rgba(55, 65, 81, 0.1)",
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: "#111827",
    fontWeight: "600",
    textAlign: "center",        // NOVO
  },
});