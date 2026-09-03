import "../../global.css";

import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Navbar } from "@/components/navbar";

export default function AppLayout() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Navbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
});
