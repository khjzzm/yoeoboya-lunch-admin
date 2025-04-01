import {useQuery} from "@tanstack/react-query";
import {api} from "@/lib/utils/api";
import {useAuthStore} from "@/store/useAuthStore";
import {message} from "antd";

export const MY_INFO_QUERY_KEY = ["auth", "myInfo"];

export function useFetchMyInfo() {
  const {setUser} = useAuthStore();

  return useQuery({
    queryKey: MY_INFO_QUERY_KEY,
    queryFn: async () => {
      const {data: memberData} = await api.get("/me");
      if (!memberData?.data) {
        throw new Error("사용자 정보를 불러올 수 없습니다.");
      }
      setUser(memberData.data);
      return memberData.data;
    },
    enabled: false, // 수동 실행
    refetchOnWindowFocus: false,
  });
}

/** 이건 mutation 안에서 쓸 용도 사용자 정보 재조회 사용자 정보 갱신 및 메시지 출력 유틸 */
export async function refetchMyInfo(successMessage?: string, errorMessage?: string) {
  if (successMessage) message.success(successMessage);

  const setUser = useAuthStore.getState().setUser;

  try {
    const {data: memberData} = await api.get("/me");
    if (memberData?.data) {
      setUser(memberData.data);
      return memberData.data;
    }
  } catch (error) {
    if (errorMessage) message.error(errorMessage);
    throw error;
  }
}