import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/utils/api";
import { message } from "antd";

/** 권한 정보 조회 Hook */
export function useRole() {
  return useQuery({
    queryKey: ["fetchRole"],
    queryFn: async () => {
      const { data } = await api.get(`/role/authorities?page=1&size=60`);
      return data;
    },
  });
}

/** 권한 정보 수정 Hook */
export function useUpdateSecurityStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateData: { loginId: string; enabled: boolean; accountNonLocked: boolean }) => {
      const { data } = await api.post(`/role/security`, updateData);
      return data;
    },
    onSuccess: () => {
      message.success("권한 정보가 성공적으로 변경되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["fetchRole"] });
    },
    onError: () => {
      message.error("권한 정보 변경에 실패했습니다.");
    },
  });
}

/** 역할 정보 수정 Hook */
export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateData: { loginId: string; role: string }) => {
      const { data } = await api.post(`/role/authority`, updateData);
      return data;
    },
    onSuccess: () => {
      message.success("역할이 성공적으로 변경되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["fetchRole"] });
    },
    onError: () => {
      message.error("역할 변경에 실패했습니다.");
    },
  });
}
