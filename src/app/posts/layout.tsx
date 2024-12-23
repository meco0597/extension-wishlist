import type { Metadata } from "next";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      {children}
      <Toaster />
    </ProtectedRoute>
  );
}
