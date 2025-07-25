
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

  if (error) return <div>Failed to load expiring stock</div>;
  if (!stock) return <div>Loading...</div>;

  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const expiringSoon = stock.filter((item: any) => {
    const expiryDate = new Date(item.expiryDate);
    return expiryDate > new Date() && expiryDate <= thirtyDaysFromNow;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expiring Soon</CardTitle>
      </CardHeader>
      <CardContent>
        {expiringSoon.length === 0 ? (
          <p>No items expiring soon.</p>
        ) : (
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
