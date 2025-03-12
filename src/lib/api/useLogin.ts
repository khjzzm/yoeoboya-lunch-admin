import {useMutation, useQueryClient} from "@tanstack/react-query";
import {api} from "@/lib/utils/api";
import {useRouter} from "next/navigation";
import {useAuthStore} from "@/store/useAuthStore";
import {message} from "antd";
import Cookies from "js-cookie";
import {User} from "@/interfaces/auth";

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

      const {data: memberData} = await api.get(`/member/${userData.loginId}/summary`);
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