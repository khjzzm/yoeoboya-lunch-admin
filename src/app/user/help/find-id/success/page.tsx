import { Suspense } from "react";

import FindIdSuccessPage from "@/app/user/help/find-id/success/FindIdSuccessPage";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", fontSize: "20px" }}>불러오는 중...</div>}>
      <FindIdSuccessPage />
    </Suspense>
  );
}
