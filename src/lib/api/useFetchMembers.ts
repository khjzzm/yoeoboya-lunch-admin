import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/utils/api";

export function useFetchMembers() {
  return useQuery({
    queryKey: ["fetchMembers"],
    queryFn: async () => {
      const { data } = await api.get(`/member?page=1&size=10`);
      return data;
    },
  });
}