import { Link, useRouter } from 'expo-router';
import { View, Text, Button } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();

  const handleLogin = () => {
    // Valida o login e redireciona para a área interna
    router.replace('/(app)');
  };

  return (
    <View>
      <Text>Tela de Login</Text>
      <Button title="Entrar" onPress={handleLogin} />
      
      {/* Navegação via Link */}
      <Link href="/(auth)/register">Criar uma conta</Link>
    </View>
  );
}