import AsyncStorage from "@react-native-async-storage/async-storage";

import type { User } from "../types/auth";

const USER_KEY = "user_data";
const TOKEN_KEY = "token";

export const authStorage = {
  saveUser: async (user: User) => {
    try {
      await AsyncStorage.setItem(
        USER_KEY,
        JSON.stringify(user),
      );
    } catch (error) {
      console.error(
        "Erro ao salvar usuário:",
        error,
      );
    }
  },

  getUser: async (): Promise<User | null> => {
    try {
      const data = await AsyncStorage.getItem(USER_KEY);

      if (!data || data === "undefined") {
        return null;
      }

      return JSON.parse(data) as User;
    } catch (error) {
      console.error(
        "Erro ao recuperar usuário:",
        error,
      );

      return null;
    }
  },

  removeUser: async () => {
    try {
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error(
        "Erro ao remover usuário:",
        error,
      );
    }
  },

  saveToken: async (token: string) => {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },

  getToken: async (): Promise<string | null> => AsyncStorage.getItem(TOKEN_KEY),

  removeSession: async () => {
    await AsyncStorage.multiRemove([USER_KEY, TOKEN_KEY]);
  },
};
