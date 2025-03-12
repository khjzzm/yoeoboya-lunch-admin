import {useQuery} from "@tanstack/react-query";
import {api} from "@/lib/utils/api";

export function useFetchMembers() {
  return useQuery({
    queryKey: ["fetchMembers"],
    queryFn: async () => {
      const {data} = await api.get(`/member?page=1&size=10`);
      return data;
    },
  });
}

/** 특정 회원 요약 정보 조회 */
export function useFetchMemberSummary(memberLoginId: string) {
  return useQuery({
    queryKey: ["fetchMemberSummary", memberLoginId], // ✅ 캐시를 위한 키
    queryFn: async () => {
      const {data} = await api.get(`/member/${memberLoginId}/summary`);
      return data.data; //
    },
    enabled: !!memberLoginId,
    staleTime: 1000 * 60 * 5,
  });
}