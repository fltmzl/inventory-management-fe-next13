import { api } from "@/utils/axios";

export const fetcher = async (url: string) => {
  const res = await api.get(url);
  return res.data;
};
