export const metadata = {
  title: "회원정보",
};

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return <div style={{margin: "16px", padding: "24px", background: "#fff"}}>{children}</div>;
}