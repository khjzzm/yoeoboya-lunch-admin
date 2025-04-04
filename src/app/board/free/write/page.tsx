import { Suspense } from "react";

import FreeWritePage from "@/app/board/free/write/FreeWritePage";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", fontSize: "20px" }}>불러오는 중...</div>}>
      <FreeWritePage />
    </Suspense>
  );
}
