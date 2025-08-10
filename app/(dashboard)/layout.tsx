export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/lib/theme-context";
import "../globals.css";
import AuthSessionProvider from "@/components/AuthSessionProvider";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { getAuthSession } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clinic Management System",
  description: "Jigjiga University",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getAuthSession();
  return (
    <AuthSessionProvider session={session}>
      <ThemeProvider>
        <DashboardLayout session={session}>
        {children}
        </DashboardLayout>
        <Toaster position="top-center" />
      </ThemeProvider>
    </AuthSessionProvider>
  );
}
