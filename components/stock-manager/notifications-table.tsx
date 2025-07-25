
"use client";

import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow, 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarOff, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function NotificationsTable() {
  const { data: notifications, error, mutate } = useSWR("/api/notifications", fetcher, { refreshInterval: 30000 });

  if (error) return <div>Failed to load notifications</div>;
  if (!notifications) return <div>Loading...</div>;

  const handleMarkAsRead = async (id: string) => {
    await fetch(`/api/notifications/${id}`, {
      method: "PUT",
    });
    mutate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Message</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map((notification: any) => (
              <TableRow key={notification.id}>
                <TableCell>{notification.message}</TableCell>
                <TableCell>
                  {notification.type === "EXPIRY_WARNING" && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <CalendarOff className="h-3 w-3" /> Expiry Warning
                    </Badge>
                  )}
                  {notification.type === "LOW_STOCK_WARNING" && (
                    <Badge className="flex items-center gap-1 bg-orange-500 text-white">
                      <AlertTriangle className="h-3 w-3" /> Low Stock Warning
                    </Badge>
                  )}
                  {!["EXPIRY_WARNING", "LOW_STOCK_WARNING"].includes(notification.type) && (
                    <span>{notification.type}</span>
                  )}
                </TableCell>
                <TableCell>{new Date(notification.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{notification.read ? "Read" : "Unread"}</TableCell>
                <TableCell>
                  {!notification.read && (
                    <Button variant="outline" size="sm" onClick={() => handleMarkAsRead(notification.id)}>
                      Mark as Read
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
