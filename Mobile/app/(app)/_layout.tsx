import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Navbar } from "../../src/components/navbar";
import Footer from "./footer";

export default function AppLayout() {
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Navbar />

      <View style={styles.content}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </View>

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  content: {
    flex: 1,
  },
});
