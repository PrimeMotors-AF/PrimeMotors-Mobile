import   { jwtDecode } from "jwt-decode";

export const isTokenExpired = (): boolean => {
  const token = localStorage.getItem("token");
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    return (decoded?.exp ?? 0) < Date.now() / 1000;
  } catch {
    return true;
  }
};