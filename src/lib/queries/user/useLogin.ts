import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message, notification } from "antd";
import { useRouter } from "next/navigation";

import {
  ApiResponse,
  ChangePasswordRequest,
  ResetPasswordRequest,
  SignUpRequest,
  SocialSignUpRequest,
  WithdrawRequest,
} from "@/types";

import { api } from "@/lib/utils/api";

import { useAuthStore } from "@/store/useAuthStore";

// 로그인
export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (loginData: { loginId: string; password: string }) => {
      const { data } = await api.post("/user/sign-in", loginData);
      if (data?.code !== 200) {
        throw new Error("로그인 실패: 응답 코드 오류");
      }
      return { loginId: loginData.loginId };
    },
    onSuccess: async () => {
      try {
        await api.post("/user/reissue"); // 토큰 갱신
        const { data: memberData } = await api.get("/me"); // 유저 정보 가져오기

        if (memberData?.data) {
          useAuthStore.getState().setUser(memberData.data); // ✅ 전역 상태에 유저 정보 설정
          message.success("로그인 성공! 🎉");
          router.push("/");
        }
      } catch (error) {
        console.error("사용자 정보 세팅 실패", error);
        message.error("사용자 정보를 불러오지 못했습니다.");
      }
    },
    onError: (error: unknown) => {
      console.error("로그인 실패", error);
      message.error("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
    },
  });
}

// 회원가입
export function useSignUp() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (signUpData: SignUpRequest) => {
      const { data } = await api.post("/user/sign-up", signUpData);
      if (data?.code !== 201) {
        throw new Error("회원가입 실패: 응답 데이터 오류");
      }
      return signUpData;
    },
    onSuccess: async (signUpData) => {
      message.success("회원가입 성공! 자동 로그인 중...");

      try {
        // 로그인 요청
        await api.post("/user/sign-in", {
          loginId: signUpData.loginId,
          password: signUpData.password,
        });

        await api.post("/user/reissue");
        const { data: memberData } = await api.get("/me");
        if (memberData?.data) {
          setUser(memberData.data); // Zustand 유저 정보 설정
        }

        router.push("/");
        message.success("자동 로그인 완료! 🎉");
      } catch (error) {
        console.error("자동 로그인 중 오류 발생:", error);
        message.error("자동 로그인 실패. 다시 로그인해주세요.");
      }
    },
  });
}

// 소셜 회원가입
export function useSocialSignUp() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (signUpData: SocialSignUpRequest) => {
      const { data } = await api.post("/user/social/sign-up", signUpData);
      if (!data?.code || data.code !== 201) {
        throw new Error("소셜 회원가입 실패: 응답 오류");
      }
      return data;
    },
    onSuccess: async () => {
      message.success("회원가입 성공! 자동 로그인 중...");
      await queryClient.refetchQueries({ queryKey: ["refresh-trigger"] });
      router.push("/");
      message.success("로그인 성공! 🎉");
    },
    onError: (error: unknown) => {
      message.error("소셜 회원가입 실패: " + (error as Error).message);
    },
  });
}

// 로그아웃
export function useLogout() {
  const { logout } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await api.post("/user/sign-out"); // 서버에서 토큰 가져와 삭제
    },
    onSuccess: () => {
      message.success("로그아웃 되었습니다.");
    },
    onError: (err) => {
      console.error("로그아웃 실패", err);
      message.error("로그아웃에 실패했습니다.");
    },
    onSettled: () => {
      logout(); // Zustand 초기화
      router.push("/user/login");
    },
  });
}

// 비밀번호 변경
export function useChangePassword() {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  return useMutation({
    mutationFn: async (passwordData: ChangePasswordRequest) => {
      const { data } = await api.patch("/user/password", passwordData);
      if (data?.code !== 200) {
        throw new Error("비밀번호 변경 실패: 응답 데이터 오류");
      }
      return data;
    },
    onSuccess: () => {
      //  1. Notification 표시
      notification.warning({
        message: "비밀번호 변경 완료",
        description: "보안을 위해 3초 후 로그아웃됩니다.",
        duration: 5, // 3초 동안 표시
      });

      //  2. 3초 후 로그아웃 및 페이지 이동
      setTimeout(() => {
        logout();
        router.push("/user/login");
      }, 3000);
    },
  });
}

// 비밀번호 찾기 메일 전송
export const useSendResetPasswordMail = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (values: Omit<ResetPasswordRequest, "authorityPage">) => {
      await api.post("/user/sendResetPasswordMail", {
        ...values,
        authorityPage: "/user/help/password/confirm",
      });
    },
    onSuccess: () => {
      router.push("/user/help/password/success");
    },
  });
};

// 비밀번호 변경
export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (values: {
      loginId: string;
      email: string;
      passKey: string;
      newPassword: string;
      confirmNewPassword: string;
    }) => {
      const { loginId, email, passKey, newPassword, confirmNewPassword } = values;

      if (!email || !passKey || !loginId) {
        throw new Error("유효하지 않은 접근입니다.");
      }

      return await api.patch("/user/resetPassword", {
        loginId,
        email,
        passKey,
        newPassword,
        confirmNewPassword,
      });
    },
    onSuccess: () => {
      message.success("비밀번호가 성공적으로 변경되었습니다.").then(() => {
        router.push("/login");
      });
    },
    onError: () => {
      message.error("링크가 만료되었거나 유효하지 않습니다.");
    },
  });
};

// 아이디 찾기
export const useFindLoginId = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (values: { email: string }) => {
      const { data } = await api.get<ApiResponse<string>>("/user/findLoginId", {
        params: values,
      });
      return data.data;
    },
    onSuccess: (loginId: string) => {
      router.push(`/user/help/find-id/success?loginId=${loginId}`);
    },
  });
};

// 회원 탈퇴
export function useWithdraw() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: async (payload: WithdrawRequest) => {
      const { data } = await api.delete("/user/leave-id", {
        data: payload, // DELETE with body
        headers: {
          "Content-Type": "application/json",
        },
      });
      return data;
    },
    onSuccess: () => {
      notification.success({
        message: "회원탈퇴 완료",
        description: "보안을 위해 3초 후 로그인 페이지로 이동됩니다.",
        duration: 5, // 3초 동안 표시
      });

      setTimeout(() => {
        logout();
        router.push("/user/login");
      }, 3000);
    },
    onError: () => {
      message.error("회원 탈퇴에 실패했습니다. 다시 시도해주세요.");
    },
  });
}
