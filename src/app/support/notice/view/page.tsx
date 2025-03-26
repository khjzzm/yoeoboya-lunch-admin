import { Suspense } from "react";
import NoticeViewPage from "@/app/support/notice/NoticeViewPage";

export default function Page() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <NoticeViewPage />
    </Suspense>
  );
}