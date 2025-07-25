"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { FaChevronRight } from "react-icons/fa";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Navbar } from "./Navbar";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    socs: pathname.includes("/socs"),
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
  const toggleProfileDropdown = () => setProfileDropdownOpen((prev) => !prev);

  const linkClass = (path: string) =>
    `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out ${
      pathname === path
        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
        : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
    }`;

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
              {/* <h1 className="text-xl font-bold text-gray-900 dark:text-white">JJU</h1>
                  <div className="bg-gray-900 dark:bg-blue-500 w-0.5 h-8"></div> */}
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
          {role === "RECEPTION" && (
            <>
              <Link
                href="/admin"
                onClick={() => setSidebarOpen(false)}
                className={linkClass("/dashboard/admin")}
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

              {/* Student One Card System Dropdown */}
              <div className="space-y-1">
                <button
                  onClick={() => toggleMenu("socs")}
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
                    Clinic Report
                  </div>
                  <div
                    className={`transition-transform duration-200 ${
                      openMenus.socs ? "rotate-90" : ""
                    }`}
                  >
                    <FaChevronRight className="w-3 h-3" />
                  </div>
                </button>

                <div
                  className={`ml-8 space-y-1 overflow-hidden transition-all duration-300 ${
                    openMenus.socs
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <Link
                    href="/dashboard/socs/reports/gate"
                    onClick={() => setSidebarOpen(false)}
                    className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Patient List
                  </Link>
                  <Link
                    href="/dashboard/socs/reports/cafeteria"
                    onClick={() => setSidebarOpen(false)}
                    className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Laboratoy Report
                  </Link>
                  <Link
                    href="/dashboard/socs/students"
                    onClick={() => setSidebarOpen(false)}
                    className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Recent Visits
                  </Link>
                </div>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => toggleMenu("socs")}
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
                    Stock Report
                  </div>
                  <div
                    className={`transition-transform duration-200 ${
                      openMenus.socs ? "rotate-90" : ""
                    }`}
                  >
                    <FaChevronRight className="w-3 h-3" />
                  </div>
                </button>

                <div
                  className={`ml-8 space-y-1 overflow-hidden transition-all duration-300 ${
                    openMenus.socs
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <Link
                    href="/dashboard/socs/reports/gate"
                    onClick={() => setSidebarOpen(false)}
                    className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    List Stocks
                  </Link>
                  <Link
                    href="/dashboard/socs/reports/cafeteria"
                    onClick={() => setSidebarOpen(false)}
                    className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Pharmacy Report
                  </Link>
                  <Link
                    href="/dashboard/socs/students"
                    onClick={() => setSidebarOpen(false)}
                    className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    List Pharamacies
                  </Link>
                </div>
              </div>

              <Link
                href="/dashboard/admin/users"
                onClick={() => setSidebarOpen(false)}
                className={linkClass("/dashboard/admin/users")}
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
                Manage Users
              </Link>
            </>
          )}

          {role === "staff" && (
            <h1>hello</h1>
          )}

          {role === "STOCK_MANAGER" && (
            <>
              <Link
                href="/stock-manager/dashboard"
                onClick={() => setSidebarOpen(false)}
                className={linkClass("/stock-manager/dashboard")}
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

        {/* Sidebar Footer */}
        {/* <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">{getProfileInitial()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {session?.user?.name || session?.user?.email}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{role?.toLowerCase()}</p>
            </div>
          </div>
        </div> */}
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
