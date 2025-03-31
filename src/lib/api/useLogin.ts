import {useMutation, useQueryClient} from "@tanstack/react-query";
import {api} from "@/lib/utils/api";
import {useRouter} from "next/navigation";
import {useAuthStore} from "@/store/useAuthStore";
import {message, notification} from "antd";
import {ChangePasswordRequest, SignUpRequest, SocialSignUpRequest} from "@/types";

/** 로그인 Hook */
export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (loginData: { loginId: string; password: string }) => {
      const {data} = await api.post("/user/sign-in", loginData);
      if (data?.code !== 200) {
        throw new Error("로그인 실패: 응답 코드 오류");
      }
      console.log(data)
      return {loginId: loginData.loginId};
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({queryKey: ["refresh-trigger"]});
      router.push("/");
      message.success("로그인 성공! 🎉");
    },
    onError: (error: unknown) => {
      console.error("로그인 실패", error);
      message.error("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
    },
  });
}

/** 회원가입 Hook  */
export function useSignUp() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (signUpData: SignUpRequest) => {
      const {data} = await api.post("/user/sign-up", signUpData);
      if (data?.code !== 201) {
        throw new Error("회원가입 실패: 응답 데이터 오류");
      }
      return signUpData;
    },
    onSuccess: async (signUpData) => {
      message.success("회원가입 성공! 자동 로그인 중...");

      try {
        await api.post("/user/sign-in", {
          loginId: signUpData.loginId,
          password: signUpData.password,
        });

        queryClient.invalidateQueries({queryKey: ["refreshToken"]}).then(() => {
          router.push("/");
          message.success("자동 로그인 완료! 🎉");
        });
      } catch (error) {
        console.error("자동 로그인 중 오류 발생:", error);
        throw new Error("자동 로그인 실패. 다시 로그인하세요.");
      }
    },
  });
}

/** 소셜 회원가입 Hook */
export function useSocialSignUp() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (signUpData: SocialSignUpRequest) => {
      const {data} = await api.post("/user/social/sign-up", signUpData);
      if (!data?.code || data.code !== 201) {
        throw new Error("소셜 회원가입 실패: 응답 오류");
      }
      return data;
    },
    onSuccess: async () => {
      message.success("회원가입 성공! 자동 로그인 중...");
      await queryClient.refetchQueries({queryKey: ["refresh-trigger"]});
      router.push("/");
      message.success("로그인 성공! 🎉");
    },
    onError: (error: unknown) => {
      message.error("소셜 회원가입 실패: " + (error as Error).message);
    }
  });
}

/** 로그아웃 Hook */
export function useLogout() {
  const {logout} = useAuthStore();
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
    onSettled: () =>{
      logout(); // Zustand 초기화
      router.push("/user/login");
    }
  });
}

/** 비밀번호 변경 API Hook */
export function useChangePassword() {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  return useMutation({
    mutationFn: async (passwordData: ChangePasswordRequest) => {
      const {data} = await api.patch("/user/password", passwordData);
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
    }
  });
}
