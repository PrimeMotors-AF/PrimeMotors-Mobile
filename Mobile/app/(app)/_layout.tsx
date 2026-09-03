import "../../global.css";

import { Slot } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";

export default function RootLayout() {
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Navbar />

      <View style={styles.content}>
        <Slot />
      </View>

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },

  content: {
    flex: 1,
  },
});