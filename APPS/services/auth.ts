import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { apiRequest } from "./api";

export type User = {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  bio: string | null;
};

async function setToken(token: string) {
  if (Platform.OS === "web") {
    localStorage.setItem("token", token);
  } else {
    await SecureStore.setItemAsync("token", token);
  }
}

async function removeToken() {
  if (Platform.OS === "web") {
    localStorage.removeItem("token");
  } else {
    await SecureStore.deleteItemAsync("token");
  }
}

export async function getToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    return localStorage.getItem("token");
  }
  return SecureStore.getItemAsync("token");
}

export async function login(
  username: string,
  password: string
): Promise<{ token: string; user: User }> {
  const res = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "登录失败");
  await setToken(data.token);
  return data;
}

export async function register(
  username: string,
  email: string,
  password: string
): Promise<void> {
  const res = await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "注册失败");
}

export async function logout(): Promise<void> {
  try {
    await apiRequest("/auth/logout", { method: "POST" });
  } catch {}
  await removeToken();
}
