import {useMutation, useQueryClient} from "@tanstack/react-query";
import {api} from "@/lib/utils/api";
import {useRouter} from "next/navigation";
import {useAuthStore} from "@/store/useAuthStore";
import {message} from "antd";
import Cookies from "js-cookie";
import {User} from "@/interfaces/auth";

/** 로그인 Hook */
export function useUser() {
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (loginData: { loginId: string; password: string }) => {
      const {data} = await api.post("/user/sign-in", loginData);
      if (data?.code !== 200 || !data?.data?.accessToken || !data?.data?.refreshToken) {
        throw new Error("로그인 실패: 응답 데이터 오류");
      }

      const userData: User = {
        loginId: data.data.subject,
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      };

      return userData;
    },
    onSuccess: async (userData) => {
      Cookies.set("token", userData.accessToken, {path: "/"});
      Cookies.set("refreshToken", userData.refreshToken, {path: "/"});

      const {data: memberData} = await api.get(`/member/${userData.loginId} `);
      if (memberData?.data) {
        userData = {
          ...userData,
          ...memberData.data
        };
      }
      setUser(userData);

      message.success("로그인 성공! 🎉");
      queryClient.invalidateQueries({queryKey: ["fetchMemberSummary", userData.loginId]});
      router.push("/");
    },
    onError: () => {
      message.error("로그인 실패. 다시 시도하세요.");
    },
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
      router.push("/login");
    },
    onError: () => {
      message.error("로그아웃 실패. 다시 시도하세요.");
    },
  });
}

/** 회원가입 Hook  */
interface SignUpData {
  loginId: string;
  email: string;
  name: string;
  password: string;
}
export function useSignUp() {
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  return useMutation({
    mutationFn: async (signUpData: SignUpData) => {
      const { data } = await api.post("/user/sign-up", signUpData);
      if (data?.code !== 201) {
        throw new Error("회원가입 실패: 응답 데이터 오류");
      }
      return signUpData;
    },
    onSuccess: async (signUpData) => {
      message.success("회원가입 성공! 자동 로그인 중...");

      try {
        const { data } = await api.post("/user/sign-in", {
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

        Cookies.set("token", userData.accessToken, { path: "/" });
        Cookies.set("refreshToken", userData.refreshToken, { path: "/" });

        const {data: memberData} = await api.get(`/member/${userData.loginId} `);
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
    onError: (error) => {
      console.error("회원가입 또는 자동 로그인 실패:", error);
      message.error(error.message || "회원가입 실패. 다시 시도하세요.");
    },
  });
}

/** Token 재발급 Hook */
export function useRefreshToken() {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!user?.loginId) throw new Error("❌ 로그인 정보 없음, 다시 로그인 필요!");
      const oldRefreshToken = Cookies.get("refreshToken");

      // Access Token 재발급 API 요청
      const { data } = await api.post("/user/reissue", {
        loginId: user.loginId,
        refreshToken: oldRefreshToken, // 기존 Refresh Token 사용
        provider: user.provider,
      });

      if (!data?.data?.accessToken || !data?.data?.refreshToken) {
        throw new Error("토큰 갱신 실패: 응답 데이터 오류");
      }

      return {
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      };
    },
    onSuccess: async ({ accessToken, refreshToken }) => {
      Cookies.set("token", accessToken, { path: "/", secure: true, sameSite: "Strict" });
      Cookies.set("refreshToken", refreshToken, { path: "/", secure: true, sameSite: "Strict" });

      // 사용자 정보 업데이트
      const loginId = user?.loginId;
      if (loginId) {
        const { data: memberData } = await api.get(`/member/${loginId} `);
        if (memberData?.data) {
          setUser({ ...user, ...memberData.data });
        }
      }

      // React Query 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["fetchMemberSummary", loginId] });
      console.log("✅ Access & Refresh Token 갱신 완료:", accessToken, refreshToken);
    },
    onError: () => {
      console.error("❌ Access Token 갱신 실패");
      message.error("세션이 만료되었습니다. 다시 로그인하세요.");
      Cookies.remove("token");
      Cookies.remove("refreshToken");
      useAuthStore.getState().logout();
      window.location.href = "/login";
    },
  });
}
