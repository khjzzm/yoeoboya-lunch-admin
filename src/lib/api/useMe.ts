import {useMutation, useQueryClient} from "@tanstack/react-query";
import {api} from "@/lib/utils/api";
import {message, notification} from "antd";
import {useAuthStore} from "@/store/useAuthStore";


/** 내 정보 수정 Hook */
export function useUpdateMyInfo() {
  const queryClient = useQueryClient();
  const {user, setUser} = useAuthStore();

  return useMutation({
    mutationFn: async (updateData: { bio?: string; nickName?: string; phoneNumber?: string }) => {
      const {data} = await api.patch("/me", updateData);
      return data;
    },
    onSuccess: async () => {
      message.success("내 정보가 수정되었습니다!");
      try {
        const {data: memberData} = await api.get("/me");
        if (memberData?.data) {
          setUser({
            ...user,
            ...memberData.data,
          });
        }
      } catch (error) {
        console.error("사용자 정보 업데이트 실패", error);
      }
      queryClient.invalidateQueries({queryKey: ["fetchMyInfo"]});
    },
  });
}

/** 계좌 등록 Hook */
export function useRegisterAccount() {
  const queryClient = useQueryClient();
  const {user, setUser} = useAuthStore();

  return useMutation({
    mutationFn: async (accountData: { bankName: string; accountNumber: string }) => {
      const {data} = await api.post("/account", accountData);
      return data;
    },
    onSuccess: async () => {
      message.success("계좌가 등록되었습니다!");
      try {
        const {data: memberData} = await api.get("/me");
        if (memberData?.data) {
          setUser({
            ...user,
            ...memberData.data,
          });
        }
      } catch (error) {
        console.error("사용자 정보 업데이트 실패", error);
      }
      queryClient.invalidateQueries({queryKey: ["fetchAccount"]});
    },
  });
}

/** 계좌 수정 Hook */
export function useUpdateAccount() {
  const queryClient = useQueryClient();
  const {user, setUser} = useAuthStore();

  return useMutation({
    mutationFn: async (updateData: { bankName: string; accountNumber: string }) => {
      const {data} = await api.patch("/account", updateData);
      return data;
    },
    onSuccess: async () => {
      message.success("계좌 정보가 수정되었습니다!");
      try {
        const {data: memberData} = await api.get("/me");
        if (memberData?.data) {
          setUser({
            ...user,
            ...memberData.data,
          });
        }
      } catch (error) {
        console.error("사용자 정보 업데이트 실패", error);
      }
      queryClient.invalidateQueries({queryKey: ["fetchAccount"]});
    },
  });
}

/** 대표 프로필 이미지 등록 Hook */
export function useSetDefaultProfileImage() {
  const queryClient = useQueryClient();
  const {user, setUser} = useAuthStore(); // 사용자 정보 업데이트

  return useMutation({
    mutationFn: async (imageNo: number) => {
      const {data} = await api.post(`/profile-image/default/set?imageNo=${imageNo}`);
      return data;
    },
    onSuccess: async () => {
      message.success("대표 사진이 수정되었습니다!");
      try {
        const {data: memberData} = await api.get("/me");
        if (memberData?.data) {
          setUser({
            ...user,
            ...memberData.data,
          });
        }
      } catch (error) {
        console.error("사용자 정보 업데이트 실패", error);
      }
      queryClient.invalidateQueries({queryKey: ["fetchProfileImages"]});
    },
  });
}

/** 프로필 이미지 업로드 Hook */
export function useUploadProfileImage() {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore(); // 사용자 정보 업데이트

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await api.post("/profile-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data;
    },
    onSuccess: async () => {
      notification.success({
        message: "프로필 사진 업로드 완료",
        description: "새로운 프로필 사진이 업로드되었습니다.",
      });

      // 최신 사용자 정보 가져와서 `user` 업데이트
      try {
        const { data: memberData } = await api.get("/me");
        if (memberData?.data) {
          setUser({
            ...user,
            ...memberData.data,
          });
        }
      } catch (error) {
        console.error("사용자 정보 업데이트 실패", error);
      }

      queryClient.invalidateQueries({ queryKey: ["fetchProfileImages"] });
    },
    onError: () => {
      notification.error({
        message: "프로필 사진 업로드 실패",
        description: "이미지를 업로드하는 중 오류가 발생했습니다.",
      });
    },
  });
}