import { Suspense } from "react";

import LoginPage from "@/app/user/login/LoginPage";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", fontSize: "20px" }}>불러오는 중...</div>}>
      <LoginPage />
    </Suspense>
  );
}
