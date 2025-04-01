import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export function useAuthWatcher() {
  const router = useRouter();
  const isExpired = useAuthStore((state) => state.isExpired);
  const setExpired = useAuthStore((state) => state.setExpired);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (isExpired) {
      logout();
      setExpired(false);
      router.push("/user/login");
    }
  }, [isExpired, logout, setExpired, router]);
}