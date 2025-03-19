export const metadata = {
  title: "보안관리",
};

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return <div style={{margin: "16px", padding: "24px", background: "#fff"}}>{children}</div>;
}