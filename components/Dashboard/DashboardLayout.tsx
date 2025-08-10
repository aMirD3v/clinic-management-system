"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { FaChevronRight } from "react-icons/fa";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { Navbar } from "./Navbar";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLayout({
  children,
  session: serverSession,
}: {
  children: React.ReactNode;
  session: any;
}) {
  const pathname = usePathname();
  // useSession is still valuable for client-side updates, e.g., after a sign-out.
  const { data: clientSession, status } = useSession();
  
  // Prioritize the server-side session for the initial render.
  const session = serverSession || clientSession;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    clinic_reports: pathname.includes("/clinic_reports"),
    stock_reports: pathname.includes("/stock_reports"),
  });
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const role = session?.user?.role;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const linkClass = (path: string) =>
    `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out ${
      pathname === path
        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
        : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
    }`;

  // Show loading skeleton only if the session is not available from server or client.
  if (status === "loading" && !serverSession) {
    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4">
                <div className="flex flex-col space-y-4">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-8 w-full mt-4" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            </aside>
            <main className="flex-1 p-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-64 w-full mt-4" />
            </main>
        </div>
    );
  }


  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative md:z-auto overflow-hidden flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <Link href="/" className="flex items-center space-x-3 group">
            <div>
              <Image
                src="/logo.png"
                alt="Jigjiga University"
                width={40}
                height={40}
                className="rounded-lg"
              />
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <div className="flex flex-col">
                <h1 className="text-sm font-bold text-gray-900 dark:text-white">
                  Jigjiga University
                </h1>
                <p className="text-xs text-blue-500 font-medium -mt-1">
                  Clinic Management System
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {role === "ADMIN" && (
            <>
              <Link
                href="/admin"
                onClick={() => setSidebarOpen(false)}
                className={linkClass("/admin")}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0a2 2 0 01-2 2H10a2 2 0 01-2-2v0z"
                  />
                </svg>
                Dashboard
              </Link>

              <Link
                href="/admin/visits"
                onClick={() => setSidebarOpen(false)}
                className={linkClass("/admin/visits")}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2z"
                  />
                </svg>
                Patient Visits
              </Link>

              <Link
                href="/admin/stock"
                onClick={() => setSidebarOpen(false)}
                className={linkClass("/admin/stock")}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H7a2 2 0 00-2 2v2m7-7h.01"
                  />
                </svg>
                Inventory/Stock
              </Link>

              <div className="space-y-1">
                <button
                  onClick={() => toggleMenu("reports")}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2z"
                      />
                    </svg>
                    Clinic Reports
                  </div>
                  <div
                    className={`transition-transform duration-200 ${
                      openMenus.reports ? "rotate-90" : ""
                    }`}
                  >
                    <FaChevronRight className="w-3 h-3" />
                  </div>
                </button>

                <div
                  className={`ml-8 space-y-1 overflow-hidden transition-all duration-300 ${
                    openMenus.reports
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <Link
                    href="/admin/reports/visitors"
                    onClick={() => setSidebarOpen(false)}
                      className={linkClass("/admin/reports/visitors")}
                      >
                    Visitor Report
                  </Link>
                  <Link
                    href="/admin/reports/stock"
                    onClick={() => setSidebarOpen(false)}
                 className={linkClass("/admin/reports/stock")}
                     >
                    Stock Report
                  </Link>
                </div>
              </div>

              <Link
                href="/admin/users"
                onClick={() => setSidebarOpen(false)}
                className={linkClass("/admin/users")}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
                User Management
              </Link>
            </>
          )}

          {role === "staff" && (
            <h1>hello</h1>
          )}

          {role === "STOCK_MANAGER" && (
            <>
              <Link
                href="/stock-manager"
                onClick={() => setSidebarOpen(false)}
                className={linkClass("/stock-manager")}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0a2 2 0 01-2 2H10a2 2 0 01-2-2v0z"
                  />
                </svg>
                Dashboard
              </Link>
              <Link
                href="/stock-manager/stock"
                onClick={() => setSidebarOpen(false)}
                className={linkClass("/stock-manager/stock")}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H7a2 2 0 00-2 2v2m7-7h.01"
                  />
                </svg>
                Stock
              </Link>
              <Link
                href="/stock-manager/notifications"
                onClick={() => setSidebarOpen(false)}
                className={linkClass("/stock-manager/notifications")}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17l-3 3m0 0l-3-3m3 3V4m0 16a2 2 0 01-2-2h-3a2 2 0 00-2 2v2a2 2 0 002 2h3a2 2 0 002-2v-2a2 2 0 00-2-2z"
                  />
                </svg>
                Notifications
              </Link>
            </>
          )}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Bars3Icon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Jigjiga University
            </h1>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
