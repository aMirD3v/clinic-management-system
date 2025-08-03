
"use client";

import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow, 
} from "@/components/ui/table";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ExpiringSoonList() {
  const { data: stock, error } = useSWR("/api/stock", fetcher);

  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const expiringSoon = stock?.filter((item: any) => {
    const expiryDate = new Date(item.expiryDate);
    return expiryDate > new Date() && expiryDate <= thirtyDaysFromNow;
  });

  return (
    <Card className="bg-white dark:bg-slate-900">
      <CardHeader>
        <CardTitle>Expiring Soon</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <div>Failed to load expiring stock</div>}
        {!stock && <div>Loading...</div>}
        {stock && expiringSoon.length === 0 && (
          <p>No items expiring soon.</p>
        )}
        {stock && expiringSoon.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicine Name</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expiringSoon.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>{item.medicineName}</TableCell>
                  <TableCell>{new Date(item.expiryDate).toLocaleDateString()}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
