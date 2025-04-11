import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useInvalidRedirect = (condition: boolean, redirectTo = "/") => {
  const router = useRouter();

  useEffect(() => {
    if (condition) {
      router.replace(redirectTo);
    }
  }, [condition, redirectTo, router]);
};
