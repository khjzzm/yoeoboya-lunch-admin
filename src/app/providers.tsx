"use client"; // 클라이언트 컴포넌트 설정

import React from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {useAutoRefreshToken} from "@/lib/hook/useAutoRefreshToken";

const queryClient = new QueryClient(); //  QueryClient 인스턴스 생성

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
  useAutoRefreshToken(); // 토큰 자동 갱신 실행 (이제 React Query Provider 내부에서 실행됨)
  return <>{children}</>;
}
