import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";
import { AxiosError } from "axios";

import { refetchMyInfo } from "@/lib/hooks/useFetchMyInfo";
import { api } from "@/lib/utils/api";

// 내 정보 수정
export function useUpdateMyInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateData: { bio?: string; nickName?: string; phoneNumber?: string }) => {
      const { data } = await api.patch("/me", updateData);
      return data;
    },
    onSuccess: async () => {
      refetchMyInfo("내 정보가 수정되었습니다!");
      queryClient.invalidateQueries({ queryKey: ["fetchMyInfo"] });
    },
  });
}

// 계좌 등록
export function useRegisterAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (accountData: { bankName: string; accountNumber: string }) => {
      const { data } = await api.post("/account", accountData);
      return data;
    },
    onSuccess: () => {
      refetchMyInfo("계좌가 등록되었습니다");
      queryClient.invalidateQueries({ queryKey: ["fetchAccount"] });
    },
  });
}

// 계좌 수정
export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateData: { bankName: string; accountNumber: string }) => {
      const { data } = await api.patch("/account", updateData);
      return data;
    },
    onSuccess: async () => {
      refetchMyInfo("계좌 정보가 수정되었습니다");
      queryClient.invalidateQueries({ queryKey: ["fetchAccount"] });
    },
  });
}

// 대표 프로필 이미지 등록
export function useSetDefaultProfileImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageNo: number) => {
      const { data } = await api.post(`/profile-image/default/set?imageNo=${imageNo}`);
      return data;
    },
    onSuccess: async () => {
      refetchMyInfo("대표 사진이 수정되었습니다");
      queryClient.invalidateQueries({ queryKey: ["fetchProfileImages"] });
    },
  });
}

// 프로필 이미지 업로드
export function useUploadProfileImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await api.post("/profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: async () => {
      notification.success({
        message: "프로필 사진 업로드 완료",
        description: "새로운 프로필 사진이 업로드되었습니다.",
      });

      refetchMyInfo();
      queryClient.invalidateQueries({ queryKey: ["fetchProfileImages"] });
    },
    onError: (error: AxiosError<{ message?: string; detail?: string }>) => {
      const errorMessage = error.response?.data?.message || "프로필 사진 업로드 실패";
      const errorDetail =
        error.response?.data?.detail || "이미지를 업로드하는 중 오류가 발생했습니다.";

      notification.error({
        message: errorMessage,
        description: errorDetail,
      });
    },
  });
}

// 프로필 이미지 삭제
export function useDeleteProfileImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageNo: number) => {
      const { data } = await api.delete(`/profile-image`, {
        params: { imageNo },
      });
      return data;
    },
    onSuccess: async () => {
      refetchMyInfo("프로필 이미지가 삭제되었습니다");
      queryClient.invalidateQueries({ queryKey: ["fetchProfileImages"] });
    },
    onError: (error: AxiosError<{ message?: string; detail?: string }>) => {
      const errorDescription = error.response?.data?.message || "프로필 사진 삭제 실패";

      notification.error({
        message: "이미지를 삭제하는 중 오류가 발생했습니다.",
        description: errorDescription,
      });
    },
  });
}
