import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

import {
  ApiResponse,
  ReplyCreateRequest,
  Pagination,
  Reply,
  CategoryCreateRequest,
  CategoryEditRequest,
} from "@/types";
import { Category } from "@/types/board/Category";

import { api } from "@/lib/utils/api";
import { apiErrorMessage } from "@/lib/utils/apiErrorMessage";

export function useCreateReply(endpoint: string, queryKeyPrefix: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ReplyCreateRequest) => {
      const { data } = await api.post(`${endpoint}/reply`, payload);
      return data;
    },
    onSuccess: (_, variables) => {
      message.success("댓글이 등록되었습니다.");
      queryClient.invalidateQueries({ queryKey: [`${queryKeyPrefix}Replies`, variables.boardNo] });
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}

export function useDeleteReply(endpoint: string, queryKeyPrefix: string, boardId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (replyId: number) => {
      const { data } = await api.delete(`${endpoint}/reply`, {
        params: { replyId },
      });
      return data;
    },
    onSuccess: () => {
      message.success("댓글이 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: [`${queryKeyPrefix}Replies`, boardId] });
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}

export function useReplies(endpoint: string, queryKeyPrefix: string, boardId: number) {
  return useQuery<ApiResponse<{ list: Reply[]; pagination: Pagination }>>({
    queryKey: [`${queryKeyPrefix}Replies`, boardId],
    queryFn: async () => {
      const { data } = await api.get(`${endpoint}/replies`, {
        params: { boardId },
      });
      return data;
    },
    enabled: !!boardId,
  });
}

export function useLike(endpoint: string, queryKeyPrefix: string, boardId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`${endpoint}/like`, null, {
        params: { boardId },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${queryKeyPrefix}Detail`, boardId] });
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}

export function useUnlike(endpoint: string, queryKeyPrefix: string, boardId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete(`${endpoint}/unlike`, {
        params: { boardId },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${queryKeyPrefix}Detail`, boardId] });
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}

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

export function useUploadFileToS3(endpoint: string) {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await api.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data.data.imageUrl;
    },
    onError: (err) => {
      console.error("❌ 업로드 실패:", err);
      apiErrorMessage(err);
    },
    onSuccess: () => {
      message.success("이미지 업로드 성공");
    },
  });
}
