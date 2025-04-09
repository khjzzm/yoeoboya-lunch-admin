// hooks/usePaginationQuerySync.ts
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function usePaginationQuerySync() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") || "1");
  const pageSize = Number(searchParams.get("size") || "20");

  const setPagination = (newPage: number, newSize?: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    if (newSize) params.set("size", String(newSize));
    router.push(`${pathname}?${params.toString()}`);
  };

  return { page, pageSize, setPagination };
}
