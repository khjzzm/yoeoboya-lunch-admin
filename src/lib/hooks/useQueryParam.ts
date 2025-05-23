import { useSearchParams } from "next/navigation";

export function useQueryParamString(key: string): string | null {
  return useSearchParams().get(key);
}

export function useQueryParamNumber(key: string): number {
  const value = useSearchParams().get(key);
  return Number(value);
}

export const useClientQueryParams = () => {
  const params = useSearchParams();

  const get = (key: string): string | null => params.get(key);
  const getNumber = (key: string): number | null => {
    const value = params.get(key);
    return value ? Number(value) : null;
  };

  return {
    get,
    getNumber,
    boardNo: getNumber("id"),
    page: getNumber("page") ?? 1,
    tab: get("tab"),
  };
};
