"use client";

import {Card, Typography} from "antd";

export default function Home() {
  return (
    <div style={{padding: "40px", textAlign: "center"}}>
      <Typography.Title level={1}>🎉 Yeoboya Lunch Admin</Typography.Title>
      <Typography.Paragraph style={{fontSize: "18px", color: "#555"}}>
        관리자 페이지에 오신 것을 환영합니다.
      </Typography.Paragraph>

      <Card style={{maxWidth: "600px", margin: "40px auto", padding: "20px", background: "#f5f5f5"}}>
        <Typography.Text style={{fontSize: "16px"}}>
          좌측 메뉴를 통해 원하는 기능을 이용하세요.
          <br/>
          설정, 사용자 관리 등 다양한 기능을 제공합니다.
        </Typography.Text>
      </Card>
    </div>
  );
}