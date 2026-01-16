import { Navbar } from "@/components/Navbar";
import { MainLayout } from "@/components/sidebar/MainLayout";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <><Navbar />{children}</>;
}
