import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // ✅ 정적 생성 방지 (빌드 시 문제 해결)

export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://admin.yeoboya-lunch.com</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
    </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
