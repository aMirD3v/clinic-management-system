// app/admin/page.tsx
import { Suspense } from 'react';
import { getDashboardStats, getRecentVisits } from './actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { RecentActivityTable } from '@/components/admin/recent-activity-table';
import { Statistic } from '@/components/admin/statistic';
// --- Import Icons ---
// You'll need to install and import icons, e.g., from lucide-react, heroicons, etc.
// Example using lucide-react:
// import { Users, Activity, Pill, Calendar } from 'lucide-react';

export default async function AdminDashboardPage() {
  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<Skeleton className="h-24 w-full " />}>
          {/* Pass dataKey to StatCard */}
          <StatCard  title="Total Students" fetchData={getDashboardStats} dataKey="totalStudents" />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-24 w-full" />}>
          <StatCard title="Active Visits" fetchData={getDashboardStats} dataKey="activeVisits" />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-24 w-full" />}>
          <StatCard title="Medicines Low Stock" fetchData={getDashboardStats} dataKey="lowStockMedicines" />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-24 w-full" />}>
          <StatCard title="Today's Visits" fetchData={getDashboardStats} dataKey="todaysVisits" />
        </Suspense>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="md:col-span-2  bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle>Recent Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-64 w-full" />}>
              <RecentVisitsTableWrapper />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- Updated Helper Component for Statistics ---
async function StatCard({ title, fetchData, dataKey }: { title: string; fetchData: () => Promise<any>; dataKey: string }) {
  const data = await fetchData();
  const value = data[dataKey] ?? '0';

  // --- Define icons and descriptions based on dataKey ---
  let icon: React.ReactNode = null;
  let description: string | undefined = undefined;

  // Example logic for icons and descriptions
  // You would import the icons (e.g., from lucide-react) and assign them here.
  switch (dataKey) {
    case 'totalStudents':
      // icon = <Users className="h-4 w-4 text-muted-foreground" />;
      description = "Total registered students";
      break;
    case 'activeVisits':
      // icon = <Activity className="h-4 w-4 text-muted-foreground" />;
      // Example dynamic description:
      if (typeof value === 'number' && value > 10) {
        description = "High activity";
      } else {
        description = "Normal activity";
      }
      break;
    case 'lowStockMedicines':
      // icon = <Pill className="h-4 w-4 text-muted-foreground" />;
      if (typeof value === 'number' && value > 0) {
         description = `${value} item(s) need restocking`;
      } else {
         description = "All stock levels are adequate";
      }
      break;
    case 'todaysVisits':
      // icon = <Calendar className="h-4 w-4 text-muted-foreground" />;
      description = "Visits recorded today";
      break;
    default:
      // icon = null; // Default or fallback icon if needed
      description = undefined; // No description by default
  }

  return (
    <Statistic
      title={title}
      value={value}
      description={description} // Pass the determined description
      icon={icon}               // Pass the determined icon
    />
  );
}

// Recent Visits Table Wrapper Component (remains the same)
async function RecentVisitsTableWrapper() {
  const recentVisits = await getRecentVisits();
  return <RecentActivityTable visits={recentVisits} />;
}