
"use client";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow, 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecentActivity {
  id: string;
  activity: string;
  createdAt: string;
  stock: {
    medicineName: string;
  };
}

interface RecentActivityTableProps {
  recentActivities: RecentActivity[];
}

export function RecentActivityTable({ recentActivities }: RecentActivityTableProps) {
  return (
    <Card className="bg-white dark:bg-slate-900">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Activity</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentActivities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>{activity.activity}</TableCell>
                <TableCell>{activity.stock.medicineName}</TableCell>
                <TableCell>{new Date(activity.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
