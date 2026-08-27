import { View, Text } from "react-native";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Bem-vindo à área Logada!</Text>
      <button style={{padding:'12px',width:'120px',fontSize:'16px',fontStyle:'Bold'}}><a href="/login">login</a></button>
    </View>
  );
}
