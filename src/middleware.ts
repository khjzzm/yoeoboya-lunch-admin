import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  console.log("1", token);
  console.log("2", refreshToken);

  const { pathname } = req.nextUrl;

  console.log(`🚀 [Middleware] 현재 경로: ${pathname}`);
  console.log(`🔑 [Middleware] 토큰 확인: ${token ? "✅ 존재함" : "❌ 없음"}`);

  //  API 경로 및 정적 파일 요청 제외 (자동 필터링)
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/user/login") ||
    pathname.startsWith("/user/signup")
  ) {
    return NextResponse.next();
  }

  // JWT 검증
  let isValidToken = false;
  if (token) {
    try {
      isValidToken = true;
    } catch (error) {
      console.warn("⚠️ [Middleware] JWT 검증 실패:", error);
    }
  }

  //  로그인 필요한 페이지인데, 토큰이 없거나 유효하지 않다면 로그인 페이지로 리디렉트
  if (!isValidToken) {
    console.log("🔒 보호된 경로 접근 시도! 로그인 페이지로 리디렉트합니다.");
    return NextResponse.redirect(new URL("/user/login", req.url));
  }

  return NextResponse.next();
}

// `matcher`를 설정하여 보호된 페이지에 대해서만 미들웨어 실행
export const config = {
  matcher: "/:path*", // 모든 경로에서 동작 (필요한 경로만 선택 가능)
};
