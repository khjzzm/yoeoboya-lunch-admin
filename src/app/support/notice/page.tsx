import { Suspense } from "react";

import NoticeListPage from "@/app/support/notice/NoticeListPage";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", fontSize: "20px" }}>불러오는 중...</div>}>
      <NoticeListPage />
    </Suspense>
  );
}
