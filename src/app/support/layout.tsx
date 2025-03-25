export const metadata = {
  title: "고객센터",
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <div style={{margin: "16px", padding: "24px", background: "#fff"}}>{children}</div>;
}