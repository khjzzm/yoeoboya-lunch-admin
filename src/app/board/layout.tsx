export const metadata = {
  title: "게시판관리",
};

export default function BoardLayout({ children }: { children: React.ReactNode }) {
  return <div style={{margin: "16px", padding: "24px", background: "#fff"}}>{children}</div>
}