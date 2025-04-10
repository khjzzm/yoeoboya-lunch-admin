import { useMutation, useQuery } from "@tanstack/react-query";
import { message } from "antd";

import { AccessIpRequest, AccessIpResponse, ApiResponse } from "@/types";

import { api } from "@/lib/utils/api";
import { apiErrorMessage } from "@/lib/utils/apiErrorMessage";

// 등록된 아이피 정보 가져오기
export const useAccessIpList = () => {
  return useQuery<AccessIpResponse[]>({
    queryKey: ["accessIpList"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<AccessIpResponse[]>>("/access-ip");
      return data.data;
    },
  });
};

// 아이피 정보 등록
export const useCreateAccessIp = (onSuccess?: () => void) =>
  useMutation({
    mutationFn: (payload: AccessIpRequest) => api.post("/access-ip", payload),
    onSuccess: () => {
      message.success("생성 완료");
      onSuccess?.();
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });

// 아이피 정보 업데이트
export const useUpdateAccessIp = (onSuccess?: () => void) =>
  useMutation({
    mutationFn: (params: { id: number; data: AccessIpRequest }) =>
      api.put<ApiResponse<AccessIpResponse>>(`/access-ip?id=${params.id}`, params.data),
    onSuccess: () => {
      message.success("생성 완료");
      onSuccess?.();
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });

// 아이피 저옵 삭제
export const useDeleteAccessIp = (onSuccess?: () => void) =>
  useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/access-ip?id=${id}`);
    },
    onSuccess: () => {
      message.success("생성 완료");
      onSuccess?.();
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
