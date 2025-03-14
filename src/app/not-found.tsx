import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800" style={{ margin: "0px", padding: "0px", background: "#fff" }} >
      {/* 404 제목 */}
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl font-semibold mb-2">페이지를 찾을 수 없습니다.</p>
      <p className="text-gray-600 mb-6">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>

      {/* 홈으로 이동 버튼 */}
      <Link href="/">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium shadow-md hover:bg-blue-700 transition">
          홈으로 이동
        </button>
      </Link>
    </div>
  );
}