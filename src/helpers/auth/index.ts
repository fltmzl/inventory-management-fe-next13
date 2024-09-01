import { api } from "@/utils/axios";
import { setCookie, getCookie } from "cookies-next";

const TOKEN_KEY_NAME = "access_token";

export const getAccessToken = () => {
  // const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY_NAME) : null;
  const token = getCookie(TOKEN_KEY_NAME);
  console.log({ token });
  return token;
};

export const setAccessToken = (token: string) => {
  // localStorage.setItem(TOKEN_KEY_NAME, token);
  setCookie(TOKEN_KEY_NAME, token);
};

export const getUserFromToken = (): User | null => {
  const token = getAccessToken();
  if (!token) return null;

  const payload = token.split(".")[1];

  return JSON.parse(atob(payload));
};

export const getProfile = async (): Promise<User | null> => {
  try {
    const res = await api.get("/auth/profile");
    return res.data;
  } catch (error) {
    return null;
  }
};
