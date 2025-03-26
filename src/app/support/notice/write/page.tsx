import { Suspense } from "react";
import NoticeWritePage from "@/app/support/notice/NoticeWritePage";

export default function Page() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <NoticeWritePage />
    </Suspense>
  );
}