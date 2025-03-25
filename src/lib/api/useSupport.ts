import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/utils/api";
import { message } from "antd";
import { apiErrorMessage } from "@/lib/utils/apiErrorMessage";
import {NoticeRequest, NoticeResponse} from "@/types/support";

/** 공지사항 목록 조회 */
export function useNotices(loginId?: string) {
  return useQuery<NoticeResponse[]>({
    queryKey: ["notices", loginId],
    queryFn: async () => {
      const { data } = await api.get(`/support/notices`, {
        params: loginId ? { loginId } : undefined,
      });
      return data?.data ?? []; // 데이터가 없을 경우 빈 배열 반환
    },
  });
}

/** 공지사항 등록 */
export function useCreateNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noticeData: NoticeRequest) => {
      const { data } = await api.post(`/support/notices`, noticeData);
      return data;
    },
    onSuccess: () => {
      message.success("공지사항이 등록되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}

/** 공지사항 이미지 업로드 */
export function useUploadNoticeImage() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await api.post(`/support/notice/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return data;
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}

/** 공지사항 읽음 표시 */
export function useMarkNoticeAsRead() {
  return useMutation({
    mutationFn: async ({ noticeId, loginId }: { noticeId: number; loginId: string }) => {
      const { data } = await api.post(`/support/notice/read`, null, {
        params: { noticeId, loginId },
      });
      return data;
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}

/** 공지사항 상세 조회 */
export function useNoticeDetail(noticeId: number) {
  return useQuery<NoticeResponse>({
    queryKey: ["noticeDetail", noticeId],
    queryFn: async () => {
      const { data } = await api.get(`/support/notice/detail`, {
        params: { noticeId },
      });
      return data;
    },
    enabled: !!noticeId,
  });
}

/** 공지사항 수정 Hook */
export function useUpdateNotice(noticeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedNotice: NoticeRequest) => {
      const { data } = await api.put(`/support/notice/update`, updatedNotice, {
        params: { noticeId },
      });
      return data;
    },
    onSuccess: () => {
      message.success("공지사항이 수정되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      queryClient.invalidateQueries({ queryKey: ["noticeDetail", noticeId] });
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}


/** 공지사항 삭제 Hook */
export function useDeleteNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noticeId: number) => {
      const { data } = await api.delete(`/support/notice/delete`, {
        params: { noticeId },
      });
      return data;
    },
    onSuccess: () => {
      message.success("공지사항이 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}