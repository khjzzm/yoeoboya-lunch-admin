import {useMutation, useQueryClient} from "@tanstack/react-query";
import {api} from "@/lib/utils/api";
import {useRouter} from "next/navigation";
import {useAuthStore} from "@/store/useAuthStore";
import {message, notification} from "antd";
import Cookies from "js-cookie";
import {ChangePasswordData, SignUpData, SocialSignUpQueryParams} from "@/interfaces/auth";

/** 로그인 Hook */
export function useLogin() {
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (loginData: { loginId: string; password: string }) => {
      const {data} = await api.post("/user/sign-in", loginData);
      if (data?.code !== 200 || !data?.data?.accessToken || !data?.data?.refreshToken) {
        throw new Error("로그인 실패: 응답 데이터 오류");
      }

      return {
        loginId: data.data.subject,
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      };
    },
    onSuccess: async (loginData) => {
      Cookies.set("token", loginData.accessToken, {path: "/"});
      Cookies.set("refreshToken", loginData.refreshToken, {path: "/"});

      const {data: memberData} = await api.get(`/me`);
      if (memberData?.data) {
        loginData = {
          ...memberData.data
        };
      }
      setUser(loginData);

      message.success("로그인 성공! 🎉");
      queryClient.invalidateQueries({queryKey: ["fetchMemberSummary", loginData.loginId]});
      router.push("/");
    }
  });
}

/** 로그아웃 Hook */
export function useLogout() {
  const {logout} = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const token = Cookies.get("token");
      const refreshToken = Cookies.get("refreshToken");

      if (!token || !refreshToken) {
        throw new Error("로그아웃 실패: 토큰이 없습니다.");
      }

      await api.post("/user/sign-out", {
        accessToken: token,
        refreshToken: refreshToken,
      });
    },
    onSuccess: () => {
      Cookies.remove("token");
      Cookies.remove("refreshToken");

      logout();
      message.success("로그아웃 되었습니다.");
      router.push("/user/login");
    }
  });
}

/** 회원가입 Hook  */
export function useSignUp() {
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  return useMutation({
    mutationFn: async (signUpData: SignUpData) => {
      const {data} = await api.post("/user/sign-up", signUpData);
      if (data?.code !== 201) {
        throw new Error("회원가입 실패: 응답 데이터 오류");
      }
      return signUpData;
    },
    onSuccess: async (signUpData) => {
      message.success("회원가입 성공! 자동 로그인 중...");

      try {
        const {data} = await api.post("/user/sign-in", {
          loginId: signUpData.loginId,
          password: signUpData.password,
        });

        if (!data?.data?.accessToken || !data?.data?.refreshToken) {
          throw new Error("자동 로그인 실패: 응답 오류");
        }

        let userData = {
          loginId: data.data.subject,
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
        };

        Cookies.set("token", userData.accessToken, {path: "/"});
        Cookies.set("refreshToken", userData.refreshToken, {path: "/"});

        const {data: memberData} = await api.get(`/me`);
        if (memberData?.data) {
          userData = {
            ...userData,
            ...memberData.data
          };
        }

        setUser(userData);

        message.success("자동 로그인 완료! 🎉");
        router.push("/");
      } catch (error) {
        console.error("자동 로그인 중 오류 발생:", error);
        throw new Error("자동 로그인 실패. 다시 로그인하세요.");
      }
    },
  });
}

/** 소셜 회원가입 Hook */
export function useSocialSignUp() {
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (signUpData: SocialSignUpQueryParams) => {
      const {data} = await api.post("/user/social/sign-up", signUpData);

      if (!data?.data?.accessToken || !data?.data?.refreshToken) {
        throw new Error("소셜 회원가입 실패: 토큰 발급 실패");
      }

      return {
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      };
    },
    onSuccess: async ({accessToken, refreshToken}) => {
      message.success("회원가입 성공! 자동 로그인 중...");

      Cookies.set("token", accessToken, {path: "/"});
      Cookies.set("refreshToken", refreshToken, {path: "/"});

      try {
        const {data: memberData} = await api.get("/me");

        if (memberData?.data) {
          setUser(memberData.data);
          queryClient.invalidateQueries({queryKey: ["fetchMemberSummary", memberData.data.loginId]});
        }

        message.success("로그인 완료! 🎉");
        router.push("/");
      } catch (err) {
        console.error("🙅 사용자 정보 조회 실패:", err);
        message.error("로그인 후 사용자 정보를 불러오지 못했습니다.");
      }
    },
    onError: (error: unknown) => {
      message.error("소셜 회원가입 실패: " + (error as Error).message);
    }
  });
}

/** 비밀번호 변경 API Hook */
export function useChangePassword() {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  return useMutation({
    mutationFn: async (passwordData: ChangePasswordData) => {
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
        Cookies.remove("token");
        Cookies.remove("refreshToken");
        logout();
        router.push("/user/login");
      }, 3000);
    }
  });
}
