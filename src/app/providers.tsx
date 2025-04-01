"use client";

import React from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {useAutoRefreshToken} from "@/lib/hooks/useAutoRefreshToken";
import {useAuthWatcher} from "@/lib/hooks/useAuthWatcher";

const queryClient = new QueryClient();

export default function Providers({children}: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}> {/*  React Query Provider 설정 */}
      <ReactQueryDevtools initialIsOpen={false}/> {/*  React Query DevTools (선택) */}
      <InnerProviders>{children}</InnerProviders> {/*  내부 Provider 적용 */}
    </QueryClientProvider>
  );
}

// 내부 Provider: useAutoRefreshToken 실행 (useMutation 내부에서 사용)
function InnerProviders({children}: { children: React.ReactNode }) {
  useAutoRefreshToken(); // 토큰 자동 갱신 실행
  useAuthWatcher(); // 토큰 만료시 실행
  return (
    <>
      {children}
    </>
  );
}
