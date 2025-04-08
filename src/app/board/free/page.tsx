import { Suspense } from "react";

import FreeListPage from "@/app/board/free/FreeListPage";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", fontSize: "20px" }}>불러오는 중...</div>}>
      <FreeListPage />
    </Suspense>
  );
}
