import {Suspense} from "react";
import FreeViewPage from "@/app/board/free/view/FreeViewPage";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", fontSize: "20px" }}>불러오는 중...</div>}>
      <FreeViewPage/>
    </Suspense>
  );
}