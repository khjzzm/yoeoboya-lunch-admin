import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {api} from "@/lib/utils/api";
import {message} from "antd";
import {apiErrorMessage} from "@/lib/utils/apiErrorMessage";

/** 권한 정보 조회 Hook */
export function useRole(page: number, pageSize: number, filters?: Record<string, string | string[]>) {
  return useQuery({
    queryKey: ["fetchRole", page, pageSize, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        size: String(pageSize),
        ...(filters || {}),
      });

      const {data} = await api.get(`/role/authorities?${params.toString()}`);
      return data
    },
  });
}

/** 권한 정보 수정 Hook */
export function useUpdateSecurityStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateData: { loginId: string; enabled: boolean; accountNonLocked: boolean }) => {
      const {data} = await api.post(`/role/security`, updateData);
      return data;
    },
    onSuccess: () => {
      message.success("권한 정보가 성공적으로 변경되었습니다.");
      queryClient.invalidateQueries({queryKey: ["fetchRole"]});
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}

/** 역할 정보 수정 Hook */
export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateData: { loginId: string; role: string }) => {
      const {data} = await api.post(`/role/authority`, updateData);
      return data;
    },
    onSuccess: () => {
      message.success("역할이 성공적으로 변경되었습니다.");
      queryClient.invalidateQueries({queryKey: ["fetchRole"]});
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}
