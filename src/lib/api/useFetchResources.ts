import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {api} from "@/lib/utils/api";
import {message} from "antd";

export function useFetchResources() {
  return useQuery({
    queryKey: ["fetchResources"],
    queryFn: async () => {
      const {data} = await api.get("/resource");
      return data?.data ?? [];
    },
  });
}

export function useFetchTokenIgnoreUrls() {
  return useQuery({
    queryKey: ["fetchTokenIgnoreUrls"],
    queryFn: async () => {
      const {data} = await api.get("/resource/token-ignore-url");
      return data?.data ?? []; // ✅ 데이터가 없을 경우 빈 배열 반환
    },
  });
}

// ✅ 토큰 무시 URL 추가 및 수정
export function useUpdateTokenIgnoreUrl() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateData: { url: string; isIgnore: boolean }) => {
      const {data} = await api.post("/resource/token-ignore-url", updateData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["fetchTokenIgnoreUrls"]});
    },
  });
}


/**
 * ✅ 토큰 무시 URL 삭제 훅
 */
export function useDeleteTokenIgnoreUrl() {
  const queryClient = useQueryClient(); // ✅ 데이터 캐싱을 위한 QueryClient

  return useMutation({
    mutationFn: async (id: number) => {
      const {data} = await api.delete(`/resource/token-ignore-url/${id}`);
      if (data.code !== 200) throw new Error("삭제 실패");
      return data;
    },
    onSuccess: () => {
      message.success("✅ 삭제 완료!");
      queryClient.invalidateQueries({queryKey: ["fetchTokenIgnoreUrls"]}); // ✅ 데이터 다시 불러오기
    },
    onError: () => {
      message.error("🚨 삭제 중 오류 발생!");
    },
  });
}