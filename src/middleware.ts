import { NextRequest, NextResponse } from "next/server";

// 보호할 페이지 목록 (로그인해야 접근 가능)
const protectedRoutes = ["/"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  console.log(`🚀 [Middleware] 현재 경로: ${pathname}`);
  console.log(`🔑 [Middleware] 토큰 확인: ${token ? "✅ 존재함" : "❌ 없음"}`);

  // ✅ protectedRoutes 중 하나라도 포함되는지 확인
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (!token && isProtected) {
    console.log("🔒 보호된 경로 접근 시도! 로그인 페이지로 리디렉트합니다.");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// `matcher`를 사용하여 특정 경로에서만 `middleware` 실행
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|login|signup).*)",
  ],
};