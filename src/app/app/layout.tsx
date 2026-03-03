import PrivyProvider from "@/providers/PrivyProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <PrivyProvider>{children}</PrivyProvider>;
}
