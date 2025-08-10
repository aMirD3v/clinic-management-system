import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/lib/theme-context";
import "./globals.css";
import AuthSessionProvider from "@/components/AuthSessionProvider";
import { NotificationToast } from "@/components/NotificationToast";

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

import { getAuthSession } from "@/lib/auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getAuthSession();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > 
        <AuthSessionProvider session={session}>
          <ThemeProvider>
            <NotificationToast />
            {children}
            <Toaster position="top-center" />
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
