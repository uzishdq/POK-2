import type { Metadata } from "next";
import TopNav from "@/components/navigation/top-nav";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Koperasi Karyawan Yayasan Al ghifari",
  description: "sedikit bicara banyak sedekah",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <TopNav />

      <section>{children}</section>

      <Toaster />
    </div>
  );
}
