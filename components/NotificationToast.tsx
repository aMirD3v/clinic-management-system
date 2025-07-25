
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import toast from "react-hot-toast";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function NotificationToast() {
  const { data: session } = useSession();
  const { data: notifications } = useSWR(session?.user?.role === "STOCK_MANAGER" ? "/api/notifications" : null, fetcher);

  useEffect(() => {
    if (session?.user?.role === "STOCK_MANAGER" && notifications) {
      const unreadNotifications = notifications.filter((n: any) => !n.read);
      if (unreadNotifications.length > 0) {
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 absolute top-10 right-0`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.305 3.244 2.077 3.244h14.036c1.772 0 2.943-1.744 2.077-3.244l-7.106-12.414a1.125 1.125 0 00-1.948 0L3.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    You have {unreadNotifications.length} unread notifications!
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Click to view details.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        ), {
          duration: 5000,
          position: 'top-left',
        });
      }
    }
  }, [session, notifications]);

  return null;
}
