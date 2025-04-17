"use client";

import { Card, Typography } from "antd";

export default function Home() {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <Card
        style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", background: "#f5f5f5" }}
      >
        <Typography.Paragraph style={{ marginTop: "24px", fontSize: "14px", color: "#888" }}>
          ⚠️ 본 서비스는 <strong>오전 9시부터 오후 6시까지</strong> 운영됩니다.
          <br />
          서버 비용 문제로 인해 운영 시간 외에는 접속이 제한될 수 있습니다. 🥲
        </Typography.Paragraph>

        <Typography.Paragraph style={{ fontSize: "14px", color: "#999" }}>
          🛠️ 정식 서비스 페이지(도메인)는 현재 준비 중입니다. 빠른 시일 내에 오픈될 예정입니다.
        </Typography.Paragraph>
      </Card>
    </div>
  );
}
