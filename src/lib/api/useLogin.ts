import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/utils/api";
import { useRouter } from "next/navigation";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (loginData: { loginId: string; password: string }) => {
      const { data } = await api.post("/user/sign-in", loginData);

      if (data?.code !== 200 || !data?.data?.accessToken || !data?.data?.refreshToken) {
        throw new Error("로그인 실패");
      }

      return data.data;
    },
    onSuccess: (userData) => {
      if (!userData || !userData.accessToken || !userData.refreshToken) {
        alert("로그인 실패: 올바른 응답이 아닙니다.");
        return;
      }

      document.cookie = `token=${userData.accessToken}; path=/;`;
      document.cookie = `refreshToken=${userData.refreshToken}; path=/;`;

      localStorage.setItem("accessToken", userData.accessToken);
      localStorage.setItem("refreshToken", userData.refreshToken);

      router.push("/"); // 로그인 후 대시보드 이동
    },
    onError: () => {
      alert("로그인 실패. 다시 시도하세요.");
    },
  });
}

export function useLogout() {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = document.cookie.split("; ").find((row) => row.startsWith("refreshToken="))?.split("=")[1];
      const accessToken = document.cookie.split("; ").find((row) => row.startsWith("token="))?.split("=")[1];

      console.log(accessToken)
      console.log(refreshToken)

      if (!accessToken || !refreshToken) {
        throw new Error("로그아웃 실패: 토큰이 없습니다.");
      }

      await api.post("/user/sign-out", {
        accessToken,
        refreshToken,
      });

      return;
    },
    onSuccess: () => {
      // ✅ 로컬스토리지 및 쿠키에서 토큰 제거
      localStorage.removeItem("token");

      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

      router.push("/login"); // ✅ 로그아웃 후 로그인 페이지로 이동
    },
    onError: () => {
      alert("로그아웃 실패. 다시 시도하세요.");
    },
  });
}