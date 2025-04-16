import {
  InfiniteData,
  QueryObserverResult,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { message } from "antd";
import { useCallback, useEffect, useState } from "react";

import {
  AnonymousBoardCreate,
  AnonymousBoardDelete,
  AnonymousBoardReport,
  AnonymousBoardResponse,
  AnonymousBoardUpdate,
  ApiResponse,
  SlicePagination,
} from "@/types";

import { api } from "@/lib/utils/api";
import { apiErrorMessage } from "@/lib/utils/apiErrorMessage";
import { getOrCreateAnonymousUUID } from "@/lib/utils/uuid";

// 익명 게시글 무한 스크롤
export function useInfiniteAnonymousBoards(pageSize: number) {
  const uuid = getOrCreateAnonymousUUID();

  return useInfiniteQuery({
    queryKey: ["anonymousBoards"],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams();
      params.set("page", String(pageParam));
      params.set("size", String(pageSize));

      const { data } = await api.get<
        ApiResponse<{ list: AnonymousBoardResponse[]; pagination: SlicePagination }>
      >(`/board/anonymous?${params.toString()}`, {
        headers: {
          "X-Anonymous-UUID": uuid,
        },
      });

      return {
        list: data.data.list,
        nextPage: data.data.pagination.page + 1,
        isLast: data.data.pagination.last,
      };
    },
    getNextPageParam: (lastPage) => (lastPage.isLast ? undefined : lastPage.nextPage),
  });
}

interface AnonymousBoardPage {
  list: AnonymousBoardResponse[];
  nextPage: number;
  isLast: boolean;
}

export function useHandleAnonymousNewPostClick(
  refetch: () => Promise<QueryObserverResult<InfiniteData<AnonymousBoardPage>>>,
  clear: () => void,
) {
  const queryClient = useQueryClient();
  const { mutate } = useSyncLatestAnonymousPost();
  const uuid = getOrCreateAnonymousUUID();

  return useCallback(async () => {
    queryClient.setQueryData<InfiniteData<AnonymousBoardPage>>(["anonymousBoards"], (old) => {
      if (!old) return;
      return {
        ...old,
        pages: [old.pages[0]],
        pageParams: [1],
      };
    });

    await refetch();
    mutate(uuid);
    clear();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [queryClient, refetch, clear, mutate, uuid]);
}

// 최신글 감지
export function useDetectNewAnonymousPost(clientUUID: string) {
  const [hasNewPost, setHasNewPost] = useState(false);

  useEffect(() => {
    if (hasNewPost) return;

    const interval = setInterval(async () => {
      try {
        const { data } = await api.get<ApiResponse<boolean>>("/board/anonymous/has-new-detect", {
          headers: {
            "X-Anonymous-UUID": clientUUID,
          },
        });

        if (data.data) {
          setHasNewPost(true);
        }
      } catch (err) {
        console.error("🔍 새 글 확인 실패", err);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [hasNewPost, clientUUID]);

  const clear = () => setHasNewPost(false);
  return { hasNewPost, clear };
}

// 최신글 redis value 업데이트
export function useSyncLatestAnonymousPost() {
  return useMutation({
    mutationFn: async (clientUUID: string) => {
      await api.post("/board/anonymous/latest-sync", null, {
        headers: {
          "X-Anonymous-UUID": clientUUID,
        },
      });
    },
    onError: () => {
      message.error("최신 글 동기화에 실패했어요.");
    },
  });
}

export function useResetAnonymousBoardToFirstPage() {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.setQueryData<InfiniteData<AnonymousBoardPage>>(["anonymousBoards"], (old) => {
      if (!old) return;

      return {
        ...old,
        pages: [old.pages[0]], // 첫 페이지만 유지
        pageParams: [1], // 페이지 번호도 초기화
      };
    });
  }, [queryClient]);
}

export function useCreateAnonymousBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AnonymousBoardCreate) => {
      const { data } = await api.post(`/board/anonymous`, payload);
      return data.data as AnonymousBoardResponse;
    },
    onSuccess: (newPost) => {
      message.success("게시글이 등록되었습니다.");

      queryClient.setQueryData<InfiniteData<AnonymousBoardPage>>(["anonymousBoards"], (old) => {
        if (!old) return;
        const updatedFirstPage: AnonymousBoardPage = {
          ...old.pages[0],
          list: [newPost, ...old.pages[0].list.slice(0, 9)],
        };
        return {
          ...old,
          pages: [updatedFirstPage],
          pageParams: [1],
        };
      });

      queryClient.invalidateQueries({ queryKey: ["anonymousBoards"] });
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}

// 익명 게시글 수정
export function useUpdateAnonymousBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: AnonymousBoardUpdate) => {
      const { data } = await api.put(`/board/anonymous`, payload);
      return data;
    },
    onSuccess: () => {
      message.success("게시글이 수정되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["anonymousBoards"] });
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}

// 익명 게시글 삭제
export function useDeleteAnonymousBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AnonymousBoardDelete) => {
      const { data } = await api.delete(`/board/anonymous`, { data: payload });
      return { ...payload, response: data };
    },
    onSuccess: (deleted) => {
      const deletedId = deleted.boardId;
      message.success("게시글이 삭제되었습니다.");

      queryClient.setQueryData<InfiniteData<AnonymousBoardPage>>(["anonymousBoards"], (oldData) => {
        if (!oldData) return oldData;

        const updatedPages = oldData.pages.map((page) => ({
          ...page,
          list: page.list.filter((post) => post.boardId !== deletedId),
        }));

        return {
          ...oldData,
          pages: updatedPages,
        };
      });
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}

// 익명 게시글 신고
export function useReportAnonymousBoard() {
  return useMutation({
    mutationFn: async (payload: AnonymousBoardReport) => {
      const { data } = await api.post(`/board/anonymous/report`, payload);
      return data;
    },
    onSuccess: () => {
      message.success("게시글이 신고되었습니다.");
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}
