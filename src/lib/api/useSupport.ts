import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {api} from "@/lib/utils/api";
import {message} from "antd";
import {apiErrorMessage} from "@/lib/utils/apiErrorMessage";
import {NoticeRequest, NoticeDetailResponse} from "@/types/support";
import stringify from "fast-json-stable-stringify";
import {useRouter} from "next/navigation";
import ApiResponse from "@/types/response";
import {Reply} from "@/types/reply";
import {Pagination} from "@/types/pagination";

/** 공지사항 목록 조회 (검색 시 호출용) */
export function useNotices(
  page: number,
  pageSize: number,
  filters?: Record<string, string | string[]>
) {
  return useQuery({
    queryKey: ["fetchNotices", page, pageSize, stringify(filters)],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("size", String(pageSize));

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v));
          } else {
            params.append(key, value);
          }
        });
      }

      const {data} = await api.get(`/support/notice?${params.toString()}`);
      return data;
    },
  });
}

/** 공지사항 등록 */
export function useCreateNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noticeData: NoticeRequest) => {
      const {data} = await api.post(`/support/notice`, noticeData);
      return data;
    },
    onSuccess: () => {
      message.success("공지사항이 등록되었습니다.");
      queryClient.invalidateQueries({queryKey: ["notices"]});
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

      const {data} = await api.post(`/support/notice/image`, formData, {
        headers: {"Content-Type": "multipart/form-data"},
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
    mutationFn: async ({noticeId, loginId}: { noticeId: number; loginId: string }) => {
      const {data} = await api.post(`/support/notice/read`, null, {
        params: {noticeId, loginId},
      });
      return data;
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}

/** 공지사항 상세 조회 */
export function useNoticeDetail(noticeId: number | null) {
  return useQuery<ApiResponse<NoticeDetailResponse>>({
    queryKey: ["noticeDetail", noticeId],
    queryFn: async () => {
      const {data} = await api.get(`/support/notice/detail`, {
        params: {noticeId},
      });
      return data;
    },
    enabled: !!noticeId && noticeId > 0,
  });
}

/** 공지사항 수정 Hook */
export function useUpdateNotice(noticeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedNotice: NoticeRequest) => {
      const {data} = await api.put(`/support/notice`, updatedNotice, {
        params: {noticeId},
      });
      return data;
    },
    onSuccess: () => {
      message.success("공지사항이 수정되었습니다.");
      queryClient.invalidateQueries({queryKey: ["notices"]});
      queryClient.invalidateQueries({queryKey: ["noticeDetail", noticeId]});
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}


/** 공지사항 삭제 Hook */
export function useDeleteNotice() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async (noticeId: number) => {
      const {data} = await api.delete(`/support/notice`, {
        params: {noticeId},
      });
      return data;
    },
    onSuccess: () => {
      message.success("공지사항이 삭제되었습니다.");
      queryClient.invalidateQueries({queryKey: ["notices"]});
      router.push("/support/notice")
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}

/** 댓글 작성 Hook */
export function useCreateReply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      boardId: number;
      loginId?: string;
      content: string;
      parentReplyId?: number | null;
    }) => {
      const {data} = await api.post(`/support/notice/reply`, payload);
      return data;
    },
    onSuccess: (_, variables) => {
      message.success("댓글이 등록되었습니다.");
      queryClient.invalidateQueries({queryKey: ["noticeReplies", variables.boardId]});
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}

/** 댓글 삭제 Hook */
export function useDeleteReply(noticeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (replyId: number) => {
      const {data} = await api.delete(`/support/notice/reply`, {
        params: {replyId},
      });
      return data;
    },
    onSuccess: () => {
      message.success("댓글이 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["noticeReplies", noticeId] });
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
};


/** 댓글 조회 Hook */
export function useNoticeReplies(noticeId: number) {
  return useQuery<ApiResponse<{ list: Reply[]; pagination: Pagination }>>({
    queryKey: ["noticeReplies", noticeId],
    queryFn: async () => {
      const {data} = await api.get(`/support/notice/replies`, {
        params: {boardId: noticeId},
      });
      return data;
    },
    enabled: !!noticeId,
  });
}

/** 공지사항 좋아요 Hook */
export function useLikeNotice(noticeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const {data} = await api.post(`/support/notice/like`, null, {
        params: {noticeId},
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["noticeDetail", noticeId]});
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}

/** 공지사항 좋아요 취소 Hook */
export function useUnlikeNotice(noticeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const {data} = await api.delete(`/support/notice/unlike`, {
        params: {noticeId},
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["noticeDetail", noticeId]});
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}