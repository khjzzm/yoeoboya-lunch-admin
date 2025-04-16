import { Suspense } from "react";

import AnonymousBoard from "@/app/board/anonymous/AnonymousBoard";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", fontSize: "20px" }}>불러오는 중...</div>}>
      <AnonymousBoard />
    </Suspense>
  );
}
