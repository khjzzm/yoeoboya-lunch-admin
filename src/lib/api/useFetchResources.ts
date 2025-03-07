import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/utils/api";

export function useFetchResources() {
  return useQuery({
    queryKey: ["fetchResources"],
    queryFn: async () => {
      const { data } = await api.get("/resource");
      return data?.data ?? [];
    },
  });
}