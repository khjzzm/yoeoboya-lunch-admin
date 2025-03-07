import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>404 - 페이지를 찾을 수 없습니다.</h1>
      <p>요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
      <Link href="/">
        <button style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}>
          홈으로 이동
        </button>
      </Link>
    </div>
  );
}