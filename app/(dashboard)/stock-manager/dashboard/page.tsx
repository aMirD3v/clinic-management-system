
"use client";

import { StockTable } from "@/components/stock-manager/stock-table";
import { StatisticCard } from "@/components/stock-manager/statistic-card";
import { RecentActivityTable } from "@/components/stock-manager/recent-activity-table";
import useSWR from "swr";
import { Package, AlertTriangle, CalendarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { ExpiringSoonList } from "@/components/stock-manager/expiring-soon-list";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function StockManagerDashboardPage() {
  const { data: dashboardData, error, mutate } = useSWR("/api/stock/dashboard", fetcher);

  const handleCheckExpiry = async () => {
    // toast.loading("Checking for expiring stock...");
    const res = await fetch("/api/notifications/check-expiry");
    if (res.ok) {
      toast.success("Expiry check complete!");
      mutate(); // Re-fetch dashboard data to update notification count
    } else {
      toast.error("Failed to check expiry.");
    }
  };

  if (error) return <div>Failed to load dashboard data</div>;
  if (!dashboardData) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Stock Management Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <StatisticCard
          title="Total Stock"
          value={dashboardData.totalStock}
          icon={<Package className="h-4 w-4 text-muted-foreground" />}
        />
        <StatisticCard
          title="Low Stock Items"
          value={dashboardData.lowStock}
          icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
        />
        <StatisticCard
          title="Expired Items"
          value={dashboardData.expiredStock}
          icon={<CalendarOff className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="flex justify-end mb-4">
        <Button onClick={handleCheckExpiry}>Manually Check Expiry</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        
        <div>
          <h2 className="text-xl font-bold mb-4">Recent Activities</h2>
          <RecentActivityTable />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Expiring Soon</h2>
          <ExpiringSoonList />
        </div>
      </div>
    </div>
  );
}
