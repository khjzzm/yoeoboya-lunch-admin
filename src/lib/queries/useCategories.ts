import { useMutation, useQuery } from "@tanstack/react-query";
import { message } from "antd";

import { ApiResponse, Category, CategoryCreateRequest, CategoryEditRequest } from "@/types";

import { api } from "@/lib/utils/api";

export function useCategories(boardType: string) {
  return useQuery({
    queryKey: ["categories", boardType],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Category[]>>("/board/categories", {
        params: { boardType },
      });
      return data.data;
    },
    enabled: !!boardType,
  });
}

export const useCreateCategory = (onSuccess?: () => void) =>
  useMutation({
    mutationFn: (payload: CategoryCreateRequest) => api.post("/board/categories", payload),
    onSuccess: () => {
      message.success("생성 완료");
      onSuccess?.();
    },
  });

export const useUpdateCategory = (onSuccess?: () => void) =>
  useMutation({
    mutationFn: (payload: CategoryEditRequest) =>
      api.put(`/board/categories`, payload, {
        params: { id: payload.id },
      }),
    onSuccess: () => {
      message.success("수정 완료");
      onSuccess?.();
    },
  });

export const useDeleteCategory = (onSuccess?: () => void) =>
  useMutation({
    mutationFn: (id: number) =>
      api.delete(`/board/categories`, {
        params: { id },
      }),
    onSuccess: () => {
      message.success("삭제 완료");
      onSuccess?.();
    },
  });
