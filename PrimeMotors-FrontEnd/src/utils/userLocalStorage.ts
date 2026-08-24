import type { User } from "../types/auth";

const USER_KEY = "user_data";

export const authStorage = {
  saveUser: (user: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  getUser: () => {
    const data = localStorage.getItem(USER_KEY);
    if (!data || data === "undefined") {
      return null;
    }
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Erro no JSON do LocalStorage:", error);
      return null;
    }
  },
  removeUser: () => {
    localStorage.removeItem(USER_KEY);
  }
};